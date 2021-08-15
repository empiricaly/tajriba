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
import { ClientOptions } from "subscriptions-transport-ws";
import {
  AddGroupInput,
  AddGroupsDocument,
  AddParticipantDocument,
  AddScopeInput,
  AddScopesDocument,
  AddStepInput,
  AddStepsDocument,
  ChangePayload,
  ChangesDocument,
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
  ScopedAttributesPayload,
  ScopesDocument,
  ScopesQueryVariables,
  SetAttributeInput,
  SetAttributesDocument,
  StepsDocument,
  StepsQueryVariables,
  TransitionDocument,
  TransitionInput,
} from "./generated/graphql";

const DefaultAddress = "http://localhost:4737/query";

export class Tajriba {
  private _client?: ApolloClient<NormalizedCacheObject>;

  constructor(readonly url: string = DefaultAddress, readonly token?: string) {}

  static sessionAdmin(url: string = DefaultAddress, sessionToken: string) {
    const t = new Tajriba(url, sessionToken);
    return new TajribaAdmin(t);
  }

  static sessionParticipant(
    url: string = DefaultAddress,
    sessionToken: string,
    participant: Participant
  ) {
    const t = new Tajriba(url, sessionToken);
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

  get client() {
    if (this._client) {
      return this._client;
    }

    const cache: InMemoryCache = new InMemoryCache({});

    const wsClientOptions: ClientOptions = {
      timeout: 24 * 60 * 60 * 1000,
      inactivityTimeout: 24 * 60 * 60 * 1000,
      lazy: true,
      reconnect: true,
    };

    if (this.token) {
      wsClientOptions.connectionParams = {
        authToken: `Bearer ${this.token}`,
      };
    }

    const wsLink = new WebSocketLink({
      uri: this.wsURL,
      options: wsClientOptions,
      webSocketImpl: ws,
    });

    const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
      cache,
      link: wsLink,
    });

    this._client = client;

    return this._client;
  }

  async login(username: string, password: string) {
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

    return new TajribaAdmin(t);
  }

  async stop() {
    if (this.client) {
      this.client.stop();
      this._client = undefined;
    }
  }

  async register(identifier: string) {
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

    return new TajribaParticipant(t, participant);
  }

  async registerService(name: string, token: string) {
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

    return new TajribaAdmin(t);
  }

  async setAttributes(input: SetAttributeInput[]) {
    const res = await this.client.mutate({
      mutation: SetAttributesDocument,
      variables: {
        input,
      },
    });

    return res.data?.setAttributes;
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
    /** ScopedAttributesPayload is the return payload for the addScope mutation. */
    input: ScopedAttributesInput[],
    /** cb with scoped attribute updates or an error */
    cb: (payload: ScopedAttributesPayload, error: Error | undefined) => any
  ) {
    return this.taj.subscribe(
      ScopedAttributesDocument,
      { input },
      (data) => {
        if (data.scopedAttributes) {
          return <ScopedAttributesPayload>data.scopedAttributes;
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
