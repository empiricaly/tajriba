import { z } from "zod";
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Cursor: any;
  /** DateTime is an int64 Date + Time value given in Epoch with ns precision. */
  DateTime: any;
};

export type Actor = Participant | Service | User;

/** AddGroupInput creates a new Group. */
export type AddGroupInput = {
  /** participantIDs are the IDs of the Participants to link with the Group. */
  participantIDs: Array<Scalars["ID"]>;
};

/** AddGroupPayload is the return payload for the addGroup mutation. */
export type AddGroupPayload = {
  __typename: "AddGroupPayload";
  /** group that the participant is added to. */
  group: Group;
};

/** AddParticipantInput finds or creates a Participant by Unique Identifier. */
export type AddParticipantInput = {
  /**
   * identifier is the unique identifier for the Pariticipant. The identifier
   * is how a participant "logs into" the system.
   */
  identifier: Scalars["ID"];
};

/** AddParticipantPayload is the return payload for the addParticipant mutation. */
export type AddParticipantPayload = {
  __typename: "AddParticipantPayload";
  /** participant is the created Participants. */
  participant: Participant;
  /** sessionToken is the session token to be used for authenticated requets. */
  sessionToken: Scalars["String"];
};

/** AddScopeInput creates a new Scope. */
export type AddScopeInput = {
  /** attributes to be attached to the Scope at creation. */
  attributes?: InputMaybe<Array<SetAttributeInput>>;
  /** kind is an optional type name. */
  kind?: InputMaybe<Scalars["String"]>;
  /**
   * name is the *unique* name of the Scope. If a scope with the same name already
   * exists, it will return an "already exists" error.
   */
  name?: InputMaybe<Scalars["String"]>;
};

/** AddScopePayload is the return payload for the addScope mutation. */
export type AddScopePayload = {
  __typename: "AddScopePayload";
  /** scope that the participant is added to. */
  scope: Scope;
};

/** AddStepInput creates a new Step. */
export type AddStepInput = {
  /** duration is the duration in seconds of the Step should last before ending. */
  duration: Scalars["Int"];
};

/** AddStepPayload is the return payload for the addStep mutation. */
export type AddStepPayload = {
  __typename: "AddStepPayload";
  /** step that the participant is added to. */
  step: Step;
};

export type Admin = Service | User;

/**
 * Attribute is a single piece of custom data set on a Node. Attributes
 * with the same key can be grouped into an array through the use of a unique
 * index field within that key's scope.
 */
export type Attribute = Node & {
  __typename: "Attribute";
  /** createdAt is the time of creation of the record. */
  createdAt: Scalars["DateTime"];
  /** createdBy is the Actor that created the record. */
  createdBy: Actor;
  /** current is true if the Attribute is the current version of the value for key. */
  current: Scalars["Boolean"];
  /**
   * deletedAt is the time when the Attribute was deleted. If null, the Attribute
   * was not deleted.
   */
  deletedAt?: Maybe<Scalars["DateTime"]>;
  /** id is the unique globally identifier for the record. */
  id: Scalars["ID"];
  /**
   * immutable indicates the Attribute can never be changed by any Actor.
   * immutable must be set on the Attribute at creation.
   */
  immutable: Scalars["Boolean"];
  /** index of the Attribute if the value is a vector. */
  index?: Maybe<Scalars["Int"]>;
  /** key identifies the unique key of the Attribute. */
  key: Scalars["String"];
  /** Object associated with Attribute. */
  node: Node;
  /**
   * private indicates whether the Attribute shouldn't be visible to Participants
   * in the scope.
   * private must be set on the Attribute at creation.
   */
  private: Scalars["Boolean"];
  /**
   * protected indicates the Attribute cannot be modified by other Participants. A
   * Participant can only set protected Records on their Participant record.
   * Users and Services can update protected Attributes.
   * protected must be set on the Attribute at creation.
   */
  protected: Scalars["Boolean"];
  /**
   * val is the value of the Attribute. If val is not returned, it is considered to
   * be explicitely `null`.
   */
  val?: Maybe<Scalars["String"]>;
  /** vector returns true if the value is a vector. */
  vector: Scalars["Boolean"];
  /** version is the version number of this Attribute, starting at 1. */
  version: Scalars["Int"];
  /** versions returns previous versions for the Attribute. */
  versions?: Maybe<AttributeConnection>;
};

/**
 * Attribute is a single piece of custom data set on a Node. Attributes
 * with the same key can be grouped into an array through the use of a unique
 * index field within that key's scope.
 */
export type AttributeVersionsArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
};

export type AttributeChange = {
  __typename: "AttributeChange";
  /** deleted is true with the attribute was deleted. */
  deleted: Scalars["Boolean"];
  /** id is the identifier for the Attribute. */
  id: Scalars["ID"];
  /** index is the index of the attribute if the value is a vector. */
  index?: Maybe<Scalars["Int"]>;
  /** isNew is true if the Attribute was just created. */
  isNew: Scalars["Boolean"];
  /** key is the attribute key being updated. */
  key: Scalars["String"];
  /** nodeID is the identifier for the Attribute's Node. */
  nodeID: Scalars["ID"];
  /** value is the value of the updated attribute. */
  val?: Maybe<Scalars["String"]>;
  /** vector indicates whether the value is a vector. */
  vector: Scalars["Boolean"];
  /** version is the version number of this Attribute, starting at 1. */
  version: Scalars["Int"];
};

export type AttributeConnection = {
  __typename: "AttributeConnection";
  edges: Array<AttributeEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export type AttributeEdge = {
  __typename: "AttributeEdge";
  cursor: Scalars["Cursor"];
  node: Attribute;
};

export type Change =
  | AttributeChange
  | ParticipantChange
  | ScopeChange
  | StepChange;

export type ChangePayload = {
  __typename: "ChangePayload";
  /** change is the Change. */
  change: Change;
  /** done indicates that the state has finished synchorizing. */
  done: Scalars["Boolean"];
  /** removed indicates whether the record was removed. */
  removed: Scalars["Boolean"];
};

/** EventType holds types of event that can trigger hooks. */
export enum EventType {
  /** An attribute was added or updated. */
  AttributeUpdate = "ATTRIBUTE_UPDATE",
  /** A group was added. */
  GroupAdd = "GROUP_ADD",
  /** A link was added. */
  LinkAdd = "LINK_ADD",
  /** A participant was added. */
  ParticipantAdd = "PARTICIPANT_ADD",
  /** A participant connected. */
  ParticipantConnect = "PARTICIPANT_CONNECT",
  /**
   * Participant was already connected when this subscription started. This is a
   * special event that allows the listener to catch up on the currently connected
   * players at the beginning of the subscription.
   */
  ParticipantConnected = "PARTICIPANT_CONNECTED",
  /** A participant disconnected. */
  ParticipantDisconnect = "PARTICIPANT_DISCONNECT",
  /** A scope was added. */
  ScopeAdd = "SCOPE_ADD",
  /** A step was added. */
  StepAdd = "STEP_ADD",
  /** A transition was added. */
  TransitionAdd = "TRANSITION_ADD",
}

export type Group = Node & {
  __typename: "Group";
  /** createdAt is the time of creation of the record. */
  createdAt: Scalars["DateTime"];
  /** createdBy returns the Actor that created the record. */
  createdBy: Actor;
  /** id is the unique globally identifier for the record. */
  id: Scalars["ID"];
  /** links returns Participant linking and unlinking with this Node. */
  links?: Maybe<LinkConnection>;
};

export type GroupLinksArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
};

export type GroupConnection = {
  __typename: "GroupConnection";
  edges: Array<GroupEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export type GroupEdge = {
  __typename: "GroupEdge";
  cursor: Scalars["Cursor"];
  node: Group;
};

export type Kv = {
  key: Scalars["String"];
  val: Scalars["String"];
};

/** Link records a Participant linking or unlinking with a Node. */
export type Link = Node & {
  __typename: "Link";
  /** createdAt is the time of creation of the record. */
  createdAt: Scalars["DateTime"];
  /** createdBy is the Actor that created the record. */
  createdBy: Actor;
  /** id is the unique globally identifier for the record. */
  id: Scalars["ID"];
  /** link indicates whether the Participant was linked or unlinked with the Node. */
  link: Scalars["Boolean"];
  /** node the Participant is assigned to. */
  node: Node;
  /** participant that is assigned to  */
  participant: Participant;
};

export type LinkConnection = {
  __typename: "LinkConnection";
  edges: Array<LinkEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export type LinkEdge = {
  __typename: "LinkEdge";
  cursor: Scalars["Cursor"];
  node: Link;
};

/** LinkInput links or unlinks Participants with a Node. */
export type LinkInput = {
  /**
   * link indicates whether the Participant was linked or unlinked with the Node.
   * WARNING: UNLINKING NOT CURRENTLY SUPPORTED, link must be true.
   */
  link: Scalars["Boolean"];
  /** nodeIDs are the IDs of the Nodes that the Participants should be added to. */
  nodeIDs: Array<Scalars["ID"]>;
  /**
   * participantIDs are the IDs of the Participants that should be added to the
   * Nodes.
   */
  participantIDs: Array<Scalars["ID"]>;
};

/**
 * LinkPayload is the return payload for the assignParticipants
 * mutation.
 */
export type LinkPayload = {
  __typename: "LinkPayload";
  /** nodes the participants are added to. */
  nodes: Array<Node>;
  /** participants that are added to the Node. */
  participants: Array<Participant>;
};

/** LoginInput is the input for login() */
export type LoginInput = {
  /** password of the user. */
  password: Scalars["String"];
  /** username is the user identifier string. */
  username: Scalars["String"];
};

/** LoginPayload is returned by login() */
export type LoginPayload = {
  __typename: "LoginPayload";
  /** sessionToken is the session token to be used for authenticated requets. */
  sessionToken: Scalars["String"];
  /** user is the logged in User. */
  user: User;
};

export type Mutation = {
  __typename: "Mutation";
  /** addGroups creates new Groups. */
  addGroups: Array<AddGroupPayload>;
  /** addParticipant finds or creates a Participant by Unique Identifier. */
  addParticipant: AddParticipantPayload;
  /** addScopes creates a new Scope. */
  addScopes: Array<AddScopePayload>;
  /** addSteps creates new Steps. */
  addSteps: Array<AddStepPayload>;
  /** link links or unlinks Participants to Nodes. */
  link: LinkPayload;
  /** login signs in a user. */
  login: LoginPayload;
  /** registerService registers a new Service. */
  registerService: RegisterServicePayload;
  /** Create or update an Attribute on a Node. */
  setAttributes: Array<SetAttributePayload>;
  /** transition transition a Node from a state to another state. */
  transition: TransitionPayload;
};

export type MutationAddGroupsArgs = {
  input: Array<AddGroupInput>;
};

export type MutationAddParticipantArgs = {
  input: AddParticipantInput;
};

export type MutationAddScopesArgs = {
  input: Array<AddScopeInput>;
};

export type MutationAddStepsArgs = {
  input: Array<AddStepInput>;
};

export type MutationLinkArgs = {
  input: LinkInput;
};

export type MutationLoginArgs = {
  input: LoginInput;
};

export type MutationRegisterServiceArgs = {
  input: RegisterServiceInput;
};

export type MutationSetAttributesArgs = {
  input: Array<SetAttributeInput>;
};

export type MutationTransitionArgs = {
  input: TransitionInput;
};

/** Node is an interface allowing simple querying of any node */
export type Node = {
  /** id is the unique globally identifier for the record. */
  id: Scalars["ID"];
};

/** OnAnyEventInput is the input for the onAnyEvent subscription. */
export type OnAnyEventInput = {
  /** nodeID is an optional node ID of the node to listen to. */
  nodeID?: InputMaybe<Scalars["ID"]>;
};

/** OnEventInput is the input for the onEvent subscription. */
export type OnEventInput = {
  /** eventsTypes speficies which events to listen to. */
  eventTypes: Array<EventType>;
  /** nodeID is an optional node ID of the node to listen to. */
  nodeID?: InputMaybe<Scalars["ID"]>;
};

/** OnEventPayload is the payload for the on[Any]Event subscriptions. */
export type OnEventPayload = {
  __typename: "OnEventPayload";
  /**
   * done indicates that the state has finished synchorizing. This is only valid
   * for events that synchronize state on start of subscription (e.g.
   * PARTICIPANT_CONNECTED).
   */
  done: Scalars["Boolean"];
  /**
   * eventID is a unique identifier for the current event. Each OnEventPayload for
   * a single client will have a different eventID. eventID will be the same for
   * different clients on the same event.
   */
  eventID: Scalars["ID"];
  /** eventType is the type of the current event. */
  eventType: EventType;
  /** node is the node that triggered the event */
  node: Node;
};

export enum OrderDirection {
  Asc = "ASC",
  Desc = "DESC",
}

export type PageInfo = {
  __typename: "PageInfo";
  endCursor?: Maybe<Scalars["Cursor"]>;
  hasNextPage: Scalars["Boolean"];
  hasPreviousPage: Scalars["Boolean"];
  startCursor?: Maybe<Scalars["Cursor"]>;
};

/** Participant is an entity participating in Steps. */
export type Participant = Node & {
  __typename: "Participant";
  /** createdAt is the time of creation of the record. */
  createdAt: Scalars["DateTime"];
  /** id is the unique globally identifier for the record. */
  id: Scalars["ID"];
  /**
   * identifier is the unique identifier for the Pariticipant. This is different
   * from the id field, which is the database internal identifier. The identifier
   * is how a participant "logs into" the system.
   */
  identifier: Scalars["ID"];
  /**
   * links returns Participant linking and unlinking with Nodes. A single
   * Particpant might be linked and unlinked multiple times, and
   * so a Participant might have multiple Links on a single Node.
   */
  links?: Maybe<LinkConnection>;
};

/** Participant is an entity participating in Steps. */
export type ParticipantLinksArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
};

export type ParticipantChange = {
  __typename: "ParticipantChange";
  /** id is the identifier for the Participant. */
  id: Scalars["ID"];
};

export type ParticipantConnection = {
  __typename: "ParticipantConnection";
  edges: Array<ParticipantEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export type ParticipantEdge = {
  __typename: "ParticipantEdge";
  cursor: Scalars["Cursor"];
  node: Participant;
};

export type Query = {
  __typename: "Query";
  /** attributes returns all attributes for a scope. */
  attributes?: Maybe<AttributeConnection>;
  /** groups returns all groups */
  groups?: Maybe<GroupConnection>;
  /** participants returns all Participants in the system. */
  participants?: Maybe<ParticipantConnection>;
  /**
   * scopes returns all scopes
   * If filter is provided it will return scopes matching any
   * ScopedAttributesInput.
   */
  scopes?: Maybe<ScopeConnection>;
  /** steps returns all steps */
  steps?: Maybe<StepConnection>;
};

export type QueryAttributesArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  scopeID: Scalars["ID"];
};

export type QueryGroupsArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
};

export type QueryParticipantsArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
};

export type QueryScopesArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  filter?: InputMaybe<Array<ScopedAttributesInput>>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
};

export type QueryStepsArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
};

/** RegisterServiceInput is the input for registerService() */
export type RegisterServiceInput = {
  /** name is the name of the service to register. */
  name: Scalars["String"];
  /** token is the Service Registration token. */
  token: Scalars["String"];
};

/** RegisterServicePayload is returned by registerService() */
export type RegisterServicePayload = {
  __typename: "RegisterServicePayload";
  /** service is newly created Service. */
  service: Service;
  /** sessionToken is the session token to be used for authenticated requets. */
  sessionToken: Scalars["String"];
};

export enum Role {
  /** ADMIN is priviledged access for Users and Services. */
  Admin = "ADMIN",
  /** PARTICIPANT is access tailored for Participants' needs. */
  Participant = "PARTICIPANT",
}

export type Scope = Node & {
  __typename: "Scope";
  /** attributes returns all custom data that has been set. */
  attributes: AttributeConnection;
  /** createdAt is the time of creation of the record. */
  createdAt: Scalars["DateTime"];
  /** createdBy returns the Actor that created the record. */
  createdBy: Actor;
  /** id is the unique globally identifier for the record. */
  id: Scalars["ID"];
  /** kind is an optional type name. */
  kind?: Maybe<Scalars["String"]>;
  /**
   * links returns Participant linking and unlinking with this Node. A single
   * Particpant might be linked and unlinked multiple times, and
   * so a Participant might have multiple Links on a Node.
   */
  links?: Maybe<LinkConnection>;
  /** name is an optional *unique* name. */
  name?: Maybe<Scalars["String"]>;
};

export type ScopeAttributesArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  deleted?: InputMaybe<Scalars["Boolean"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
};

export type ScopeLinksArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
};

export type ScopeChange = {
  __typename: "ScopeChange";
  /** id is the identifier for the Scope. */
  id: Scalars["ID"];
  /** kind is the kind of the Scope. */
  kind?: Maybe<Scalars["String"]>;
  /** name is the name of the Scope. */
  name?: Maybe<Scalars["String"]>;
};

export type ScopeConnection = {
  __typename: "ScopeConnection";
  edges: Array<ScopeEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export type ScopeEdge = {
  __typename: "ScopeEdge";
  cursor: Scalars["Cursor"];
  node: Scope;
};

/**
 * ScopedAttributesInput subscribes to attributes in matching scopes. Either name,
 * kind, keys or kvs exclusively can be provided.
 */
export type ScopedAttributesInput = {
  /** ids of the matching Scopes. */
  ids?: InputMaybe<Array<Scalars["ID"]>>;
  /** keys to Attributes in matching Scope. */
  keys?: InputMaybe<Array<Scalars["String"]>>;
  /** kinds of the matching Scopes. */
  kinds?: InputMaybe<Array<Scalars["String"]>>;
  /** kvs to Attributes in matching Scope. */
  kvs?: InputMaybe<Array<Kv>>;
  /** names of the matching Scopes. */
  names?: InputMaybe<Array<Scalars["String"]>>;
};

export type Service = {
  __typename: "Service";
  /** createdAt is the time of creation of the record. */
  createdAt: Scalars["DateTime"];
  /** id is the unique globally identifier for the record. */
  id: Scalars["ID"];
  /** name is the name of the service gave itself. */
  name: Scalars["String"];
};

/** SetAttributeInput sets an Attribute on a Node. */
export type SetAttributeInput = {
  /** append allows appending to a vector without specifying the index. */
  append?: InputMaybe<Scalars["Boolean"]>;
  /**
   * immutable indicates the Attribute can never be changed by any Actor.
   * immutable must be set on the Attribute at creation.
   * Defaults to false and does need to be sent on subsequent updates.
   */
  immutable?: InputMaybe<Scalars["Boolean"]>;
  /**
   * index of value if Attribute is a vector. An Attribute cannot mutate between
   * vector and non-vector formats.
   */
  index?: InputMaybe<Scalars["Int"]>;
  /** key identifies the unique key of the Attribute. */
  key: Scalars["String"];
  /**
   * ID of object on which to update the value. NodeID is required if attribute is
   * not created with addScope().
   */
  nodeID?: InputMaybe<Scalars["ID"]>;
  /**
   * private indicates whether the Attribute shouldn't be visible to Participants
   * in the scope.
   * private must be set on the Attribute at creation.
   * Defaults to false and does need to be sent on subsequent updates.
   */
  private?: InputMaybe<Scalars["Boolean"]>;
  /**
   * protected indicates the Attribute cannot be modified by other Participants. A
   * Participant can only set protected Records on their Participant record.
   * Users and Services can update protected Attributes.
   * protected must be set on the Attribute at creation.
   * Defaults to false and does need to be sent on subsequent updates.
   */
  protected?: InputMaybe<Scalars["Boolean"]>;
  /**
   * val is the value of the Attribute. It can be any JSON encodable value. If
   * value is not defined, value is assumed to be `null`.
   */
  val?: InputMaybe<Scalars["String"]>;
  /** vector indicates the Attribute is a vector. */
  vector?: InputMaybe<Scalars["Boolean"]>;
};

/** SetAttributePayload is the return payload for the setAttribute mutation. */
export type SetAttributePayload = {
  __typename: "SetAttributePayload";
  /** attribute is the Attribute updated. */
  attribute: Attribute;
};

/** State of Step */
export enum State {
  /** CREATED is when the Step has been created but hasn't started yet. */
  Created = "CREATED",
  /** ENDED is when the Step has finished without issues. */
  Ended = "ENDED",
  /** ERROR is when the Step has failed (due to an unrecoverable error). */
  Failed = "FAILED",
  /** PAUSED is when the Step has started but its timer was stopped. */
  Paused = "PAUSED",
  /** RUNNING is when the Step is currently in progress. */
  Running = "RUNNING",
  /**
   * TERMINATED is when the Step has been manually terminated. This could happen
   * before or during execution.
   */
  Terminated = "TERMINATED",
}

/** Step is a span of time. */
export type Step = Node & {
  __typename: "Step";
  /** createdAt is the time of creation of the record. */
  createdAt: Scalars["DateTime"];
  /** createdBy returns the Actor that created the record. */
  createdBy: Actor;
  /** duration is the duration in seconds of the Step should last before ending. */
  duration: Scalars["Int"];
  /** endedAt is the time at which the Step ended. */
  endedAt?: Maybe<Scalars["DateTime"]>;
  /** id is the unique globally identifier for the record. */
  id: Scalars["ID"];
  /** links returns Participant linking and unlinking with this Node. */
  links: LinkConnection;
  /** startedAt is the time at which the Step started. */
  startedAt?: Maybe<Scalars["DateTime"]>;
  /** state is the stage the Step currently is in */
  state: State;
  /** transitions lists of States changes of the Step. */
  transitions: TransitionConnection;
};

/** Step is a span of time. */
export type StepLinksArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
};

/** Step is a span of time. */
export type StepTransitionsArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
};

export type StepChange = {
  __typename: "StepChange";
  /** ellapsed indicates the time in seconds ellapsed since the start of the Step. */
  ellapsed?: Maybe<Scalars["Int"]>;
  /** id is the identifier for the Step. */
  id: Scalars["ID"];
  /**
   * remaining is the duration left in seconds of the Step should last before
   * ending, from `since`.
   */
  remaining?: Maybe<Scalars["Int"]>;
  /** running indicates whether the Step is running. */
  running: Scalars["Boolean"];
  /** since is the time from which the counter should count. */
  since?: Maybe<Scalars["DateTime"]>;
  /** state is the stage the Step currently is in */
  state: State;
};

export type StepConnection = {
  __typename: "StepConnection";
  edges: Array<StepEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export type StepEdge = {
  __typename: "StepEdge";
  cursor: Scalars["Cursor"];
  node: Step;
};

export type StepOrder = {
  direction: OrderDirection;
  field?: InputMaybe<StepOrderField>;
};

export enum StepOrderField {
  CreatedAt = "CREATED_AT",
  Duration = "DURATION",
  StartedAt = "STARTED_AT",
}

/** SubAttributesPayload is the return payload for the scope attributes subs. */
export type SubAttributesPayload = {
  __typename: "SubAttributesPayload";
  /**
   * scope that the participant is added to. Attribute may be null only if the
   * subscription did not match any Scopes and done must be published.
   */
  attribute?: Maybe<Attribute>;
  /** done indicates that the state has finished synchorizing. */
  done: Scalars["Boolean"];
  /** isNew returns true if the Attribute for key and nodeID was just created. */
  isNew: Scalars["Boolean"];
};

export type Subscription = {
  __typename: "Subscription";
  /**
   * changes returns the changes relevant to the Participant, including changes to
   * the Step they are Participating in, Atrributes they have access that are
   * added, updated, or going in and out of scope, etc.
   */
  changes: ChangePayload;
  /**
   * globalAttributes returns Attributes for the global Scope, which is a singleton
   * permission-less Scope that any client can access, even if not logged in. The
   * name of the global Scope is "global" and can only be updated by Users. All
   * Attributes in this Scope will be returned initially, then any update to
   * Attributes from this Scopes.
   */
  globalAttributes: SubAttributesPayload;
  /** onAnyEvent works like onEvent, except all events are subscribed to. */
  onAnyEvent?: Maybe<OnEventPayload>;
  /**
   * onEvent attaches hooks to specified events. Optionally, a nodeType and nodeID
   * can be specified to only look at events for a particular record.
   */
  onEvent?: Maybe<OnEventPayload>;
  /**
   * scopedAttributes returns Attributes for Scopes matching the keys or KVs input.
   * keys or KVs (only one) must be provided. All Attributes in Scopes matching
   * will be returned initially, then any update to Attributes within the matching
   * Scopes.
   */
  scopedAttributes: SubAttributesPayload;
};

export type SubscriptionOnAnyEventArgs = {
  input?: InputMaybe<OnAnyEventInput>;
};

export type SubscriptionOnEventArgs = {
  input?: InputMaybe<OnEventInput>;
};

export type SubscriptionScopedAttributesArgs = {
  input: Array<ScopedAttributesInput>;
};

/** A Transition records a State change. */
export type Transition = Node & {
  __typename: "Transition";
  /** createdAt is the time of creation of the record. */
  createdAt: Scalars["DateTime"];
  /** createdBy is the Actor that created the record. */
  createdBy: Actor;
  /** from is the State in which the Node was before the State change. */
  from: State;
  /** id is the unique globally identifier for the record. */
  id: Scalars["ID"];
  /** node is the Node that experienced this Transition. */
  node: Node;
  /** to is the State in which the Node was after the State change. */
  to: State;
};

export type TransitionConnection = {
  __typename: "TransitionConnection";
  edges: Array<TransitionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export type TransitionEdge = {
  __typename: "TransitionEdge";
  cursor: Scalars["Cursor"];
  node: Transition;
};

/** TransitionInput transitions a Node. */
export type TransitionInput = {
  /** cause is an optional open string explaining the reason for the transition. */
  cause?: InputMaybe<Scalars["String"]>;
  /**
   * from is the current State of the Node. To avoid concurrency or repeat errors,
   * from is required, and the transition will not happen if the from State does
   * not correspond to the Node's current State.
   */
  from: State;
  /** nodeID is the ID of the Node to transition. */
  nodeID: Scalars["ID"];
  /** to is the desired State of the Step. */
  to: State;
};

/** TransitionPayload is the return payload for the transition() mutation. */
export type TransitionPayload = {
  __typename: "TransitionPayload";
  /** transition is the created Transition. */
  transition: Transition;
};

/** User is a user that has priviledged access to the data. */
export type User = Node & {
  __typename: "User";
  /** createdAt is the time of creation of the record. */
  createdAt: Scalars["DateTime"];
  /** id is the unique globally identifier for the record. */
  id: Scalars["ID"];
  /** name is the display name of the user. */
  name: Scalars["String"];
  /** username is the login name of the user. */
  username: Scalars["String"];
};

export type AttributesQueryVariables = Exact<{
  scopeID: Scalars["ID"];
  after?: InputMaybe<Scalars["Cursor"]>;
  first?: InputMaybe<Scalars["Int"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  last?: InputMaybe<Scalars["Int"]>;
}>;

export type AttributesQuery = {
  __typename: "Query";
  attributes?: {
    __typename: "AttributeConnection";
    totalCount: number;
    pageInfo: {
      __typename: "PageInfo";
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: any | null;
      endCursor?: any | null;
    };
    edges: Array<{
      __typename: "AttributeEdge";
      cursor: any;
      node: {
        __typename: "Attribute";
        id: string;
        createdAt: any;
        private: boolean;
        protected: boolean;
        immutable: boolean;
        deletedAt?: any | null;
        key: string;
        val?: string | null;
        index?: number | null;
        current: boolean;
        version: number;
        vector: boolean;
        createdBy:
          | {
              __typename: "Participant";
              id: string;
              identifier: string;
              createdAt: any;
            }
          | { __typename: "Service"; id: string; name: string; createdAt: any }
          | {
              __typename: "User";
              id: string;
              username: string;
              name: string;
              createdAt: any;
            };
        node:
          | { __typename: "Attribute"; id: string }
          | { __typename: "Group"; id: string }
          | { __typename: "Link"; id: string }
          | { __typename: "Participant"; id: string }
          | {
              __typename: "Scope";
              kind?: string | null;
              name?: string | null;
              id: string;
            }
          | { __typename: "Step"; id: string }
          | { __typename: "Transition"; id: string }
          | { __typename: "User"; id: string };
      };
    }>;
  } | null;
};

export type SetAttributesMutationVariables = Exact<{
  input: Array<SetAttributeInput> | SetAttributeInput;
}>;

export type SetAttributesMutation = {
  __typename: "Mutation";
  setAttributes: Array<{
    __typename: "SetAttributePayload";
    attribute: {
      __typename: "Attribute";
      id: string;
      createdAt: any;
      private: boolean;
      protected: boolean;
      immutable: boolean;
      deletedAt?: any | null;
      key: string;
      val?: string | null;
      index?: number | null;
      current: boolean;
      version: number;
      vector: boolean;
      createdBy:
        | {
            __typename: "Participant";
            id: string;
            identifier: string;
            createdAt: any;
          }
        | { __typename: "Service"; id: string; name: string; createdAt: any }
        | {
            __typename: "User";
            id: string;
            username: string;
            name: string;
            createdAt: any;
          };
      node:
        | { __typename: "Attribute"; id: string }
        | { __typename: "Group"; id: string }
        | { __typename: "Link"; id: string }
        | { __typename: "Participant"; id: string }
        | {
            __typename: "Scope";
            kind?: string | null;
            name?: string | null;
            id: string;
          }
        | { __typename: "Step"; id: string }
        | { __typename: "Transition"; id: string }
        | { __typename: "User"; id: string };
    };
  }>;
};

export type ChangesSubscriptionVariables = Exact<{ [key: string]: never }>;

export type ChangesSubscription = {
  __typename: "Subscription";
  changes: {
    __typename: "ChangePayload";
    done: boolean;
    removed: boolean;
    change:
      | {
          __typename: "AttributeChange";
          id: string;
          nodeID: string;
          deleted: boolean;
          isNew: boolean;
          index?: number | null;
          vector: boolean;
          version: number;
          key: string;
          val?: string | null;
        }
      | { __typename: "ParticipantChange"; id: string }
      | {
          __typename: "ScopeChange";
          id: string;
          name?: string | null;
          kind?: string | null;
        }
      | {
          __typename: "StepChange";
          id: string;
          state: State;
          since?: any | null;
          remaining?: number | null;
          ellapsed?: number | null;
          running: boolean;
        };
  };
};

export type AddGroupsMutationVariables = Exact<{
  input: Array<AddGroupInput> | AddGroupInput;
}>;

export type AddGroupsMutation = {
  __typename: "Mutation";
  addGroups: Array<{
    __typename: "AddGroupPayload";
    group: { __typename: "Group"; id: string };
  }>;
};

export type GroupsQueryVariables = Exact<{
  after?: InputMaybe<Scalars["Cursor"]>;
  first?: InputMaybe<Scalars["Int"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  last?: InputMaybe<Scalars["Int"]>;
}>;

export type GroupsQuery = {
  __typename: "Query";
  groups?: {
    __typename: "GroupConnection";
    totalCount: number;
    edges: Array<{
      __typename: "GroupEdge";
      node: {
        __typename: "Group";
        id: string;
        createdAt: any;
        createdBy:
          | {
              __typename: "Participant";
              id: string;
              identifier: string;
              createdAt: any;
            }
          | { __typename: "Service"; id: string; name: string; createdAt: any }
          | {
              __typename: "User";
              id: string;
              username: string;
              name: string;
              createdAt: any;
            };
      };
    }>;
    pageInfo: {
      __typename: "PageInfo";
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: any | null;
      endCursor?: any | null;
    };
  } | null;
};

export type OnEventSubscriptionVariables = Exact<{
  input?: InputMaybe<OnEventInput>;
}>;

export type OnEventSubscription = {
  __typename: "Subscription";
  onEvent?: {
    __typename: "OnEventPayload";
    eventID: string;
    eventType: EventType;
    done: boolean;
    node:
      | {
          __typename: "Attribute";
          createdAt: any;
          private: boolean;
          protected: boolean;
          immutable: boolean;
          deletedAt?: any | null;
          key: string;
          val?: string | null;
          index?: number | null;
          current: boolean;
          version: number;
          vector: boolean;
          id: string;
          createdBy:
            | {
                __typename: "Participant";
                id: string;
                identifier: string;
                createdAt: any;
              }
            | {
                __typename: "Service";
                id: string;
                name: string;
                createdAt: any;
              }
            | {
                __typename: "User";
                id: string;
                username: string;
                name: string;
                createdAt: any;
              };
          node:
            | { __typename: "Attribute"; id: string }
            | { __typename: "Group"; id: string }
            | { __typename: "Link"; id: string }
            | { __typename: "Participant"; id: string }
            | {
                __typename: "Scope";
                kind?: string | null;
                name?: string | null;
                id: string;
              }
            | { __typename: "Step"; id: string }
            | { __typename: "Transition"; id: string }
            | { __typename: "User"; id: string };
        }
      | {
          __typename: "Group";
          createdAt: any;
          id: string;
          createdBy:
            | {
                __typename: "Participant";
                id: string;
                identifier: string;
                createdAt: any;
              }
            | {
                __typename: "Service";
                id: string;
                name: string;
                createdAt: any;
              }
            | {
                __typename: "User";
                id: string;
                username: string;
                name: string;
                createdAt: any;
              };
        }
      | {
          __typename: "Link";
          createdAt: any;
          link: boolean;
          id: string;
          createdBy:
            | {
                __typename: "Participant";
                id: string;
                identifier: string;
                createdAt: any;
              }
            | {
                __typename: "Service";
                id: string;
                name: string;
                createdAt: any;
              }
            | {
                __typename: "User";
                id: string;
                username: string;
                name: string;
                createdAt: any;
              };
          participant: { __typename: "Participant"; id: string };
          node:
            | { __typename: "Attribute"; id: string }
            | { __typename: "Group"; id: string }
            | { __typename: "Link"; id: string }
            | { __typename: "Participant"; id: string }
            | { __typename: "Scope"; id: string }
            | { __typename: "Step"; id: string }
            | { __typename: "Transition"; id: string }
            | { __typename: "User"; id: string };
        }
      | {
          __typename: "Participant";
          createdAt: any;
          identifier: string;
          id: string;
        }
      | {
          __typename: "Scope";
          name?: string | null;
          kind?: string | null;
          createdAt: any;
          id: string;
          createdBy:
            | {
                __typename: "Participant";
                id: string;
                identifier: string;
                createdAt: any;
              }
            | {
                __typename: "Service";
                id: string;
                name: string;
                createdAt: any;
              }
            | {
                __typename: "User";
                id: string;
                username: string;
                name: string;
                createdAt: any;
              };
          attributes: {
            __typename: "AttributeConnection";
            totalCount: number;
            pageInfo: {
              __typename: "PageInfo";
              hasNextPage: boolean;
              hasPreviousPage: boolean;
              startCursor?: any | null;
              endCursor?: any | null;
            };
            edges: Array<{
              __typename: "AttributeEdge";
              cursor: any;
              node: {
                __typename: "Attribute";
                id: string;
                createdAt: any;
                private: boolean;
                protected: boolean;
                immutable: boolean;
                deletedAt?: any | null;
                key: string;
                val?: string | null;
                index?: number | null;
                current: boolean;
                version: number;
                vector: boolean;
                createdBy:
                  | {
                      __typename: "Participant";
                      id: string;
                      identifier: string;
                      createdAt: any;
                    }
                  | {
                      __typename: "Service";
                      id: string;
                      name: string;
                      createdAt: any;
                    }
                  | {
                      __typename: "User";
                      id: string;
                      username: string;
                      name: string;
                      createdAt: any;
                    };
                node:
                  | { __typename: "Attribute"; id: string }
                  | { __typename: "Group"; id: string }
                  | { __typename: "Link"; id: string }
                  | { __typename: "Participant"; id: string }
                  | {
                      __typename: "Scope";
                      kind?: string | null;
                      name?: string | null;
                      id: string;
                    }
                  | { __typename: "Step"; id: string }
                  | { __typename: "Transition"; id: string }
                  | { __typename: "User"; id: string };
              };
            }>;
          };
        }
      | {
          __typename: "Step";
          createdAt: any;
          duration: number;
          startedAt?: any | null;
          endedAt?: any | null;
          state: State;
          id: string;
          createdBy:
            | {
                __typename: "Participant";
                id: string;
                identifier: string;
                createdAt: any;
              }
            | {
                __typename: "Service";
                id: string;
                name: string;
                createdAt: any;
              }
            | {
                __typename: "User";
                id: string;
                username: string;
                name: string;
                createdAt: any;
              };
          transitions: {
            __typename: "TransitionConnection";
            totalCount: number;
            pageInfo: {
              __typename: "PageInfo";
              hasNextPage: boolean;
              hasPreviousPage: boolean;
              startCursor?: any | null;
              endCursor?: any | null;
            };
            edges: Array<{
              __typename: "TransitionEdge";
              cursor: any;
              node: {
                __typename: "Transition";
                id: string;
                createdAt: any;
                from: State;
                to: State;
                createdBy:
                  | {
                      __typename: "Participant";
                      id: string;
                      identifier: string;
                      createdAt: any;
                    }
                  | {
                      __typename: "Service";
                      id: string;
                      name: string;
                      createdAt: any;
                    }
                  | {
                      __typename: "User";
                      id: string;
                      username: string;
                      name: string;
                      createdAt: any;
                    };
                node:
                  | { __typename: "Attribute" }
                  | { __typename: "Group" }
                  | { __typename: "Link" }
                  | { __typename: "Participant" }
                  | { __typename: "Scope" }
                  | {
                      __typename: "Step";
                      id: string;
                      duration: number;
                      state: State;
                      startedAt?: any | null;
                      endedAt?: any | null;
                    }
                  | { __typename: "Transition" }
                  | { __typename: "User" };
              };
            }>;
          };
        }
      | {
          __typename: "Transition";
          createdAt: any;
          from: State;
          to: State;
          id: string;
          createdBy:
            | {
                __typename: "Participant";
                id: string;
                identifier: string;
                createdAt: any;
              }
            | {
                __typename: "Service";
                id: string;
                name: string;
                createdAt: any;
              }
            | {
                __typename: "User";
                id: string;
                username: string;
                name: string;
                createdAt: any;
              };
          node:
            | { __typename: "Attribute" }
            | { __typename: "Group" }
            | { __typename: "Link" }
            | { __typename: "Participant" }
            | { __typename: "Scope" }
            | {
                __typename: "Step";
                id: string;
                duration: number;
                state: State;
                startedAt?: any | null;
                endedAt?: any | null;
              }
            | { __typename: "Transition" }
            | { __typename: "User" };
        }
      | { __typename: "User"; id: string };
  } | null;
};

export type OnAnyEventSubscriptionVariables = Exact<{
  input?: InputMaybe<OnAnyEventInput>;
}>;

export type OnAnyEventSubscription = {
  __typename: "Subscription";
  onAnyEvent?: {
    __typename: "OnEventPayload";
    eventID: string;
    eventType: EventType;
    done: boolean;
    node:
      | {
          __typename: "Attribute";
          createdAt: any;
          private: boolean;
          protected: boolean;
          immutable: boolean;
          deletedAt?: any | null;
          key: string;
          val?: string | null;
          index?: number | null;
          current: boolean;
          version: number;
          vector: boolean;
          id: string;
          createdBy:
            | {
                __typename: "Participant";
                id: string;
                identifier: string;
                createdAt: any;
              }
            | {
                __typename: "Service";
                id: string;
                name: string;
                createdAt: any;
              }
            | {
                __typename: "User";
                id: string;
                username: string;
                name: string;
                createdAt: any;
              };
          node:
            | { __typename: "Attribute"; id: string }
            | { __typename: "Group"; id: string }
            | { __typename: "Link"; id: string }
            | { __typename: "Participant"; id: string }
            | {
                __typename: "Scope";
                kind?: string | null;
                name?: string | null;
                id: string;
              }
            | { __typename: "Step"; id: string }
            | { __typename: "Transition"; id: string }
            | { __typename: "User"; id: string };
        }
      | {
          __typename: "Group";
          createdAt: any;
          id: string;
          createdBy:
            | {
                __typename: "Participant";
                id: string;
                identifier: string;
                createdAt: any;
              }
            | {
                __typename: "Service";
                id: string;
                name: string;
                createdAt: any;
              }
            | {
                __typename: "User";
                id: string;
                username: string;
                name: string;
                createdAt: any;
              };
        }
      | {
          __typename: "Link";
          createdAt: any;
          link: boolean;
          id: string;
          createdBy:
            | {
                __typename: "Participant";
                id: string;
                identifier: string;
                createdAt: any;
              }
            | {
                __typename: "Service";
                id: string;
                name: string;
                createdAt: any;
              }
            | {
                __typename: "User";
                id: string;
                username: string;
                name: string;
                createdAt: any;
              };
          participant: { __typename: "Participant"; id: string };
          node:
            | { __typename: "Attribute"; id: string }
            | { __typename: "Group"; id: string }
            | { __typename: "Link"; id: string }
            | { __typename: "Participant"; id: string }
            | { __typename: "Scope"; id: string }
            | { __typename: "Step"; id: string }
            | { __typename: "Transition"; id: string }
            | { __typename: "User"; id: string };
        }
      | {
          __typename: "Participant";
          createdAt: any;
          identifier: string;
          id: string;
        }
      | {
          __typename: "Scope";
          name?: string | null;
          kind?: string | null;
          createdAt: any;
          id: string;
          createdBy:
            | {
                __typename: "Participant";
                id: string;
                identifier: string;
                createdAt: any;
              }
            | {
                __typename: "Service";
                id: string;
                name: string;
                createdAt: any;
              }
            | {
                __typename: "User";
                id: string;
                username: string;
                name: string;
                createdAt: any;
              };
          attributes: {
            __typename: "AttributeConnection";
            totalCount: number;
            pageInfo: {
              __typename: "PageInfo";
              hasNextPage: boolean;
              hasPreviousPage: boolean;
              startCursor?: any | null;
              endCursor?: any | null;
            };
            edges: Array<{
              __typename: "AttributeEdge";
              cursor: any;
              node: {
                __typename: "Attribute";
                id: string;
                createdAt: any;
                private: boolean;
                protected: boolean;
                immutable: boolean;
                deletedAt?: any | null;
                key: string;
                val?: string | null;
                index?: number | null;
                current: boolean;
                version: number;
                vector: boolean;
                createdBy:
                  | {
                      __typename: "Participant";
                      id: string;
                      identifier: string;
                      createdAt: any;
                    }
                  | {
                      __typename: "Service";
                      id: string;
                      name: string;
                      createdAt: any;
                    }
                  | {
                      __typename: "User";
                      id: string;
                      username: string;
                      name: string;
                      createdAt: any;
                    };
                node:
                  | { __typename: "Attribute"; id: string }
                  | { __typename: "Group"; id: string }
                  | { __typename: "Link"; id: string }
                  | { __typename: "Participant"; id: string }
                  | {
                      __typename: "Scope";
                      kind?: string | null;
                      name?: string | null;
                      id: string;
                    }
                  | { __typename: "Step"; id: string }
                  | { __typename: "Transition"; id: string }
                  | { __typename: "User"; id: string };
              };
            }>;
          };
        }
      | {
          __typename: "Step";
          createdAt: any;
          duration: number;
          startedAt?: any | null;
          endedAt?: any | null;
          state: State;
          id: string;
          createdBy:
            | {
                __typename: "Participant";
                id: string;
                identifier: string;
                createdAt: any;
              }
            | {
                __typename: "Service";
                id: string;
                name: string;
                createdAt: any;
              }
            | {
                __typename: "User";
                id: string;
                username: string;
                name: string;
                createdAt: any;
              };
          transitions: {
            __typename: "TransitionConnection";
            totalCount: number;
            pageInfo: {
              __typename: "PageInfo";
              hasNextPage: boolean;
              hasPreviousPage: boolean;
              startCursor?: any | null;
              endCursor?: any | null;
            };
            edges: Array<{
              __typename: "TransitionEdge";
              cursor: any;
              node: {
                __typename: "Transition";
                id: string;
                createdAt: any;
                from: State;
                to: State;
                createdBy:
                  | {
                      __typename: "Participant";
                      id: string;
                      identifier: string;
                      createdAt: any;
                    }
                  | {
                      __typename: "Service";
                      id: string;
                      name: string;
                      createdAt: any;
                    }
                  | {
                      __typename: "User";
                      id: string;
                      username: string;
                      name: string;
                      createdAt: any;
                    };
                node:
                  | { __typename: "Attribute" }
                  | { __typename: "Group" }
                  | { __typename: "Link" }
                  | { __typename: "Participant" }
                  | { __typename: "Scope" }
                  | {
                      __typename: "Step";
                      id: string;
                      duration: number;
                      state: State;
                      startedAt?: any | null;
                      endedAt?: any | null;
                    }
                  | { __typename: "Transition" }
                  | { __typename: "User" };
              };
            }>;
          };
        }
      | {
          __typename: "Transition";
          createdAt: any;
          from: State;
          to: State;
          id: string;
          createdBy:
            | {
                __typename: "Participant";
                id: string;
                identifier: string;
                createdAt: any;
              }
            | {
                __typename: "Service";
                id: string;
                name: string;
                createdAt: any;
              }
            | {
                __typename: "User";
                id: string;
                username: string;
                name: string;
                createdAt: any;
              };
          node:
            | { __typename: "Attribute" }
            | { __typename: "Group" }
            | { __typename: "Link" }
            | { __typename: "Participant" }
            | { __typename: "Scope" }
            | {
                __typename: "Step";
                id: string;
                duration: number;
                state: State;
                startedAt?: any | null;
                endedAt?: any | null;
              }
            | { __typename: "Transition" }
            | { __typename: "User" };
        }
      | { __typename: "User"; id: string };
  } | null;
};

export type LinkMutationVariables = Exact<{
  input: LinkInput;
}>;

export type LinkMutation = {
  __typename: "Mutation";
  link: {
    __typename: "LinkPayload";
    nodes: Array<
      | { __typename: "Attribute"; id: string }
      | { __typename: "Group"; id: string }
      | { __typename: "Link"; id: string }
      | { __typename: "Participant"; id: string }
      | { __typename: "Scope"; id: string }
      | { __typename: "Step"; id: string }
      | { __typename: "Transition"; id: string }
      | { __typename: "User"; id: string }
    >;
    participants: Array<{ __typename: "Participant"; id: string }>;
  };
};

export type ParticipantsQueryVariables = Exact<{
  after?: InputMaybe<Scalars["Cursor"]>;
  first?: InputMaybe<Scalars["Int"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  last?: InputMaybe<Scalars["Int"]>;
}>;

export type ParticipantsQuery = {
  __typename: "Query";
  participants?: {
    __typename: "ParticipantConnection";
    totalCount: number;
    edges: Array<{
      __typename: "ParticipantEdge";
      node: {
        __typename: "Participant";
        id: string;
        createdAt: any;
        identifier: string;
      };
    }>;
    pageInfo: {
      __typename: "PageInfo";
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: any | null;
      endCursor?: any | null;
    };
  } | null;
};

export type AddParticipantMutationVariables = Exact<{
  input: AddParticipantInput;
}>;

export type AddParticipantMutation = {
  __typename: "Mutation";
  addParticipant: {
    __typename: "AddParticipantPayload";
    sessionToken: string;
    participant: {
      __typename: "Participant";
      id: string;
      createdAt: any;
      identifier: string;
    };
  };
};

export type AddScopesMutationVariables = Exact<{
  input: Array<AddScopeInput> | AddScopeInput;
}>;

export type AddScopesMutation = {
  __typename: "Mutation";
  addScopes: Array<{
    __typename: "AddScopePayload";
    scope: {
      __typename: "Scope";
      id: string;
      name?: string | null;
      kind?: string | null;
      createdAt: any;
      createdBy:
        | {
            __typename: "Participant";
            id: string;
            identifier: string;
            createdAt: any;
          }
        | { __typename: "Service"; id: string; name: string; createdAt: any }
        | {
            __typename: "User";
            id: string;
            username: string;
            name: string;
            createdAt: any;
          };
      attributes: {
        __typename: "AttributeConnection";
        totalCount: number;
        pageInfo: {
          __typename: "PageInfo";
          hasNextPage: boolean;
          hasPreviousPage: boolean;
          startCursor?: any | null;
          endCursor?: any | null;
        };
        edges: Array<{
          __typename: "AttributeEdge";
          cursor: any;
          node: {
            __typename: "Attribute";
            id: string;
            createdAt: any;
            private: boolean;
            protected: boolean;
            immutable: boolean;
            deletedAt?: any | null;
            key: string;
            val?: string | null;
            index?: number | null;
            current: boolean;
            version: number;
            vector: boolean;
            createdBy:
              | {
                  __typename: "Participant";
                  id: string;
                  identifier: string;
                  createdAt: any;
                }
              | {
                  __typename: "Service";
                  id: string;
                  name: string;
                  createdAt: any;
                }
              | {
                  __typename: "User";
                  id: string;
                  username: string;
                  name: string;
                  createdAt: any;
                };
            node:
              | { __typename: "Attribute"; id: string }
              | { __typename: "Group"; id: string }
              | { __typename: "Link"; id: string }
              | { __typename: "Participant"; id: string }
              | {
                  __typename: "Scope";
                  kind?: string | null;
                  name?: string | null;
                  id: string;
                }
              | { __typename: "Step"; id: string }
              | { __typename: "Transition"; id: string }
              | { __typename: "User"; id: string };
          };
        }>;
      };
    };
  }>;
};

export type ScopesQueryVariables = Exact<{
  filter?: InputMaybe<Array<ScopedAttributesInput> | ScopedAttributesInput>;
  after?: InputMaybe<Scalars["Cursor"]>;
  first?: InputMaybe<Scalars["Int"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  last?: InputMaybe<Scalars["Int"]>;
}>;

export type ScopesQuery = {
  __typename: "Query";
  scopes?: {
    __typename: "ScopeConnection";
    totalCount: number;
    edges: Array<{
      __typename: "ScopeEdge";
      node: {
        __typename: "Scope";
        id: string;
        name?: string | null;
        kind?: string | null;
        createdAt: any;
        createdBy:
          | {
              __typename: "Participant";
              id: string;
              identifier: string;
              createdAt: any;
            }
          | { __typename: "Service"; id: string; name: string; createdAt: any }
          | {
              __typename: "User";
              id: string;
              username: string;
              name: string;
              createdAt: any;
            };
        attributes: {
          __typename: "AttributeConnection";
          totalCount: number;
          pageInfo: {
            __typename: "PageInfo";
            hasNextPage: boolean;
            hasPreviousPage: boolean;
            startCursor?: any | null;
            endCursor?: any | null;
          };
          edges: Array<{
            __typename: "AttributeEdge";
            cursor: any;
            node: {
              __typename: "Attribute";
              id: string;
              createdAt: any;
              private: boolean;
              protected: boolean;
              immutable: boolean;
              deletedAt?: any | null;
              key: string;
              val?: string | null;
              index?: number | null;
              current: boolean;
              version: number;
              vector: boolean;
              createdBy:
                | {
                    __typename: "Participant";
                    id: string;
                    identifier: string;
                    createdAt: any;
                  }
                | {
                    __typename: "Service";
                    id: string;
                    name: string;
                    createdAt: any;
                  }
                | {
                    __typename: "User";
                    id: string;
                    username: string;
                    name: string;
                    createdAt: any;
                  };
              node:
                | { __typename: "Attribute"; id: string }
                | { __typename: "Group"; id: string }
                | { __typename: "Link"; id: string }
                | { __typename: "Participant"; id: string }
                | {
                    __typename: "Scope";
                    kind?: string | null;
                    name?: string | null;
                    id: string;
                  }
                | { __typename: "Step"; id: string }
                | { __typename: "Transition"; id: string }
                | { __typename: "User"; id: string };
            };
          }>;
        };
      };
    }>;
    pageInfo: {
      __typename: "PageInfo";
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: any | null;
      endCursor?: any | null;
    };
  } | null;
};

export type ScopedAttributesSubscriptionVariables = Exact<{
  input: Array<ScopedAttributesInput> | ScopedAttributesInput;
}>;

export type ScopedAttributesSubscription = {
  __typename: "Subscription";
  scopedAttributes: {
    __typename: "SubAttributesPayload";
    isNew: boolean;
    done: boolean;
    attribute?: {
      __typename: "Attribute";
      id: string;
      createdAt: any;
      private: boolean;
      protected: boolean;
      immutable: boolean;
      deletedAt?: any | null;
      key: string;
      val?: string | null;
      index?: number | null;
      current: boolean;
      version: number;
      vector: boolean;
      createdBy:
        | {
            __typename: "Participant";
            id: string;
            identifier: string;
            createdAt: any;
          }
        | { __typename: "Service"; id: string; name: string; createdAt: any }
        | {
            __typename: "User";
            id: string;
            username: string;
            name: string;
            createdAt: any;
          };
      node:
        | { __typename: "Attribute"; id: string }
        | { __typename: "Group"; id: string }
        | { __typename: "Link"; id: string }
        | { __typename: "Participant"; id: string }
        | {
            __typename: "Scope";
            kind?: string | null;
            name?: string | null;
            id: string;
          }
        | { __typename: "Step"; id: string }
        | { __typename: "Transition"; id: string }
        | { __typename: "User"; id: string };
    } | null;
  };
};

export type GlobalAttributesSubscriptionVariables = Exact<{
  [key: string]: never;
}>;

export type GlobalAttributesSubscription = {
  __typename: "Subscription";
  globalAttributes: {
    __typename: "SubAttributesPayload";
    isNew: boolean;
    done: boolean;
    attribute?: {
      __typename: "Attribute";
      id: string;
      createdAt: any;
      private: boolean;
      protected: boolean;
      immutable: boolean;
      deletedAt?: any | null;
      key: string;
      val?: string | null;
      index?: number | null;
      current: boolean;
      version: number;
      vector: boolean;
      createdBy:
        | {
            __typename: "Participant";
            id: string;
            identifier: string;
            createdAt: any;
          }
        | { __typename: "Service"; id: string; name: string; createdAt: any }
        | {
            __typename: "User";
            id: string;
            username: string;
            name: string;
            createdAt: any;
          };
      node:
        | { __typename: "Attribute"; id: string }
        | { __typename: "Group"; id: string }
        | { __typename: "Link"; id: string }
        | { __typename: "Participant"; id: string }
        | {
            __typename: "Scope";
            kind?: string | null;
            name?: string | null;
            id: string;
          }
        | { __typename: "Step"; id: string }
        | { __typename: "Transition"; id: string }
        | { __typename: "User"; id: string };
    } | null;
  };
};

export type RegisterServiceMutationVariables = Exact<{
  input: RegisterServiceInput;
}>;

export type RegisterServiceMutation = {
  __typename: "Mutation";
  registerService: {
    __typename: "RegisterServicePayload";
    sessionToken: string;
    service: {
      __typename: "Service";
      id: string;
      createdAt: any;
      name: string;
    };
  };
};

export type AddStepsMutationVariables = Exact<{
  input: Array<AddStepInput> | AddStepInput;
}>;

export type AddStepsMutation = {
  __typename: "Mutation";
  addSteps: Array<{
    __typename: "AddStepPayload";
    step: {
      __typename: "Step";
      id: string;
      createdAt: any;
      duration: number;
      startedAt?: any | null;
      endedAt?: any | null;
      state: State;
      createdBy:
        | {
            __typename: "Participant";
            id: string;
            identifier: string;
            createdAt: any;
          }
        | { __typename: "Service"; id: string; name: string; createdAt: any }
        | {
            __typename: "User";
            id: string;
            username: string;
            name: string;
            createdAt: any;
          };
      transitions: {
        __typename: "TransitionConnection";
        totalCount: number;
        pageInfo: {
          __typename: "PageInfo";
          hasNextPage: boolean;
          hasPreviousPage: boolean;
          startCursor?: any | null;
          endCursor?: any | null;
        };
        edges: Array<{
          __typename: "TransitionEdge";
          cursor: any;
          node: {
            __typename: "Transition";
            id: string;
            createdAt: any;
            from: State;
            to: State;
            createdBy:
              | {
                  __typename: "Participant";
                  id: string;
                  identifier: string;
                  createdAt: any;
                }
              | {
                  __typename: "Service";
                  id: string;
                  name: string;
                  createdAt: any;
                }
              | {
                  __typename: "User";
                  id: string;
                  username: string;
                  name: string;
                  createdAt: any;
                };
            node:
              | { __typename: "Attribute" }
              | { __typename: "Group" }
              | { __typename: "Link" }
              | { __typename: "Participant" }
              | { __typename: "Scope" }
              | {
                  __typename: "Step";
                  id: string;
                  duration: number;
                  state: State;
                  startedAt?: any | null;
                  endedAt?: any | null;
                }
              | { __typename: "Transition" }
              | { __typename: "User" };
          };
        }>;
      };
    };
  }>;
};

export type StepsQueryVariables = Exact<{
  after?: InputMaybe<Scalars["Cursor"]>;
  first?: InputMaybe<Scalars["Int"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  last?: InputMaybe<Scalars["Int"]>;
}>;

export type StepsQuery = {
  __typename: "Query";
  steps?: {
    __typename: "StepConnection";
    totalCount: number;
    edges: Array<{
      __typename: "StepEdge";
      node: {
        __typename: "Step";
        id: string;
        createdAt: any;
        duration: number;
        startedAt?: any | null;
        endedAt?: any | null;
        state: State;
        createdBy:
          | {
              __typename: "Participant";
              id: string;
              identifier: string;
              createdAt: any;
            }
          | { __typename: "Service"; id: string; name: string; createdAt: any }
          | {
              __typename: "User";
              id: string;
              username: string;
              name: string;
              createdAt: any;
            };
        transitions: {
          __typename: "TransitionConnection";
          totalCount: number;
          pageInfo: {
            __typename: "PageInfo";
            hasNextPage: boolean;
            hasPreviousPage: boolean;
            startCursor?: any | null;
            endCursor?: any | null;
          };
          edges: Array<{
            __typename: "TransitionEdge";
            cursor: any;
            node: {
              __typename: "Transition";
              id: string;
              createdAt: any;
              from: State;
              to: State;
              createdBy:
                | {
                    __typename: "Participant";
                    id: string;
                    identifier: string;
                    createdAt: any;
                  }
                | {
                    __typename: "Service";
                    id: string;
                    name: string;
                    createdAt: any;
                  }
                | {
                    __typename: "User";
                    id: string;
                    username: string;
                    name: string;
                    createdAt: any;
                  };
              node:
                | { __typename: "Attribute" }
                | { __typename: "Group" }
                | { __typename: "Link" }
                | { __typename: "Participant" }
                | { __typename: "Scope" }
                | {
                    __typename: "Step";
                    id: string;
                    duration: number;
                    state: State;
                    startedAt?: any | null;
                    endedAt?: any | null;
                  }
                | { __typename: "Transition" }
                | { __typename: "User" };
            };
          }>;
        };
      };
    }>;
    pageInfo: {
      __typename: "PageInfo";
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: any | null;
      endCursor?: any | null;
    };
  } | null;
};

export type TransitionMutationVariables = Exact<{
  input: TransitionInput;
}>;

export type TransitionMutation = {
  __typename: "Mutation";
  transition: {
    __typename: "TransitionPayload";
    transition: {
      __typename: "Transition";
      id: string;
      createdAt: any;
      from: State;
      to: State;
      createdBy:
        | {
            __typename: "Participant";
            id: string;
            identifier: string;
            createdAt: any;
          }
        | { __typename: "Service"; id: string; name: string; createdAt: any }
        | {
            __typename: "User";
            id: string;
            username: string;
            name: string;
            createdAt: any;
          };
      node:
        | { __typename: "Attribute" }
        | { __typename: "Group" }
        | { __typename: "Link" }
        | { __typename: "Participant" }
        | { __typename: "Scope" }
        | {
            __typename: "Step";
            id: string;
            duration: number;
            state: State;
            startedAt?: any | null;
            endedAt?: any | null;
          }
        | { __typename: "Transition" }
        | { __typename: "User" };
    };
  };
};

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;

export type LoginMutation = {
  __typename: "Mutation";
  login: {
    __typename: "LoginPayload";
    sessionToken: string;
    user: {
      __typename: "User";
      id: string;
      createdAt: any;
      username: string;
      name: string;
    };
  };
};

export const AttributesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Attributes" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "scopeID" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "after" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Cursor" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "first" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "before" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Cursor" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "last" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "attributes" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "scopeID" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "scopeID" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "after" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "after" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "first" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "first" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "before" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "before" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "last" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "last" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "pageInfo" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "hasNextPage" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "hasPreviousPage" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "startCursor" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "endCursor" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "edges" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "node" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "__typename" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdAt" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdBy" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "User" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "username",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "name" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "Service" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "name" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: {
                                        kind: "Name",
                                        value: "Participant",
                                      },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "identifier",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "private" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "protected" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "immutable" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "deletedAt" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "key" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "val" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "index" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "current" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "version" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "vector" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "node" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "__typename" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "Scope" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "kind" },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "name" },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "cursor" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AttributesQuery, AttributesQueryVariables>;
export const SetAttributesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "SetAttributes" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: { kind: "Name", value: "SetAttributeInput" },
                },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "setAttributes" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "attribute" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "__typename" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "createdAt" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "createdBy" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "InlineFragment",
                              typeCondition: {
                                kind: "NamedType",
                                name: { kind: "Name", value: "User" },
                              },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "username" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "createdAt" },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "InlineFragment",
                              typeCondition: {
                                kind: "NamedType",
                                name: { kind: "Name", value: "Service" },
                              },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "createdAt" },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "InlineFragment",
                              typeCondition: {
                                kind: "NamedType",
                                name: { kind: "Name", value: "Participant" },
                              },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "identifier" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "createdAt" },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "private" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "protected" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "immutable" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "deletedAt" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "key" } },
                      { kind: "Field", name: { kind: "Name", value: "val" } },
                      { kind: "Field", name: { kind: "Name", value: "index" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "current" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "version" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "vector" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "node" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "__typename" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "InlineFragment",
                              typeCondition: {
                                kind: "NamedType",
                                name: { kind: "Name", value: "Scope" },
                              },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "kind" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  SetAttributesMutation,
  SetAttributesMutationVariables
>;
export const ChangesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "subscription",
      name: { kind: "Name", value: "Changes" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "changes" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "done" } },
                { kind: "Field", name: { kind: "Name", value: "removed" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "change" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "__typename" },
                      },
                      {
                        kind: "InlineFragment",
                        typeCondition: {
                          kind: "NamedType",
                          name: { kind: "Name", value: "ScopeChange" },
                        },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "kind" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "InlineFragment",
                        typeCondition: {
                          kind: "NamedType",
                          name: { kind: "Name", value: "StepChange" },
                        },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "state" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "since" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "remaining" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "ellapsed" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "running" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "InlineFragment",
                        typeCondition: {
                          kind: "NamedType",
                          name: { kind: "Name", value: "AttributeChange" },
                        },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "nodeID" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "deleted" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "isNew" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "index" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "vector" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "version" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "key" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "val" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "InlineFragment",
                        typeCondition: {
                          kind: "NamedType",
                          name: { kind: "Name", value: "ParticipantChange" },
                        },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ChangesSubscription, ChangesSubscriptionVariables>;
export const AddGroupsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "AddGroups" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: { kind: "Name", value: "AddGroupInput" },
                },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "addGroups" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "group" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AddGroupsMutation, AddGroupsMutationVariables>;
export const GroupsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Groups" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "after" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Cursor" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "first" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "before" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Cursor" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "last" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "groups" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "after" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "after" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "first" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "first" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "before" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "before" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "last" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "last" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "edges" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "node" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "__typename" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdAt" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdBy" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "User" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "username",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "name" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "Service" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "name" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: {
                                        kind: "Name",
                                        value: "Participant",
                                      },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "identifier",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "pageInfo" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "hasNextPage" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "hasPreviousPage" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "startCursor" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "endCursor" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GroupsQuery, GroupsQueryVariables>;
export const OnEventDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "subscription",
      name: { kind: "Name", value: "OnEvent" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NamedType",
            name: { kind: "Name", value: "OnEventInput" },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "onEvent" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "eventID" } },
                { kind: "Field", name: { kind: "Name", value: "eventType" } },
                { kind: "Field", name: { kind: "Name", value: "done" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "node" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "__typename" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "InlineFragment",
                        typeCondition: {
                          kind: "NamedType",
                          name: { kind: "Name", value: "Participant" },
                        },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdAt" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "identifier" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "InlineFragment",
                        typeCondition: {
                          kind: "NamedType",
                          name: { kind: "Name", value: "Attribute" },
                        },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdAt" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdBy" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "User" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "username",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "name" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "Service" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "name" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: {
                                        kind: "Name",
                                        value: "Participant",
                                      },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "identifier",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "private" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "protected" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "immutable" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "deletedAt" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "key" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "val" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "index" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "current" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "version" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "vector" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "node" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "__typename" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "Scope" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "kind" },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "name" },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: "InlineFragment",
                        typeCondition: {
                          kind: "NamedType",
                          name: { kind: "Name", value: "Step" },
                        },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdAt" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdBy" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "User" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "username",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "name" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "Service" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "name" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: {
                                        kind: "Name",
                                        value: "Participant",
                                      },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "identifier",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "duration" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "startedAt" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "endedAt" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "state" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "transitions" },
                              arguments: [
                                {
                                  kind: "Argument",
                                  name: { kind: "Name", value: "first" },
                                  value: { kind: "IntValue", value: "100" },
                                },
                              ],
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "totalCount" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "pageInfo" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "hasNextPage",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "hasPreviousPage",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "startCursor",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "endCursor",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "edges" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "node" },
                                          selectionSet: {
                                            kind: "SelectionSet",
                                            selections: [
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "__typename",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "id",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "createdAt",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "createdBy",
                                                },
                                                selectionSet: {
                                                  kind: "SelectionSet",
                                                  selections: [
                                                    {
                                                      kind: "InlineFragment",
                                                      typeCondition: {
                                                        kind: "NamedType",
                                                        name: {
                                                          kind: "Name",
                                                          value: "User",
                                                        },
                                                      },
                                                      selectionSet: {
                                                        kind: "SelectionSet",
                                                        selections: [
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "id",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "username",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "name",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value:
                                                                "createdAt",
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                    {
                                                      kind: "InlineFragment",
                                                      typeCondition: {
                                                        kind: "NamedType",
                                                        name: {
                                                          kind: "Name",
                                                          value: "Service",
                                                        },
                                                      },
                                                      selectionSet: {
                                                        kind: "SelectionSet",
                                                        selections: [
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "id",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "name",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value:
                                                                "createdAt",
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                    {
                                                      kind: "InlineFragment",
                                                      typeCondition: {
                                                        kind: "NamedType",
                                                        name: {
                                                          kind: "Name",
                                                          value: "Participant",
                                                        },
                                                      },
                                                      selectionSet: {
                                                        kind: "SelectionSet",
                                                        selections: [
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "id",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value:
                                                                "identifier",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value:
                                                                "createdAt",
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "from",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "to",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "node",
                                                },
                                                selectionSet: {
                                                  kind: "SelectionSet",
                                                  selections: [
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "__typename",
                                                      },
                                                    },
                                                    {
                                                      kind: "InlineFragment",
                                                      typeCondition: {
                                                        kind: "NamedType",
                                                        name: {
                                                          kind: "Name",
                                                          value: "Step",
                                                        },
                                                      },
                                                      selectionSet: {
                                                        kind: "SelectionSet",
                                                        selections: [
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "id",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "duration",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "state",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value:
                                                                "startedAt",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "endedAt",
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "cursor",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: "InlineFragment",
                        typeCondition: {
                          kind: "NamedType",
                          name: { kind: "Name", value: "Group" },
                        },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdAt" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdBy" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "User" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "username",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "name" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "Service" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "name" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: {
                                        kind: "Name",
                                        value: "Participant",
                                      },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "identifier",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: "InlineFragment",
                        typeCondition: {
                          kind: "NamedType",
                          name: { kind: "Name", value: "Scope" },
                        },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "kind" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdAt" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdBy" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "User" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "username",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "name" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "Service" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "name" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: {
                                        kind: "Name",
                                        value: "Participant",
                                      },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "identifier",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "attributes" },
                              arguments: [
                                {
                                  kind: "Argument",
                                  name: { kind: "Name", value: "first" },
                                  value: { kind: "IntValue", value: "100" },
                                },
                              ],
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "totalCount" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "pageInfo" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "hasNextPage",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "hasPreviousPage",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "startCursor",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "endCursor",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "edges" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "node" },
                                          selectionSet: {
                                            kind: "SelectionSet",
                                            selections: [
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "__typename",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "id",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "createdAt",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "createdBy",
                                                },
                                                selectionSet: {
                                                  kind: "SelectionSet",
                                                  selections: [
                                                    {
                                                      kind: "InlineFragment",
                                                      typeCondition: {
                                                        kind: "NamedType",
                                                        name: {
                                                          kind: "Name",
                                                          value: "User",
                                                        },
                                                      },
                                                      selectionSet: {
                                                        kind: "SelectionSet",
                                                        selections: [
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "id",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "username",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "name",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value:
                                                                "createdAt",
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                    {
                                                      kind: "InlineFragment",
                                                      typeCondition: {
                                                        kind: "NamedType",
                                                        name: {
                                                          kind: "Name",
                                                          value: "Service",
                                                        },
                                                      },
                                                      selectionSet: {
                                                        kind: "SelectionSet",
                                                        selections: [
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "id",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "name",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value:
                                                                "createdAt",
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                    {
                                                      kind: "InlineFragment",
                                                      typeCondition: {
                                                        kind: "NamedType",
                                                        name: {
                                                          kind: "Name",
                                                          value: "Participant",
                                                        },
                                                      },
                                                      selectionSet: {
                                                        kind: "SelectionSet",
                                                        selections: [
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "id",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value:
                                                                "identifier",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value:
                                                                "createdAt",
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "private",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "protected",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "immutable",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "deletedAt",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "key",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "val",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "index",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "current",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "version",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "vector",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "node",
                                                },
                                                selectionSet: {
                                                  kind: "SelectionSet",
                                                  selections: [
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "__typename",
                                                      },
                                                    },
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "id",
                                                      },
                                                    },
                                                    {
                                                      kind: "InlineFragment",
                                                      typeCondition: {
                                                        kind: "NamedType",
                                                        name: {
                                                          kind: "Name",
                                                          value: "Scope",
                                                        },
                                                      },
                                                      selectionSet: {
                                                        kind: "SelectionSet",
                                                        selections: [
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "kind",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "name",
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "cursor",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: "InlineFragment",
                        typeCondition: {
                          kind: "NamedType",
                          name: { kind: "Name", value: "Transition" },
                        },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdAt" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdBy" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "User" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "username",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "name" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "Service" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "name" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: {
                                        kind: "Name",
                                        value: "Participant",
                                      },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "identifier",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "from" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "to" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "node" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "__typename" },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "Step" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "duration",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "state",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "startedAt",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "endedAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: "InlineFragment",
                        typeCondition: {
                          kind: "NamedType",
                          name: { kind: "Name", value: "Link" },
                        },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdAt" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdBy" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "User" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "username",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "name" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "Service" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "name" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: {
                                        kind: "Name",
                                        value: "Participant",
                                      },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "identifier",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "link" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "participant" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "node" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<OnEventSubscription, OnEventSubscriptionVariables>;
export const OnAnyEventDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "subscription",
      name: { kind: "Name", value: "OnAnyEvent" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NamedType",
            name: { kind: "Name", value: "OnAnyEventInput" },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "onAnyEvent" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "eventID" } },
                { kind: "Field", name: { kind: "Name", value: "eventType" } },
                { kind: "Field", name: { kind: "Name", value: "done" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "node" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "__typename" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "InlineFragment",
                        typeCondition: {
                          kind: "NamedType",
                          name: { kind: "Name", value: "Participant" },
                        },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdAt" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "identifier" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "InlineFragment",
                        typeCondition: {
                          kind: "NamedType",
                          name: { kind: "Name", value: "Attribute" },
                        },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdAt" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdBy" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "User" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "username",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "name" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "Service" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "name" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: {
                                        kind: "Name",
                                        value: "Participant",
                                      },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "identifier",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "private" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "protected" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "immutable" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "deletedAt" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "key" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "val" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "index" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "current" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "version" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "vector" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "node" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "__typename" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "Scope" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "kind" },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "name" },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: "InlineFragment",
                        typeCondition: {
                          kind: "NamedType",
                          name: { kind: "Name", value: "Step" },
                        },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdAt" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdBy" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "User" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "username",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "name" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "Service" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "name" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: {
                                        kind: "Name",
                                        value: "Participant",
                                      },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "identifier",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "duration" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "startedAt" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "endedAt" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "state" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "transitions" },
                              arguments: [
                                {
                                  kind: "Argument",
                                  name: { kind: "Name", value: "first" },
                                  value: { kind: "IntValue", value: "100" },
                                },
                              ],
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "totalCount" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "pageInfo" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "hasNextPage",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "hasPreviousPage",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "startCursor",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "endCursor",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "edges" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "node" },
                                          selectionSet: {
                                            kind: "SelectionSet",
                                            selections: [
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "__typename",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "id",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "createdAt",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "createdBy",
                                                },
                                                selectionSet: {
                                                  kind: "SelectionSet",
                                                  selections: [
                                                    {
                                                      kind: "InlineFragment",
                                                      typeCondition: {
                                                        kind: "NamedType",
                                                        name: {
                                                          kind: "Name",
                                                          value: "User",
                                                        },
                                                      },
                                                      selectionSet: {
                                                        kind: "SelectionSet",
                                                        selections: [
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "id",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "username",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "name",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value:
                                                                "createdAt",
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                    {
                                                      kind: "InlineFragment",
                                                      typeCondition: {
                                                        kind: "NamedType",
                                                        name: {
                                                          kind: "Name",
                                                          value: "Service",
                                                        },
                                                      },
                                                      selectionSet: {
                                                        kind: "SelectionSet",
                                                        selections: [
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "id",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "name",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value:
                                                                "createdAt",
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                    {
                                                      kind: "InlineFragment",
                                                      typeCondition: {
                                                        kind: "NamedType",
                                                        name: {
                                                          kind: "Name",
                                                          value: "Participant",
                                                        },
                                                      },
                                                      selectionSet: {
                                                        kind: "SelectionSet",
                                                        selections: [
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "id",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value:
                                                                "identifier",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value:
                                                                "createdAt",
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "from",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "to",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "node",
                                                },
                                                selectionSet: {
                                                  kind: "SelectionSet",
                                                  selections: [
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "__typename",
                                                      },
                                                    },
                                                    {
                                                      kind: "InlineFragment",
                                                      typeCondition: {
                                                        kind: "NamedType",
                                                        name: {
                                                          kind: "Name",
                                                          value: "Step",
                                                        },
                                                      },
                                                      selectionSet: {
                                                        kind: "SelectionSet",
                                                        selections: [
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "id",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "duration",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "state",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value:
                                                                "startedAt",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "endedAt",
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "cursor",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: "InlineFragment",
                        typeCondition: {
                          kind: "NamedType",
                          name: { kind: "Name", value: "Group" },
                        },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdAt" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdBy" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "User" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "username",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "name" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "Service" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "name" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: {
                                        kind: "Name",
                                        value: "Participant",
                                      },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "identifier",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: "InlineFragment",
                        typeCondition: {
                          kind: "NamedType",
                          name: { kind: "Name", value: "Scope" },
                        },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "kind" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdAt" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdBy" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "User" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "username",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "name" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "Service" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "name" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: {
                                        kind: "Name",
                                        value: "Participant",
                                      },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "identifier",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "attributes" },
                              arguments: [
                                {
                                  kind: "Argument",
                                  name: { kind: "Name", value: "first" },
                                  value: { kind: "IntValue", value: "100" },
                                },
                              ],
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "totalCount" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "pageInfo" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "hasNextPage",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "hasPreviousPage",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "startCursor",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "endCursor",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "edges" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "node" },
                                          selectionSet: {
                                            kind: "SelectionSet",
                                            selections: [
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "__typename",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "id",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "createdAt",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "createdBy",
                                                },
                                                selectionSet: {
                                                  kind: "SelectionSet",
                                                  selections: [
                                                    {
                                                      kind: "InlineFragment",
                                                      typeCondition: {
                                                        kind: "NamedType",
                                                        name: {
                                                          kind: "Name",
                                                          value: "User",
                                                        },
                                                      },
                                                      selectionSet: {
                                                        kind: "SelectionSet",
                                                        selections: [
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "id",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "username",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "name",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value:
                                                                "createdAt",
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                    {
                                                      kind: "InlineFragment",
                                                      typeCondition: {
                                                        kind: "NamedType",
                                                        name: {
                                                          kind: "Name",
                                                          value: "Service",
                                                        },
                                                      },
                                                      selectionSet: {
                                                        kind: "SelectionSet",
                                                        selections: [
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "id",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "name",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value:
                                                                "createdAt",
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                    {
                                                      kind: "InlineFragment",
                                                      typeCondition: {
                                                        kind: "NamedType",
                                                        name: {
                                                          kind: "Name",
                                                          value: "Participant",
                                                        },
                                                      },
                                                      selectionSet: {
                                                        kind: "SelectionSet",
                                                        selections: [
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "id",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value:
                                                                "identifier",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value:
                                                                "createdAt",
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "private",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "protected",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "immutable",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "deletedAt",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "key",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "val",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "index",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "current",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "version",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "vector",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "node",
                                                },
                                                selectionSet: {
                                                  kind: "SelectionSet",
                                                  selections: [
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "__typename",
                                                      },
                                                    },
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "id",
                                                      },
                                                    },
                                                    {
                                                      kind: "InlineFragment",
                                                      typeCondition: {
                                                        kind: "NamedType",
                                                        name: {
                                                          kind: "Name",
                                                          value: "Scope",
                                                        },
                                                      },
                                                      selectionSet: {
                                                        kind: "SelectionSet",
                                                        selections: [
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "kind",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "name",
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "cursor",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: "InlineFragment",
                        typeCondition: {
                          kind: "NamedType",
                          name: { kind: "Name", value: "Transition" },
                        },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdAt" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdBy" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "User" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "username",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "name" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "Service" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "name" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: {
                                        kind: "Name",
                                        value: "Participant",
                                      },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "identifier",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "from" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "to" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "node" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "__typename" },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "Step" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "duration",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "state",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "startedAt",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "endedAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: "InlineFragment",
                        typeCondition: {
                          kind: "NamedType",
                          name: { kind: "Name", value: "Link" },
                        },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdAt" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdBy" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "User" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "username",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "name" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "Service" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "name" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: {
                                        kind: "Name",
                                        value: "Participant",
                                      },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "identifier",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "link" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "participant" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "node" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  OnAnyEventSubscription,
  OnAnyEventSubscriptionVariables
>;
export const LinkDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "Link" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "LinkInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "link" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "nodes" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "participants" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LinkMutation, LinkMutationVariables>;
export const ParticipantsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Participants" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "after" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Cursor" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "first" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "before" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Cursor" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "last" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "participants" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "after" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "after" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "first" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "first" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "before" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "before" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "last" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "last" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "edges" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "node" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "__typename" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdAt" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "identifier" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "pageInfo" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "hasNextPage" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "hasPreviousPage" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "startCursor" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "endCursor" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ParticipantsQuery, ParticipantsQueryVariables>;
export const AddParticipantDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "AddParticipant" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "AddParticipantInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "addParticipant" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "participant" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "__typename" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "createdAt" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "identifier" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "sessionToken" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  AddParticipantMutation,
  AddParticipantMutationVariables
>;
export const AddScopesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "AddScopes" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: { kind: "Name", value: "AddScopeInput" },
                },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "addScopes" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "scope" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "__typename" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "kind" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "createdAt" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "createdBy" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "InlineFragment",
                              typeCondition: {
                                kind: "NamedType",
                                name: { kind: "Name", value: "User" },
                              },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "username" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "createdAt" },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "InlineFragment",
                              typeCondition: {
                                kind: "NamedType",
                                name: { kind: "Name", value: "Service" },
                              },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "createdAt" },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "InlineFragment",
                              typeCondition: {
                                kind: "NamedType",
                                name: { kind: "Name", value: "Participant" },
                              },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "identifier" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "createdAt" },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "attributes" },
                        arguments: [
                          {
                            kind: "Argument",
                            name: { kind: "Name", value: "first" },
                            value: { kind: "IntValue", value: "100" },
                          },
                        ],
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "totalCount" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "pageInfo" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: {
                                      kind: "Name",
                                      value: "hasNextPage",
                                    },
                                  },
                                  {
                                    kind: "Field",
                                    name: {
                                      kind: "Name",
                                      value: "hasPreviousPage",
                                    },
                                  },
                                  {
                                    kind: "Field",
                                    name: {
                                      kind: "Name",
                                      value: "startCursor",
                                    },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "endCursor" },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "edges" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "node" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "__typename",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdBy",
                                          },
                                          selectionSet: {
                                            kind: "SelectionSet",
                                            selections: [
                                              {
                                                kind: "InlineFragment",
                                                typeCondition: {
                                                  kind: "NamedType",
                                                  name: {
                                                    kind: "Name",
                                                    value: "User",
                                                  },
                                                },
                                                selectionSet: {
                                                  kind: "SelectionSet",
                                                  selections: [
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "id",
                                                      },
                                                    },
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "username",
                                                      },
                                                    },
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "name",
                                                      },
                                                    },
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "createdAt",
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                              {
                                                kind: "InlineFragment",
                                                typeCondition: {
                                                  kind: "NamedType",
                                                  name: {
                                                    kind: "Name",
                                                    value: "Service",
                                                  },
                                                },
                                                selectionSet: {
                                                  kind: "SelectionSet",
                                                  selections: [
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "id",
                                                      },
                                                    },
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "name",
                                                      },
                                                    },
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "createdAt",
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                              {
                                                kind: "InlineFragment",
                                                typeCondition: {
                                                  kind: "NamedType",
                                                  name: {
                                                    kind: "Name",
                                                    value: "Participant",
                                                  },
                                                },
                                                selectionSet: {
                                                  kind: "SelectionSet",
                                                  selections: [
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "id",
                                                      },
                                                    },
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "identifier",
                                                      },
                                                    },
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "createdAt",
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "private",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "protected",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "immutable",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "deletedAt",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "key" },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "val" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "index",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "current",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "version",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "vector",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "node" },
                                          selectionSet: {
                                            kind: "SelectionSet",
                                            selections: [
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "__typename",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "id",
                                                },
                                              },
                                              {
                                                kind: "InlineFragment",
                                                typeCondition: {
                                                  kind: "NamedType",
                                                  name: {
                                                    kind: "Name",
                                                    value: "Scope",
                                                  },
                                                },
                                                selectionSet: {
                                                  kind: "SelectionSet",
                                                  selections: [
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "kind",
                                                      },
                                                    },
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "name",
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "cursor" },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AddScopesMutation, AddScopesMutationVariables>;
export const ScopesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Scopes" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "filter" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "ScopedAttributesInput" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "after" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Cursor" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "first" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "before" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Cursor" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "last" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "scopes" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "filter" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "filter" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "after" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "after" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "first" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "first" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "before" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "before" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "last" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "last" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "edges" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "node" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "__typename" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "kind" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdAt" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdBy" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "User" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "username",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "name" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "Service" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "name" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: {
                                        kind: "Name",
                                        value: "Participant",
                                      },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "identifier",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "attributes" },
                              arguments: [
                                {
                                  kind: "Argument",
                                  name: { kind: "Name", value: "first" },
                                  value: { kind: "IntValue", value: "100" },
                                },
                              ],
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "totalCount" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "pageInfo" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "hasNextPage",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "hasPreviousPage",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "startCursor",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "endCursor",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "edges" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "node" },
                                          selectionSet: {
                                            kind: "SelectionSet",
                                            selections: [
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "__typename",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "id",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "createdAt",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "createdBy",
                                                },
                                                selectionSet: {
                                                  kind: "SelectionSet",
                                                  selections: [
                                                    {
                                                      kind: "InlineFragment",
                                                      typeCondition: {
                                                        kind: "NamedType",
                                                        name: {
                                                          kind: "Name",
                                                          value: "User",
                                                        },
                                                      },
                                                      selectionSet: {
                                                        kind: "SelectionSet",
                                                        selections: [
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "id",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "username",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "name",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value:
                                                                "createdAt",
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                    {
                                                      kind: "InlineFragment",
                                                      typeCondition: {
                                                        kind: "NamedType",
                                                        name: {
                                                          kind: "Name",
                                                          value: "Service",
                                                        },
                                                      },
                                                      selectionSet: {
                                                        kind: "SelectionSet",
                                                        selections: [
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "id",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "name",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value:
                                                                "createdAt",
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                    {
                                                      kind: "InlineFragment",
                                                      typeCondition: {
                                                        kind: "NamedType",
                                                        name: {
                                                          kind: "Name",
                                                          value: "Participant",
                                                        },
                                                      },
                                                      selectionSet: {
                                                        kind: "SelectionSet",
                                                        selections: [
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "id",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value:
                                                                "identifier",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value:
                                                                "createdAt",
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "private",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "protected",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "immutable",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "deletedAt",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "key",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "val",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "index",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "current",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "version",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "vector",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "node",
                                                },
                                                selectionSet: {
                                                  kind: "SelectionSet",
                                                  selections: [
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "__typename",
                                                      },
                                                    },
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "id",
                                                      },
                                                    },
                                                    {
                                                      kind: "InlineFragment",
                                                      typeCondition: {
                                                        kind: "NamedType",
                                                        name: {
                                                          kind: "Name",
                                                          value: "Scope",
                                                        },
                                                      },
                                                      selectionSet: {
                                                        kind: "SelectionSet",
                                                        selections: [
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "kind",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "name",
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "cursor",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "pageInfo" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "hasNextPage" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "hasPreviousPage" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "startCursor" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "endCursor" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ScopesQuery, ScopesQueryVariables>;
export const ScopedAttributesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "subscription",
      name: { kind: "Name", value: "ScopedAttributes" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: { kind: "Name", value: "ScopedAttributesInput" },
                },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "scopedAttributes" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "attribute" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "__typename" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "createdAt" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "createdBy" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "InlineFragment",
                              typeCondition: {
                                kind: "NamedType",
                                name: { kind: "Name", value: "User" },
                              },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "username" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "createdAt" },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "InlineFragment",
                              typeCondition: {
                                kind: "NamedType",
                                name: { kind: "Name", value: "Service" },
                              },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "createdAt" },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "InlineFragment",
                              typeCondition: {
                                kind: "NamedType",
                                name: { kind: "Name", value: "Participant" },
                              },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "identifier" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "createdAt" },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "private" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "protected" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "immutable" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "deletedAt" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "key" } },
                      { kind: "Field", name: { kind: "Name", value: "val" } },
                      { kind: "Field", name: { kind: "Name", value: "index" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "current" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "version" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "vector" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "node" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "__typename" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "InlineFragment",
                              typeCondition: {
                                kind: "NamedType",
                                name: { kind: "Name", value: "Scope" },
                              },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "kind" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "isNew" } },
                { kind: "Field", name: { kind: "Name", value: "done" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ScopedAttributesSubscription,
  ScopedAttributesSubscriptionVariables
>;
export const GlobalAttributesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "subscription",
      name: { kind: "Name", value: "GlobalAttributes" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "globalAttributes" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "attribute" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "__typename" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "createdAt" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "createdBy" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "InlineFragment",
                              typeCondition: {
                                kind: "NamedType",
                                name: { kind: "Name", value: "User" },
                              },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "username" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "createdAt" },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "InlineFragment",
                              typeCondition: {
                                kind: "NamedType",
                                name: { kind: "Name", value: "Service" },
                              },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "createdAt" },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "InlineFragment",
                              typeCondition: {
                                kind: "NamedType",
                                name: { kind: "Name", value: "Participant" },
                              },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "identifier" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "createdAt" },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "private" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "protected" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "immutable" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "deletedAt" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "key" } },
                      { kind: "Field", name: { kind: "Name", value: "val" } },
                      { kind: "Field", name: { kind: "Name", value: "index" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "current" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "version" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "vector" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "node" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "__typename" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "InlineFragment",
                              typeCondition: {
                                kind: "NamedType",
                                name: { kind: "Name", value: "Scope" },
                              },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "kind" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "isNew" } },
                { kind: "Field", name: { kind: "Name", value: "done" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GlobalAttributesSubscription,
  GlobalAttributesSubscriptionVariables
>;
export const RegisterServiceDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "RegisterService" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "RegisterServiceInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "registerService" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "service" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "__typename" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "createdAt" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "sessionToken" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  RegisterServiceMutation,
  RegisterServiceMutationVariables
>;
export const AddStepsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "AddSteps" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: { kind: "Name", value: "AddStepInput" },
                },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "addSteps" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "step" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "__typename" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "createdAt" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "createdBy" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "InlineFragment",
                              typeCondition: {
                                kind: "NamedType",
                                name: { kind: "Name", value: "User" },
                              },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "username" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "createdAt" },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "InlineFragment",
                              typeCondition: {
                                kind: "NamedType",
                                name: { kind: "Name", value: "Service" },
                              },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "createdAt" },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "InlineFragment",
                              typeCondition: {
                                kind: "NamedType",
                                name: { kind: "Name", value: "Participant" },
                              },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "identifier" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "createdAt" },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "duration" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "startedAt" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "endedAt" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "state" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "transitions" },
                        arguments: [
                          {
                            kind: "Argument",
                            name: { kind: "Name", value: "first" },
                            value: { kind: "IntValue", value: "100" },
                          },
                        ],
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "totalCount" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "pageInfo" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: {
                                      kind: "Name",
                                      value: "hasNextPage",
                                    },
                                  },
                                  {
                                    kind: "Field",
                                    name: {
                                      kind: "Name",
                                      value: "hasPreviousPage",
                                    },
                                  },
                                  {
                                    kind: "Field",
                                    name: {
                                      kind: "Name",
                                      value: "startCursor",
                                    },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "endCursor" },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "edges" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "node" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "__typename",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdBy",
                                          },
                                          selectionSet: {
                                            kind: "SelectionSet",
                                            selections: [
                                              {
                                                kind: "InlineFragment",
                                                typeCondition: {
                                                  kind: "NamedType",
                                                  name: {
                                                    kind: "Name",
                                                    value: "User",
                                                  },
                                                },
                                                selectionSet: {
                                                  kind: "SelectionSet",
                                                  selections: [
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "id",
                                                      },
                                                    },
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "username",
                                                      },
                                                    },
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "name",
                                                      },
                                                    },
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "createdAt",
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                              {
                                                kind: "InlineFragment",
                                                typeCondition: {
                                                  kind: "NamedType",
                                                  name: {
                                                    kind: "Name",
                                                    value: "Service",
                                                  },
                                                },
                                                selectionSet: {
                                                  kind: "SelectionSet",
                                                  selections: [
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "id",
                                                      },
                                                    },
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "name",
                                                      },
                                                    },
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "createdAt",
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                              {
                                                kind: "InlineFragment",
                                                typeCondition: {
                                                  kind: "NamedType",
                                                  name: {
                                                    kind: "Name",
                                                    value: "Participant",
                                                  },
                                                },
                                                selectionSet: {
                                                  kind: "SelectionSet",
                                                  selections: [
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "id",
                                                      },
                                                    },
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "identifier",
                                                      },
                                                    },
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "createdAt",
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "from" },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "to" },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "node" },
                                          selectionSet: {
                                            kind: "SelectionSet",
                                            selections: [
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "__typename",
                                                },
                                              },
                                              {
                                                kind: "InlineFragment",
                                                typeCondition: {
                                                  kind: "NamedType",
                                                  name: {
                                                    kind: "Name",
                                                    value: "Step",
                                                  },
                                                },
                                                selectionSet: {
                                                  kind: "SelectionSet",
                                                  selections: [
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "id",
                                                      },
                                                    },
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "duration",
                                                      },
                                                    },
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "state",
                                                      },
                                                    },
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "startedAt",
                                                      },
                                                    },
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "endedAt",
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "cursor" },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AddStepsMutation, AddStepsMutationVariables>;
export const StepsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Steps" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "after" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Cursor" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "first" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "before" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Cursor" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "last" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "steps" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "after" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "after" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "first" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "first" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "before" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "before" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "last" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "last" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "edges" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "node" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "__typename" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdAt" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdBy" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "User" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "username",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "name" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: { kind: "Name", value: "Service" },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "name" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                      kind: "NamedType",
                                      name: {
                                        kind: "Name",
                                        value: "Participant",
                                      },
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "identifier",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "createdAt",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "duration" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "startedAt" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "endedAt" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "state" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "transitions" },
                              arguments: [
                                {
                                  kind: "Argument",
                                  name: { kind: "Name", value: "first" },
                                  value: { kind: "IntValue", value: "100" },
                                },
                              ],
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "totalCount" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "pageInfo" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "hasNextPage",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "hasPreviousPage",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "startCursor",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "endCursor",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "edges" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "node" },
                                          selectionSet: {
                                            kind: "SelectionSet",
                                            selections: [
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "__typename",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "id",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "createdAt",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "createdBy",
                                                },
                                                selectionSet: {
                                                  kind: "SelectionSet",
                                                  selections: [
                                                    {
                                                      kind: "InlineFragment",
                                                      typeCondition: {
                                                        kind: "NamedType",
                                                        name: {
                                                          kind: "Name",
                                                          value: "User",
                                                        },
                                                      },
                                                      selectionSet: {
                                                        kind: "SelectionSet",
                                                        selections: [
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "id",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "username",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "name",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value:
                                                                "createdAt",
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                    {
                                                      kind: "InlineFragment",
                                                      typeCondition: {
                                                        kind: "NamedType",
                                                        name: {
                                                          kind: "Name",
                                                          value: "Service",
                                                        },
                                                      },
                                                      selectionSet: {
                                                        kind: "SelectionSet",
                                                        selections: [
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "id",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "name",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value:
                                                                "createdAt",
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                    {
                                                      kind: "InlineFragment",
                                                      typeCondition: {
                                                        kind: "NamedType",
                                                        name: {
                                                          kind: "Name",
                                                          value: "Participant",
                                                        },
                                                      },
                                                      selectionSet: {
                                                        kind: "SelectionSet",
                                                        selections: [
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "id",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value:
                                                                "identifier",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value:
                                                                "createdAt",
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "from",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "to",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "node",
                                                },
                                                selectionSet: {
                                                  kind: "SelectionSet",
                                                  selections: [
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "__typename",
                                                      },
                                                    },
                                                    {
                                                      kind: "InlineFragment",
                                                      typeCondition: {
                                                        kind: "NamedType",
                                                        name: {
                                                          kind: "Name",
                                                          value: "Step",
                                                        },
                                                      },
                                                      selectionSet: {
                                                        kind: "SelectionSet",
                                                        selections: [
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "id",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "duration",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "state",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value:
                                                                "startedAt",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "endedAt",
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "cursor",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "pageInfo" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "hasNextPage" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "hasPreviousPage" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "startCursor" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "endCursor" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<StepsQuery, StepsQueryVariables>;
export const TransitionDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "Transition" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "TransitionInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "transition" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "transition" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "__typename" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "createdAt" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "createdBy" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "InlineFragment",
                              typeCondition: {
                                kind: "NamedType",
                                name: { kind: "Name", value: "User" },
                              },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "username" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "createdAt" },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "InlineFragment",
                              typeCondition: {
                                kind: "NamedType",
                                name: { kind: "Name", value: "Service" },
                              },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "createdAt" },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "InlineFragment",
                              typeCondition: {
                                kind: "NamedType",
                                name: { kind: "Name", value: "Participant" },
                              },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "identifier" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "createdAt" },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      { kind: "Field", name: { kind: "Name", value: "from" } },
                      { kind: "Field", name: { kind: "Name", value: "to" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "node" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "__typename" },
                            },
                            {
                              kind: "InlineFragment",
                              typeCondition: {
                                kind: "NamedType",
                                name: { kind: "Name", value: "Step" },
                              },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "duration" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "state" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "startedAt" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "endedAt" },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TransitionMutation, TransitionMutationVariables>;
export const LoginDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "Login" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "LoginInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "login" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "user" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "__typename" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "createdAt" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "username" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "sessionToken" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;

type Properties<T> = Required<{
  [K in keyof T]: z.ZodType<T[K], any, T[K]>;
}>;

type definedNonNullAny = {};

export const isDefinedNonNullAny = (v: any): v is definedNonNullAny =>
  v !== undefined && v !== null;

export const definedNonNullAnySchema = z
  .any()
  .refine((v) => isDefinedNonNullAny(v));

export function AddGroupInputSchema(): z.ZodObject<Properties<AddGroupInput>> {
  return z.object({
    participantIDs: z.array(z.string()),
  });
}

export function AddParticipantInputSchema(): z.ZodObject<
  Properties<AddParticipantInput>
> {
  return z.object({
    identifier: z.string(),
  });
}

export function AddScopeInputSchema(): z.ZodObject<Properties<AddScopeInput>> {
  return z.object({
    attributes: z.array(z.lazy(() => SetAttributeInputSchema())).nullish(),
    kind: z.string().nullish(),
    name: z.string().nullish(),
  });
}

export function AddStepInputSchema(): z.ZodObject<Properties<AddStepInput>> {
  return z.object({
    duration: z.number(),
  });
}

export const EventTypeSchema = z.nativeEnum(EventType);

export function KvSchema(): z.ZodObject<Properties<Kv>> {
  return z.object({
    key: z.string(),
    val: z.string(),
  });
}

export function LinkInputSchema(): z.ZodObject<Properties<LinkInput>> {
  return z.object({
    link: z.boolean(),
    nodeIDs: z.array(z.string()),
    participantIDs: z.array(z.string()),
  });
}

export function LoginInputSchema(): z.ZodObject<Properties<LoginInput>> {
  return z.object({
    password: z.string(),
    username: z.string(),
  });
}

export function OnAnyEventInputSchema(): z.ZodObject<
  Properties<OnAnyEventInput>
> {
  return z.object({
    nodeID: z.string().nullish(),
  });
}

export function OnEventInputSchema(): z.ZodObject<Properties<OnEventInput>> {
  return z.object({
    eventTypes: z.array(EventTypeSchema),
    nodeID: z.string().nullish(),
  });
}

export const OrderDirectionSchema = z.nativeEnum(OrderDirection);

export function RegisterServiceInputSchema(): z.ZodObject<
  Properties<RegisterServiceInput>
> {
  return z.object({
    name: z.string(),
    token: z.string(),
  });
}

export const RoleSchema = z.nativeEnum(Role);

export function ScopedAttributesInputSchema(): z.ZodObject<
  Properties<ScopedAttributesInput>
> {
  return z.object({
    ids: z.array(z.string()).nullish(),
    keys: z.array(z.string()).nullish(),
    kinds: z.array(z.string()).nullish(),
    kvs: z.array(KvSchema()).nullish(),
    names: z.array(z.string()).nullish(),
  });
}

export function SetAttributeInputSchema(): z.ZodObject<
  Properties<SetAttributeInput>
> {
  return z.object({
    append: z.boolean().nullish(),
    immutable: z.boolean().nullish(),
    index: z.number().nullish(),
    key: z.string(),
    nodeID: z.string().nullish(),
    private: z.boolean().nullish(),
    protected: z.boolean().nullish(),
    val: z.string().nullish(),
    vector: z.boolean().nullish(),
  });
}

export const StateSchema = z.nativeEnum(State);

export function StepOrderSchema(): z.ZodObject<Properties<StepOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: StepOrderFieldSchema.nullish(),
  });
}

export const StepOrderFieldSchema = z.nativeEnum(StepOrderField);

export function TransitionInputSchema(): z.ZodObject<
  Properties<TransitionInput>
> {
  return z.object({
    cause: z.string().nullish(),
    from: StateSchema,
    nodeID: z.string(),
    to: StateSchema,
  });
}
