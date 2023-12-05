import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import {
  Client,
  createClient,
  fetchExchange,
  subscriptionExchange,
} from "@urql/core";
import { Client as WSClient, createClient as createWSClient } from "graphql-ws";
import "cross-fetch/polyfill";
import WebSocket from "isomorphic-ws";
import { Observable } from "rxjs";
import TypedEmitter from "typed-emitter";
import { pipe, subscribe } from "wonka";
import EventEmitter from "./events";
import {
  AddGroupInput,
  AddGroupsDocument,
  AddParticipantDocument,
  AddScopeInput,
  AddScopesDocument,
  AddStepInput,
  AddStepsDocument,
  AttributesDocument,
  AttributesQueryVariables,
  ChangesDocument,
  GlobalAttributesDocument,
  GroupsDocument,
  GroupsQueryVariables,
  LinkDocument,
  LinkInput,
  LoginDocument,
  OnAnyEventDocument,
  OnAnyEventInput,
  OnEventDocument,
  OnEventInput,
  ParticipantsDocument,
  ParticipantsQueryVariables,
  RegisterServiceDocument,
  ScopedAttributesDocument,
  ScopedAttributesInput,
  ScopesDocument,
  ScopesQueryVariables,
  SetAttributeInput,
  SetAttributesDocument,
  StepsDocument,
  StepsQueryVariables,
  TokenLoginDocument,
  TransitionDocument,
  TransitionInput,
} from "./generated/graphql";

const DefaultAddress = "http://localhost:4737/query";

export type TajribaEvents = {
  // Connected and ready
  connected: () => void;
  // Disconnected will be followed by an automatic reconnection attempt
  disconnected: () => void;
  // Disconnected will be followed by an automatic reconnection attempt
  error: (error: Error) => void;
  // A closed connection will not reopen
  closed: () => void;
  // A request resulted in an access denied error (token likely expired).
  accessDenied: () => void;
};

export class Tajriba extends (EventEmitter as new () => TypedEmitter<TajribaEvents>) {
  public userAgent = "Tajriba.js";
  public useHTTP = false;

  private _connected = false;
  private _client?: Client;
  private _wsClient?: WSClient;
  private _firstConnProm?: {
    resolve: (value: void) => void;
    reject: (reason?: any) => void;
  };

  protected constructor(
    readonly url: string = DefaultAddress,
    readonly token?: string
  ) {
    super();
  }

  // create creates a Tajriba instance without initiating a connecting.
  static create(url: string = DefaultAddress) {
    return new Tajriba(url);
  }

  // connect creates a tajriba connection but does not wait for the connectino.
  static connect(url: string = DefaultAddress) {
    const t = new Tajriba(url);
    t.connect();
    return t;
  }

  // createAndAwait creates a connection and waits for the connection to be
  // ready.
  static async createAndAwait(url: string = DefaultAddress) {
    const t = new Tajriba(url);

    const p = t.connectionStatus();
    t.connect();

    await p;

    return t;
  }

  async connectAndAwait() {
    const p = this.connectionStatus();
    this.connect();
    await p;
  }

  protected static async authenticated(
    url: string = DefaultAddress,
    token: string
  ) {
    const t = new Tajriba(url, token);

    const p = t.connectionStatus();
    t.connect();

    try {
      await p;
    } catch (err) {
      t.stop();
      throw err;
    }

    return t;
  }

  async sessionAdmin(sessionToken: string) {
    const t = new TajribaAdmin(this.url, sessionToken);
    t.useHTTP = this.useHTTP;

    const p = t.connectionStatus();
    t.connect();

    try {
      await p;
    } catch (err) {
      t.stop();
      throw err;
    }

    return t;
  }

  async sessionParticipant(
    sessionToken: string,
    participant: ParticipantIdent
  ) {
    if (!participant) {
      throw "participant required";
    }

    const t = new TajribaParticipant(this.url, sessionToken, participant);
    t.useHTTP = this.useHTTP;

    const p = t.connectionStatus();
    t.connect();

    try {
      await p;
    } catch (err) {
      t.stop();
      throw err;
    }

    return t;
  }

  get connected() {
    return this._connected;
  }

  async login(username: string, password: string): Promise<string> {
    const loginRes = await this.client
      .mutation(LoginDocument, {
        input: {
          username,
          password,
        },
      })
      .toPromise();

    const sessionToken = loginRes.data?.login.sessionToken;
    if (!sessionToken) {
      throw "Authentication failed";
    }

    return sessionToken;
  }

  async tokenLogin(token: string): Promise<string> {
    const loginRes = await this.client
      .mutation(TokenLoginDocument, {
        input: {
          token,
        },
      })
      .toPromise();

    const sessionToken = loginRes.data?.tokenLogin.sessionToken;
    if (!sessionToken) {
      throw "Authentication failed";
    }

    return sessionToken;
  }

  async registerService(name: string, token: string): Promise<string> {
    const res = await this.client
      .mutation(RegisterServiceDocument, {
        input: {
          name,
          token,
        },
      })
      .toPromise();

    const rs = res.data?.registerService;

    if (!rs) {
      console.error(res);
      throw "Failed service registration";
    }

    const { sessionToken } = rs;
    if (!sessionToken) {
      console.error(res);
      throw "Authentication failed";
    }

    return sessionToken;
  }

  async registerParticipant(
    identifier: string
  ): Promise<[string, ParticipantIdent]> {
    const addPartRes = await this.client
      .mutation(AddParticipantDocument, {
        input: {
          identifier,
        },
      })
      .toPromise();

    const addParticipant = addPartRes.data?.addParticipant;

    if (!addParticipant) {
      throw "Unknown participant";
    }

    const { sessionToken, participant } = addParticipant;
    if (!sessionToken || !participant) {
      throw "Authentication failed";
    }

    return [sessionToken, participant];
  }

  get wsURL() {
    if (this.url.startsWith("http://")) {
      return this.url.replace("http://", "ws://");
    } else if (this.url.startsWith("https://")) {
      return this.url.replace("https://", "wss://");
    } else {
      throw "invalid URL";
    }
  }

  private connectionStatus() {
    return new Promise((resolve, reject) => {
      this._firstConnProm = { resolve, reject };
    });
  }

  get client() {
    if (!this._client) {
      this.connect();
    }

    return this._client!;
  }

  private connect() {
    if (this._client) {
      return;
    }

    let authToken = "";
    if (this.token) {
      authToken = `Bearer ${this.token}`;
    }

    const wsClient = createWSClient({
      url: this.wsURL,
      connectionAckWaitTimeout: 5000,
      retryAttempts: 10000000000,
      lazy: false,
      shouldRetry: () => true,
      webSocketImpl: WebSocket,
      on: {
        connecting: () => {
          // console.debug("websocket: connecting");
        },
        connected: () => {
          // console.debug("websocket: connected");
        },
        // message: (message) => {
        //   console.info("message", message);
        // },
        opened: (sock) => {
          // console.debug("websocket: established");

          if (
            this._firstConnProm &&
            (<WebSocket>sock).readyState === WebSocket.OPEN
          ) {
            this._firstConnProm.resolve();
            delete this._firstConnProm;
          }

          this.emit("connected");
          this._connected = true;
        },
        closed: (event) => {
          this.emit("disconnected");
          this._connected = false;
        },
        error: (err) => {
          // console.error("websocket: error", err);
          this.emit("error", err as Error);
        },
      },
      connectionParams: () => {
        const params: { [key: string]: string } = {
          "User-Agent": this.userAgent,
        };

        if (authToken) {
          params["authToken"] = authToken;
        }

        return params;
      },
      onNonLazyError: (err) => {
        console.debug("websocket: error (laz)", err);
        if (this._firstConnProm) {
          this._firstConnProm.reject(err);
          delete this._firstConnProm;
        }
      },
    });

    this._wsClient = wsClient;

    this._client = createClient({
      url: this.url,
      // fetch: fetch,
      exchanges: [
        fetchExchange,
        subscriptionExchange({
          enableAllOperations: !this.useHTTP,
          forwardSubscription: (operation) => {
            return {
              subscribe: (sink) => {
                return {
                  unsubscribe: wsClient.subscribe(operation, sink),
                };
              },
            };
          },
        }),
      ],
    });
  }

  stop() {
    if (this._wsClient) {
      this._wsClient.dispose();
      delete this._wsClient;
    }

    if (this._client) {
      delete this._client;
    }

    this.emit("closed");
  }

  async setAttributes(input: SetAttributeInput[]) {
    return await this.mutate(SetAttributesDocument, { input }, (data) =>
      data?.setAttributes.map((p) => p.attribute)
    );
  }

  async setAttribute(input: SetAttributeInput) {
    return (await this.setAttributes([input]))[0];
  }

  /**
   * globalAttributes returns Attributes for the global Scope, which is a singleton
   * permission-less Scope that any client can access, even if not logged in. The
   * name of the global Scope is "global" and can only be updated by Users. All
   * Attributes in this Scope will be returned initially, then any update to
   * Attributes from this Scopes.
   */
  globalAttributes() {
    return this.subscribe(GlobalAttributesDocument, {}, (data) => {
      if (data.globalAttributes) {
        return data.globalAttributes;
      }
    });
  }

  async query<T = any, TVariables extends object = {}, U = any>(
    query: TypedDocumentNode<T, TVariables>,
    variables: TVariables,
    data: (res: T) => U
  ): Promise<U> {
    const res = await this.client.query(query, variables).toPromise();

    if (res.error) {
      throw res.error;
    }

    if (res.data) {
      const d = data(res.data);
      if (d) {
        return d;
      }
    }

    throw "no results";
  }

  async mutate<T = any, TVariables extends object = {}, U = any>(
    mutation: TypedDocumentNode<T, TVariables>,
    variables: TVariables,
    data: (res: T) => U | undefined
  ) {
    const res = await this.client.mutation(mutation, variables).toPromise();

    if (res.error) {
      throw res.error;
    }

    let r: U | undefined;

    if (res.data) {
      r = data(res.data);
    }

    if (!r) {
      console.log("NOT FOUND", JSON.stringify(res, null, "  "));
      throw new Error("not found");
    }

    return r;
  }

  subscribe<T = any, TVariables extends object = {}, U = any>(
    query: TypedDocumentNode<T, TVariables>,
    variables: TVariables,
    data: (res: T) => U | undefined
  ): Observable<U> {
    return new Observable((subscriber) => {
      return pipe(
        this.client.subscription(query, variables),
        subscribe((res) => {
          if (res.error) {
            for (let err of res.error.graphQLErrors) {
              if (err.message === "Access Denied") {
                // Cancel connection
                this.emit("accessDenied");

                this.stop();

                return;
              }
            }

            subscriber.error(res.error);

            return;
          }

          if (res.data) {
            const r = data(res.data);
            if (r) {
              subscriber.next(r);

              return;
            }
          }

          subscriber.error(new Error("subscription data missing"));
        })
      );
    });
  }
}

export class TajribaAdmin extends Tajriba {
  /** addSteps creates new Steps. */
  async addSteps(input: AddStepInput[]) {
    return await this.mutate(AddStepsDocument, { input }, (data) =>
      data?.addSteps.map((p) => p.step)
    );
  }

  /** addStep creates a new Step. */
  async addStep(input: AddStepInput) {
    return (await this.addSteps([input]))[0];
  }

  /** steps returns all steps */
  async steps(input: StepsQueryVariables) {
    return await this.query(StepsDocument, { ...input }, (data) => data?.steps);
  }

  /** addGroups creates new Groups. */
  async addGroups(input: AddGroupInput[]) {
    return await this.mutate(AddGroupsDocument, { input }, (data) =>
      data?.addGroups.map((p) => p.group)
    );
  }

  /** addGroup creates a new Group. */
  async addGroup(input: AddGroupInput) {
    return (await this.addGroups([input]))[0];
  }

  /** groups returns all groups */
  async groups(input: GroupsQueryVariables) {
    return await this.query(
      GroupsDocument,
      { ...input },
      (data) => data?.groups
    );
  }

  /** addScopes creates new Scopes. */
  async addScopes(input: AddScopeInput[]) {
    return await this.mutate(AddScopesDocument, { input }, (data) =>
      data?.addScopes.map((p) => p.scope)
    );
  }

  /** addScope creates a new Scope. */
  async addScope(input: AddScopeInput) {
    return (await this.addScopes([input]))[0];
  }

  /**
   * scopes returns all scopes
   * If filter is provided it will return scopes matching any
   * ScopedAttributesInput.
   */
  async scopes(input: ScopesQueryVariables) {
    return await this.query(
      ScopesDocument,
      { ...input },
      (data) => data?.scopes
    );
  }

  /**
   * attributes returns all attributes for a scope.
   */
  async attributes(input: AttributesQueryVariables) {
    return await this.query(
      AttributesDocument,
      { ...input },
      (data) => data?.attributes
    );
  }

  /** participants returns all Participants in the system. */
  async participants(input: ParticipantsQueryVariables) {
    return await this.query(
      ParticipantsDocument,
      { ...input },
      (data) => data?.participants
    );
  }

  /** transition transitions a Step from one state to the next. */
  async transition(input: TransitionInput) {
    return await this.mutate(
      TransitionDocument,
      { input },
      (data) => data?.transition.transition
    );
  }

  /** addLink adds Links object between Participants and Nodes. */
  async addLink(input: LinkInput) {
    return await this.mutate(LinkDocument, { input }, (data) => data?.link);
  }

  /** links Participants to Nodes. */
  async link(input: LinkInput) {
    return await this.addLink({ ...input, link: true });
  }

  /** unlinks Participants from Nodes. */
  async unlink(input: LinkInput) {
    return await this.addLink({ ...input, link: false });
  }

  /**
   * scopedAttributes returns Attributes for Scopes matching the keys or KVs input.
   * keys or KVs (only one) must be provided. All Attributes in Scopes matching
   * will be returned initially, then any update to Attributes within the matching
   * Scopes.
   */
  scopedAttributes(
    /** SubAttributesPayload is the return payload for the addScope mutation. */
    input: ScopedAttributesInput[]
  ) {
    return this.subscribe(ScopedAttributesDocument, { input }, (data) => {
      if (data.scopedAttributes) {
        return data.scopedAttributes;
      }
    });
  }

  /**
   * onEvent attaches hooks to specified events. Optionally, a nodeType and nodeID
   * can be specified to only look at events for a particular record.
   */
  onEvent(
    /** OnEventInput is the input for the onEvent subscription. */
    input: OnEventInput
  ) {
    return this.subscribe(OnEventDocument, { input }, (data) => {
      if (data.onEvent) {
        return data.onEvent;
      }
    });
  }

  /** onAnyEvent works like onEvent, except all events are subscribed to. */
  onAnyEvent(
    /** OnAnyEventInput is the input for the onAnyEvent subscription. */
    input: OnAnyEventInput
  ) {
    return this.subscribe(OnAnyEventDocument, { input }, (data) => {
      if (data.onAnyEvent) {
        return data.onAnyEvent;
      }
    });
  }
}

export interface ParticipantIdent {
  id: string;
  identifier: string;
}

export class TajribaParticipant extends Tajriba {
  constructor(
    readonly url: string = DefaultAddress,
    readonly token: string,
    public participant: ParticipantIdent
  ) {
    super(url, token);
  }

  get id() {
    return this.participant.id;
  }

  get identifier() {
    return this.participant.identifier;
  }

  /**
   * changes returns changes of interest for the Participant.
   * */
  changes() {
    return this.subscribe(ChangesDocument, {}, (data) => {
      if (data.changes) {
        return data.changes;
      }
    });
  }
}
