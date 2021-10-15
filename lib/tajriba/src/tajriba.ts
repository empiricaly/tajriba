import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  OperationVariables,
  SubscriptionOptions,
  TypedDocumentNode,
} from "@apollo/client/core";
import { WebSocketLink } from "@apollo/client/link/ws";
import ws from "isomorphic-ws";
import { ClientOptions, SubscriptionClient } from "subscriptions-transport-ws";
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
  private _client?: ApolloClient<NormalizedCacheObject>;
  private subClient?: SubscriptionClient;
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
    if (this.url.includes("http://")) {
      return this.url.replace("http://", "ws://");
    } else if (this.url.includes("https://")) {
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

    const cache: InMemoryCache = new InMemoryCache({});

    let authToken;
    if (this.token) {
      authToken = `Bearer ${this.token}`;
    }

    const wsClientOptions: ClientOptions = {
      timeout: 24 * 60 * 60 * 1000,
      inactivityTimeout: 24 * 60 * 60 * 1000,
      lazy: false,
      reconnect: this.reconnect,
      connectionCallback: (error: Error[], result?: any) => {
        if (this._firstConnProm) {
          if (error) {
            this._firstConnProm.reject(error);
          } else {
            this._firstConnProm.resolve(result);
          }

          this._firstConnProm = undefined;
        }
        // console.info("connectionCallback", error, result);
      },
      connectionParams: {
        authToken,
        "User-Agent": this.userAgent,
      },
    };

    // Work around from: https://github.com/apollographql/apollo-client/issues/7257
    this.subClient = new SubscriptionClient(this.wsURL, wsClientOptions, ws);

    // this.subClient.onConnected(function (payload) {
    //   console.info("conn", payload);
    // });

    // this.subClient.onConnecting(function (payload) {
    //   console.info("conning", payload);
    // });

    // this.subClient.onDisconnected(function (payload) {
    //   console.info("disconn", payload);
    // });

    // this.subClient.onError(function (payload) {
    //   console.info("conn err", payload);
    // });

    const wLink = new WebSocketLink(this.subClient);

    const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
      cache,
      link: wLink,
    });

    this._client = client;
  }

  async stop() {
    if (this._client) {
      this._client.stop();
      this._client = undefined;
      if (this.subClient) {
        this.subClient.close();
      }
    }
  }

  async login(
    username: string,
    password: string
  ): Promise<[TajribaAdmin, string]> {
    const loginRes = await this.client.mutate({
      mutation: LoginDocument,
      variables: {
        input: {
          username,
          password,
        },
      },
    });

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
    const addPartRes = await this.client.mutate({
      mutation: AddParticipantDocument,
      variables: {
        input: {
          identifier,
        },
      },
    });

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
    const res = await this.client.mutate({
      mutation: RegisterServiceDocument,
      variables: {
        input: {
          name,
          token,
        },
      },
    });

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

  async query<T = any, TVariables = OperationVariables, U = any>(
    query: TypedDocumentNode<T, TVariables>,
    variables: TVariables,
    data: (res: T) => U
  ): Promise<U> {
    const res = await this.client.query({
      query,
      variables,
    });

    if (res.data) {
      const d = data(res.data);
      if (d) {
        return d;
      }
    }

    throw "no results";
  }

  async mutate<T = any, TVariables = OperationVariables, U = any>(
    mutation: TypedDocumentNode<T, TVariables>,
    variables: TVariables,
    data: (res: T) => U | undefined
  ) {
    const res = await this.client.mutate({
      mutation,
      variables,
    });

    let r: U | undefined;

    if (res.data) {
      r = data(res.data);
    }

    if (!r) {
      throw new Error("not found");
    }

    return r;
  }

  subscribe<T = any, TVariables = OperationVariables, U = any>(
    query: TypedDocumentNode<T, TVariables>,
    variables: TVariables,
    data: (res: T) => U | undefined,
    cb: (response: U, error: Error | undefined) => any
  ) {
    return this.client
      .subscribe(<SubscriptionOptions>{ query, variables })
      .subscribe({
        next(res) {
          if (res.data) {
            const r = data(res.data);
            if (r) {
              cb(r, undefined);
              return;
            }
          }

          console.error("data missing", res);

          cb(<U>{}, new Error("data missing from event"));
        },
        error(err) {
          cb(<U>{}, err);
        },
      });
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

export type LinkUnlinkInput = {
  /** nodeIDs are the IDs of the Nodes that the Participants should be added to. */
  nodeIDs: Array<string>;
  /**
   * participantIDs are the IDs of the Participants that should be added to the
   * Nodes.
   */
  participantIDs: Array<string>;
};

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
  async addLink(input: LinkInput) {
    return await this.taj.mutate(LinkDocument, { input }, (data) => data?.link);
  }

  /** links Participants to Nodes. */
  async link(input: LinkUnlinkInput) {
    return await this.addLink({ link: true, ...input });
  }

  /** unlinks Participants from Nodes. */
  async unlink(input: LinkUnlinkInput) {
    return await this.addLink({ link: false, ...input });
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
  constructor(protected taj: Tajriba, protected participant: Participant) {
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
      null,
      (data) => {
        if (data.changes) {
          return <ChangePayload>data.changes;
        }
      },
      cb
    );
  }
}
