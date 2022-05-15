import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { Client as WSClient, createClient as createWSClient } from "graphql-ws";
import { Client, createClient, subscriptionExchange } from "urql";
import { pipe, subscribe } from "wonka";
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
  ChangePayload,
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
  OnEventPayload,
  Participant,
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
  SubAttributesPayload,
  TransitionDocument,
  TransitionInput,
} from "./generated/graphql";

const DefaultAddress = "http://localhost:4737/query";

export class Tajriba {
  private _client?: Client;
  private _wsClient?: WSClient;
  private _firstConnProm?: {
    resolve: (value: void) => void;
    reject: (reason?: any) => void;
  };
  public reconnect = true;
  public userAgent = "";

  constructor(readonly url: string = DefaultAddress, readonly token?: string) {}

  static async sessionAdmin(
    url: string = DefaultAddress,
    sessionToken: string
  ) {
    const t = new Tajriba(url, sessionToken);
    const p = t.connectionStatus();
    t.connect();
    try {
      await p;
    } catch (err) {
      t.stop();
      throw err;
    }
    return new TajribaAdmin(t);
  }

  static async sessionParticipant(
    url: string = DefaultAddress,
    sessionToken: string,
    participant: Participant
  ) {
    const t = new Tajriba(url, sessionToken);
    const p = t.connectionStatus();
    t.connect();
    try {
      await p;
    } catch (err) {
      t.stop();
      throw err;
    }
    return new TajribaParticipant(t, participant);
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
      retryAttempts: 10000000000,
      shouldRetry: () => true,
      on: {
        opened: (socket) => {
          if (this._firstConnProm) {
            this._firstConnProm.resolve();
            this._firstConnProm = undefined;
          }
        },
        error: (err) => {
          if (this._firstConnProm) {
            this._firstConnProm.reject(err);
            this._firstConnProm = undefined;
          }
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
    });
    this._wsClient = wsClient;

    this._client = createClient({
      url: this.url,
      exchanges: [
        subscriptionExchange({
          enableAllOperations: true,
          forwardSubscription: (operation) => {
            return {
              subscribe: (sink) => {
                const dispose = wsClient.subscribe(operation, sink);
                return {
                  unsubscribe: dispose,
                };
              },
            };
          },
        }),
      ],
    });
  }

  async stop() {
    if (this._wsClient) {
      this._wsClient.terminate();
      delete this._wsClient;
    }

    if (this._client) {
      delete this._client;
    }
  }

  async login(
    username: string,
    password: string
  ): Promise<[TajribaAdmin, string]> {
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

    const t = new Tajriba(this.url, sessionToken);

    return [new TajribaAdmin(t), sessionToken];
  }

  async registerParticipant(
    identifier: string
  ): Promise<[TajribaParticipant, string]> {
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

    const { sessionToken } = addParticipant;
    if (!sessionToken) {
      throw "Authentication failed";
    }

    const participant = addParticipant.participant;

    const t = new Tajriba(this.url, sessionToken);

    return [new TajribaParticipant(t, participant), sessionToken];
  }

  async registerService(
    name: string,
    token: string
  ): Promise<[TajribaAdmin, string]> {
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
      throw "Failed service registration";
    }

    const { sessionToken } = rs;
    if (!sessionToken) {
      throw "Authentication failed";
    }

    const t = new Tajriba(this.url, sessionToken);
    t.userAgent = name;

    return [new TajribaAdmin(t), sessionToken];
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
  globalAttributes(
    /** cb with scoped attribute updates or an error */
    cb: (payload: SubAttributesPayload, error: Error | undefined) => any
  ) {
    return this.subscribe(
      GlobalAttributesDocument,
      {},
      (data) => {
        if (data.globalAttributes) {
          return <SubAttributesPayload>data.globalAttributes;
        }
      },
      cb
    );
  }

  async query<T = any, TVariables extends object = {}, U = any>(
    query: TypedDocumentNode<T, TVariables>,
    variables: TVariables,
    data: (res: T) => U
  ): Promise<U> {
    const res = await this.client.query(query, variables).toPromise();

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

    let r: U | undefined;

    if (res.data) {
      r = data(res.data);
    }

    if (!r) {
      throw new Error("not found");
    }

    return r;
  }

  subscribe<T = any, TVariables extends object = {}, U = any>(
    query: TypedDocumentNode<T, TVariables>,
    variables: TVariables,
    data: (res: T) => U | undefined,
    cb: (response: U, error: Error | undefined) => any
  ) {
    const { unsubscribe } = pipe(
      this.client.subscription(query, variables),

      subscribe((res) => {
        // if (err) {
        //   cb(<U>{}, err);
        //   return
        // }

        if (res.data) {
          const r = data(res.data);
          if (r) {
            cb(r, undefined);
            return;
          }
        }

        console.error("data missing", res);

        cb(<U>{}, new Error("data missing from event"));
      })
    );

    return unsubscribe;
  }
}

export class TajribaUser {
  constructor(protected taj: Tajriba) {}

  async setAttributes(input: SetAttributeInput[]) {
    return this.taj.setAttributes(input);
  }

  async setAttribute(input: SetAttributeInput) {
    return this.taj.setAttribute(input);
  }

  /**
   * globalAttributes returns Attributes for the global Scope, which is a singleton
   * permission-less Scope that any client can access, even if not logged in. The
   * name of the global Scope is "global" and can only be updated by Users. All
   * Attributes in this Scope will be returned initially, then any update to
   * Attributes from this Scopes.
   */
  globalAttributes(
    /** cb with scoped attribute updates or an error */
    cb: (payload: SubAttributesPayload, error: Error | undefined) => any
  ) {
    return this.taj.globalAttributes(cb);
  }
}

export class TajribaAdmin extends TajribaUser {
  constructor(protected taj: Tajriba) {
    super(taj);
  }

  async stop() {
    this.taj.stop();
  }

  /** addSteps creates new Steps. */
  async addSteps(input: AddStepInput[]) {
    return await this.taj.mutate(AddStepsDocument, { input }, (data) =>
      data?.addSteps.map((p) => p.step)
    );
  }

  /** addStep creates a new Step. */
  async addStep(input: AddStepInput) {
    return (await this.addSteps([input]))[0];
  }

  /** steps returns all steps */
  async steps(input: StepsQueryVariables) {
    return await this.taj.query(
      StepsDocument,
      { ...input },
      (data) => data?.steps
    );
  }

  /** addGroups creates new Groups. */
  async addGroups(input: AddGroupInput[]) {
    return await this.taj.mutate(AddGroupsDocument, { input }, (data) =>
      data?.addGroups.map((p) => p.group)
    );
  }

  /** addGroup creates a new Group. */
  async addGroup(input: AddGroupInput) {
    return (await this.addGroups([input]))[0];
  }

  /** groups returns all groups */
  async groups(input: GroupsQueryVariables) {
    return await this.taj.query(
      GroupsDocument,
      { ...input },
      (data) => data?.groups
    );
  }

  /** addScopes creates new Scopes. */
  async addScopes(input: AddScopeInput[]) {
    return await this.taj.mutate(AddScopesDocument, { input }, (data) =>
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
    return await this.taj.query(
      ScopesDocument,
      { ...input },
      (data) => data?.scopes
    );
  }

  /**
   * attributes returns all attributes for a scope.
   */
  async attributes(input: AttributesQueryVariables) {
    return await this.taj.query(
      AttributesDocument,
      { ...input },
      (data) => data?.attributes
    );
  }

  /** participants returns all Participants in the system. */
  async participants(input: ParticipantsQueryVariables) {
    return await this.taj.query(
      ParticipantsDocument,
      { ...input },
      (data) => data?.participants
    );
  }

  /** transition transitions a Step from one state to the next. */
  async transition(input: TransitionInput) {
    return await this.taj.mutate(
      TransitionDocument,
      { input },
      (data) => data?.transition.transition
    );
  }

  /** addLink adds Links object between Participants and Nodes. */
  private async addLink(input: LinkInput) {
    return await this.taj.mutate(LinkDocument, { input }, (data) => data?.link);
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
    input: ScopedAttributesInput[],
    /** cb with scoped attribute updates or an error */
    cb: (payload: SubAttributesPayload, error: Error | undefined) => any
  ) {
    return this.taj.subscribe(
      ScopedAttributesDocument,
      { input },
      (data) => {
        if (data.scopedAttributes) {
          return <SubAttributesPayload>data.scopedAttributes;
        }
      },
      cb
    );
  }

  /**
   * onEvent attaches hooks to specified events. Optionally, a nodeType and nodeID
   * can be specified to only look at events for a particular record.
   */
  onEvent(
    /** OnEventInput is the input for the onEvent subscription. */
    input: OnEventInput,
    /** cb with subscription updates or an error */
    cb: (payload: OnEventPayload, error: Error | undefined) => any
  ) {
    return this.taj.subscribe(
      OnEventDocument,
      { input },
      (data) => {
        if (data.onEvent) {
          return data.onEvent;
        }
      },
      cb
    );
  }

  /** onAnyEvent works like onEvent, except all events are subscribed to. */
  onAnyEvent(
    /** OnAnyEventInput is the input for the onAnyEvent subscription. */
    input: OnAnyEventInput,
    /** cb with subscription updates or an error */
    cb: (payload: OnEventPayload, error: Error | undefined) => any
  ) {
    return this.taj.subscribe(
      OnAnyEventDocument,
      { input },
      (data) => {
        if (data.onAnyEvent) {
          return data.onAnyEvent;
        }
      },
      cb
    );
  }
}

export class TajribaParticipant extends TajribaUser {
  constructor(protected taj: Tajriba, public participant: Participant) {
    super(taj);
  }

  get id() {
    return this.participant.id;
  }

  get identifier() {
    return this.participant.identifier;
  }

  async stop() {
    this.taj.stop();
  }

  /**
   * changes returns changes of interest for the Participant.
   * */
  changes(
    /** cb with subscription updates or an error */
    cb: (payload: ChangePayload, error: Error | undefined) => any
  ) {
    return this.taj.subscribe(
      ChangesDocument,
      {},
      (data) => {
        if (data.changes) {
          return <ChangePayload>data.changes;
        }
      },
      cb
    );
  }
}
