import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
import {
  FieldPolicy,
  FieldReadFunction,
  TypePolicies,
  TypePolicy,
} from "@apollo/client/cache";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** DateTime is an int64 Date + Time value given in Epoch with ns precision. */
  DateTime: any;
  Cursor: any;
};

export type Actor = User | Service | Participant;

export enum Role {
  /** ADMIN is priviledged access for Users and Services. */
  Admin = "ADMIN",
  /** PARTICIPANT is access tailored for Participants' needs. */
  Participant = "PARTICIPANT",
}

/**
 * Attribute is a single piece of custom data set on a Node. Attributes
 * with the same key can be grouped into an array through the use of a unique
 * index field within that key's scope.
 */
export type Attribute = Node & {
  __typename: "Attribute";
  /** id is the unique globally identifier for the record. */
  id: Scalars["ID"];
  /** createdAt is the time of creation of the record. */
  createdAt: Scalars["DateTime"];
  /** createdBy is the Actor that created the record. */
  createdBy: Actor;
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
   * immutable indicates the Attribute can never be changed by any Actor.
   * immutable must be set on the Attribute at creation.
   */
  immutable: Scalars["Boolean"];
  /**
   * deletedAt is the time when the Attribute was deleted. If null, the Attribute
   * was not deleted.
   */
  deletedAt?: Maybe<Scalars["DateTime"]>;
  /** key identifies the unique key of the Attribute. */
  key: Scalars["String"];
  /**
   * val is the value of the Attribute. If val is not returned, it is considered to
   * be explicitely `null`.
   */
  val?: Maybe<Scalars["String"]>;
  /** index of the Attribute if the value is a vector. */
  index?: Maybe<Scalars["Int"]>;
  /** vector returns true if the value is a vector. */
  vector: Scalars["Boolean"];
  /** version is the version number of this Attribute, starting at 1. */
  version: Scalars["Int"];
  /** versions returns previous versions for the Attribute. */
  versions?: Maybe<AttributeConnection>;
  /** current is true if the Attribute is the current version of the value for key. */
  current: Scalars["Boolean"];
  /** Object associated with Attribute. */
  node: Node;
};

/**
 * Attribute is a single piece of custom data set on a Node. Attributes
 * with the same key can be grouped into an array through the use of a unique
 * index field within that key's scope.
 */
export type AttributeVersionsArgs = {
  after?: Maybe<Scalars["Cursor"]>;
  first?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  last?: Maybe<Scalars["Int"]>;
};

/** SetAttributeInput sets an Attribute on a Node. */
export type SetAttributeInput = {
  /** key identifies the unique key of the Attribute. */
  key: Scalars["String"];
  /**
   * val is the value of the Attribute. It can be any JSON encodable value. If
   * value is not defined, value is assumed to be `null`.
   */
  val?: Maybe<Scalars["String"]>;
  /**
   * index of value if Attribute is a vector. An Attribute cannot mutate between
   * vector and non-vector formats.
   */
  index?: Maybe<Scalars["Int"]>;
  /** vector indicates the Attribute is a vector. */
  vector?: Maybe<Scalars["Boolean"]>;
  /** append allows appending to a vector without specifying the index. */
  append?: Maybe<Scalars["Boolean"]>;
  /**
   * private indicates whether the Attribute shouldn't be visible to Participants
   * in the scope.
   * private must be set on the Attribute at creation.
   * Defaults to false and does need to be sent on subsequent updates.
   */
  private?: Maybe<Scalars["Boolean"]>;
  /**
   * protected indicates the Attribute cannot be modified by other Participants. A
   * Participant can only set protected Records on their Participant record.
   * Users and Services can update protected Attributes.
   * protected must be set on the Attribute at creation.
   * Defaults to false and does need to be sent on subsequent updates.
   */
  protected?: Maybe<Scalars["Boolean"]>;
  /**
   * immutable indicates the Attribute can never be changed by any Actor.
   * immutable must be set on the Attribute at creation.
   * Defaults to false and does need to be sent on subsequent updates.
   */
  immutable?: Maybe<Scalars["Boolean"]>;
  /**
   * ID of object on which to update the value. NodeID is required if attribute is
   * not created with addScope().
   */
  nodeID?: Maybe<Scalars["ID"]>;
};

/** SetAttributePayload is the return payload for the setAttribute mutation. */
export type SetAttributePayload = {
  __typename: "SetAttributePayload";
  /** attribute is the Attribute updated. */
  attribute: Attribute;
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
  scopeID: Scalars["ID"];
  after?: Maybe<Scalars["Cursor"]>;
  first?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  last?: Maybe<Scalars["Int"]>;
};

export type QueryGroupsArgs = {
  after?: Maybe<Scalars["Cursor"]>;
  first?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  last?: Maybe<Scalars["Int"]>;
};

export type QueryParticipantsArgs = {
  after?: Maybe<Scalars["Cursor"]>;
  first?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  last?: Maybe<Scalars["Int"]>;
};

export type QueryScopesArgs = {
  filter?: Maybe<Array<ScopedAttributesInput>>;
  after?: Maybe<Scalars["Cursor"]>;
  first?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  last?: Maybe<Scalars["Int"]>;
};

export type QueryStepsArgs = {
  after?: Maybe<Scalars["Cursor"]>;
  first?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  last?: Maybe<Scalars["Int"]>;
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

export type AttributeEdge = {
  __typename: "AttributeEdge";
  node: Attribute;
  cursor: Scalars["Cursor"];
};

export type AttributeConnection = {
  __typename: "AttributeConnection";
  totalCount: Scalars["Int"];
  pageInfo: PageInfo;
  edges: Array<AttributeEdge>;
};

/** Node is an interface allowing simple querying of any node */
export type Node = {
  /** id is the unique globally identifier for the record. */
  id: Scalars["ID"];
};

export type Subscription = {
  __typename: "Subscription";
  /**
   * changes returns the changes relevant to the Participant, including changes to
   * the Step they are Participating in, Atrributes they have access that are
   * added, updated, or going in and out of scope, etc.
   */
  changes: ChangePayload;
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
  scopedAttributes: ScopedAttributesPayload;
};

export type SubscriptionOnAnyEventArgs = {
  input?: Maybe<OnAnyEventInput>;
};

export type SubscriptionOnEventArgs = {
  input?: Maybe<OnEventInput>;
};

export type SubscriptionScopedAttributesArgs = {
  input: Array<ScopedAttributesInput>;
};

export type ChangePayload = {
  __typename: "ChangePayload";
  /** change is the Change. */
  change: Change;
  /** removed indicates whether the record was removed from scope. */
  removed: Scalars["Boolean"];
  /** done indicates that the state has finished synchorizing. */
  done: Scalars["Boolean"];
};

export type Change =
  | StepChange
  | AttributeChange
  | ParticipantChange
  | ScopeChange;

export type StepChange = {
  __typename: "StepChange";
  /** id is the identifier for the Step. */
  id: Scalars["ID"];
  /** since is the time from which the counter should count. */
  since?: Maybe<Scalars["DateTime"]>;
  /** state is the stage the Step currently is in */
  state: State;
  /**
   * remaining is the duration left in seconds of the Step should last before
   * ending, from `since`.
   */
  remaining?: Maybe<Scalars["Int"]>;
  /** ellapsed indicates the time in seconds ellapsed since the start of the Step. */
  ellapsed?: Maybe<Scalars["Int"]>;
  /** running indicates whether the Step is running. */
  running: Scalars["Boolean"];
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

export type AttributeChange = {
  __typename: "AttributeChange";
  /** id is the identifier for the Attribute. */
  id: Scalars["ID"];
  /** nodeID is the identifier for the Attribute's Node. */
  nodeID: Scalars["ID"];
  /** deleted is true with the attribute was deleted. */
  deleted: Scalars["Boolean"];
  /** isNew is true if the Attribute was just created. */
  isNew: Scalars["Boolean"];
  /** index is the index of the attribute if the value is a vector. */
  index?: Maybe<Scalars["Int"]>;
  /** vector indicates whether the value is a vector. */
  vector: Scalars["Boolean"];
  /** version is the version number of this Attribute, starting at 1. */
  version: Scalars["Int"];
  /** key is the attribute key being updated. */
  key: Scalars["String"];
  /** value is the value of the updated attribute. */
  val?: Maybe<Scalars["String"]>;
};

export type ParticipantChange = {
  __typename: "ParticipantChange";
  /** id is the identifier for the Participant. */
  id: Scalars["ID"];
};

export enum OrderDirection {
  Asc = "ASC",
  Desc = "DESC",
}

export type PageInfo = {
  __typename: "PageInfo";
  hasNextPage: Scalars["Boolean"];
  hasPreviousPage: Scalars["Boolean"];
  startCursor?: Maybe<Scalars["Cursor"]>;
  endCursor?: Maybe<Scalars["Cursor"]>;
};

export type Group = Node & {
  __typename: "Group";
  /** id is the unique globally identifier for the record. */
  id: Scalars["ID"];
  /** createdAt is the time of creation of the record. */
  createdAt: Scalars["DateTime"];
  /** createdBy returns the Actor that created the record. */
  createdBy: Actor;
  /** links returns Participant linking and unlinking with this Node. */
  links?: Maybe<LinkConnection>;
};

export type GroupLinksArgs = {
  after?: Maybe<Scalars["Cursor"]>;
  first?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  last?: Maybe<Scalars["Int"]>;
};

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

export type GroupEdge = {
  __typename: "GroupEdge";
  node: Group;
  cursor: Scalars["Cursor"];
};

export type GroupConnection = {
  __typename: "GroupConnection";
  totalCount: Scalars["Int"];
  pageInfo: PageInfo;
  edges: Array<GroupEdge>;
};

/** EventType holds types of event that can trigger hooks. */
export enum EventType {
  /** A step was added. */
  StepAdd = "STEP_ADD",
  /** A scope was added. */
  ScopeAdd = "SCOPE_ADD",
  /** A group was added. */
  GroupAdd = "GROUP_ADD",
  /** A transition was added. */
  TransitionAdd = "TRANSITION_ADD",
  /** A link was added. */
  LinkAdd = "LINK_ADD",
  /** An attribute was added or updated. */
  AttributeUpdate = "ATTRIBUTE_UPDATE",
  /** A participant was added. */
  ParticipantAdd = "PARTICIPANT_ADD",
  /** A participant connected. */
  ParticipantConnect = "PARTICIPANT_CONNECT",
  /** A participant disconnected. */
  ParticipantDisconnect = "PARTICIPANT_DISCONNECT",
  /**
   * Participant was already connected when this subscription started. This is a
   * special event that allows the listener to catch up on the currently connected
   * players at the beginning of the subscription.
   */
  ParticipantConnected = "PARTICIPANT_CONNECTED",
}

/** OnEventInput is the input for the onEvent subscription. */
export type OnEventInput = {
  /** eventsTypes speficies which events to listen to. */
  eventTypes: Array<EventType>;
  /**
   * nodeID is an optional node ID of the node to listen to. If nodeID is
   * specified, nodeType must also be given.
   */
  nodeID?: Maybe<Scalars["ID"]>;
};

/** OnAnyEventInput is the input for the onAnyEvent subscription. */
export type OnAnyEventInput = {
  /**
   * nodeID is an optional node ID of the node to listen to. If nodeID is
   * specified, nodeType must also be given.
   */
  nodeID?: Maybe<Scalars["ID"]>;
};

/** OnEventPayload is the payload for the on[Any]Event subscriptions. */
export type OnEventPayload = {
  __typename: "OnEventPayload";
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

/** Link records a Participant linking or unlinking with a Node. */
export type Link = Node & {
  __typename: "Link";
  /** id is the unique globally identifier for the record. */
  id: Scalars["ID"];
  /** createdAt is the time of creation of the record. */
  createdAt: Scalars["DateTime"];
  /** createdBy is the Actor that created the record. */
  createdBy: Actor;
  /** link indicates whether the Participant was linked or unlinked with the Node. */
  link: Scalars["Boolean"];
  /** participant that is assigned to  */
  participant: Participant;
  /** node the Participant is assigned to. */
  node: Node;
};

/** LinkInput links or unlinks Participants with a Node. */
export type LinkInput = {
  /** nodeIDs are the IDs of the Nodes that the Participants should be added to. */
  nodeIDs: Array<Scalars["ID"]>;
  /**
   * participantIDs are the IDs of the Participants that should be added to the
   * Nodes.
   */
  participantIDs: Array<Scalars["ID"]>;
  /**
   * link indicates whether the Participant was linked or unlinked with the Node.
   * WARNING: UNLINKING NOT CURRENTLY SUPPORTED, link must be true.
   */
  link: Scalars["Boolean"];
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

export type LinkEdge = {
  __typename: "LinkEdge";
  node: Link;
  cursor: Scalars["Cursor"];
};

export type LinkConnection = {
  __typename: "LinkConnection";
  totalCount: Scalars["Int"];
  pageInfo: PageInfo;
  edges: Array<LinkEdge>;
};

/** Participant is an entity participating in Steps. */
export type Participant = Node & {
  __typename: "Participant";
  /** id is the unique globally identifier for the record. */
  id: Scalars["ID"];
  /** createdAt is the time of creation of the record. */
  createdAt: Scalars["DateTime"];
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
  after?: Maybe<Scalars["Cursor"]>;
  first?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  last?: Maybe<Scalars["Int"]>;
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

export type ParticipantEdge = {
  __typename: "ParticipantEdge";
  node: Participant;
  cursor: Scalars["Cursor"];
};

export type ParticipantConnection = {
  __typename: "ParticipantConnection";
  totalCount: Scalars["Int"];
  pageInfo: PageInfo;
  edges: Array<ParticipantEdge>;
};

export type Scope = Node & {
  __typename: "Scope";
  /** id is the unique globally identifier for the record. */
  id: Scalars["ID"];
  /** createdAt is the time of creation of the record. */
  createdAt: Scalars["DateTime"];
  /** createdBy returns the Actor that created the record. */
  createdBy: Actor;
  /** name is an optional *unique* name. */
  name?: Maybe<Scalars["String"]>;
  /** kind is an optional type name. */
  kind?: Maybe<Scalars["String"]>;
  /** attributes returns all custom data that has been set. */
  attributes: AttributeConnection;
  /**
   * links returns Participant linking and unlinking with this Node. A single
   * Particpant might be linked and unlinked multiple times, and
   * so a Participant might have multiple Links on a Node.
   */
  links?: Maybe<LinkConnection>;
};

export type ScopeAttributesArgs = {
  deleted?: Maybe<Scalars["Boolean"]>;
  after?: Maybe<Scalars["Cursor"]>;
  first?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  last?: Maybe<Scalars["Int"]>;
};

export type ScopeLinksArgs = {
  after?: Maybe<Scalars["Cursor"]>;
  first?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  last?: Maybe<Scalars["Int"]>;
};

/** AddScopeInput creates a new Scope. */
export type AddScopeInput = {
  /**
   * name is the *unique* name of the Scope. If a scope with the same name already
   * exists, it will return an "already exists" error.
   */
  name?: Maybe<Scalars["String"]>;
  /** kind is an optional type name. */
  kind?: Maybe<Scalars["String"]>;
  /** attributes to be attached to the Scope at creation. */
  attributes?: Maybe<Array<SetAttributeInput>>;
};

/** AddScopePayload is the return payload for the addScope mutation. */
export type AddScopePayload = {
  __typename: "AddScopePayload";
  /** scope that the participant is added to. */
  scope: Scope;
};

/**
 * ScopedAttributesInput subscribes to attributes in matching scopes. Either name,
 * keys or kvs exclusively can be provided.
 */
export type ScopedAttributesInput = {
  /** name of the matching Scope. */
  name?: Maybe<Scalars["String"]>;
  /** kind of the matching Scope. */
  kind?: Maybe<Scalars["String"]>;
  /** keys to Attributes in matching Scope. */
  keys?: Maybe<Array<Scalars["String"]>>;
  /** kvs to Attributes in matching Scope. */
  kvs?: Maybe<Array<Kv>>;
};

/** ScopedAttributesPayload is the return payload for the addScope mutation. */
export type ScopedAttributesPayload = {
  __typename: "ScopedAttributesPayload";
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

export type Kv = {
  key: Scalars["String"];
  val: Scalars["String"];
};

export type ScopeEdge = {
  __typename: "ScopeEdge";
  node: Scope;
  cursor: Scalars["Cursor"];
};

export type ScopeConnection = {
  __typename: "ScopeConnection";
  totalCount: Scalars["Int"];
  pageInfo: PageInfo;
  edges: Array<ScopeEdge>;
};

export type Service = {
  __typename: "Service";
  /** id is the unique globally identifier for the record. */
  id: Scalars["ID"];
  /** createdAt is the time of creation of the record. */
  createdAt: Scalars["DateTime"];
  /** name is the name of the service gave itself. */
  name: Scalars["String"];
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

/** State of Step */
export enum State {
  /** CREATED is when the Step has been created but hasn't started yet. */
  Created = "CREATED",
  /** RUNNING is when the Step is currently in progress. */
  Running = "RUNNING",
  /** PAUSED is when the Step has started but its timer was stopped. */
  Paused = "PAUSED",
  /** ENDED is when the Step has finished without issues. */
  Ended = "ENDED",
  /**
   * TERMINATED is when the Step has been manually terminated. This could happen
   * before or during execution.
   */
  Terminated = "TERMINATED",
  /** ERROR is when the Step has failed (due to an unrecoverable error). */
  Failed = "FAILED",
}

/** Step is a span of time. */
export type Step = Node & {
  __typename: "Step";
  /** id is the unique globally identifier for the record. */
  id: Scalars["ID"];
  /** createdAt is the time of creation of the record. */
  createdAt: Scalars["DateTime"];
  /** createdBy returns the Actor that created the record. */
  createdBy: Actor;
  /** duration is the duration in seconds of the Step should last before ending. */
  duration: Scalars["Int"];
  /** state is the stage the Step currently is in */
  state: State;
  /** startedAt is the time at which the Step started. */
  startedAt?: Maybe<Scalars["DateTime"]>;
  /** endedAt is the time at which the Step ended. */
  endedAt?: Maybe<Scalars["DateTime"]>;
  /** transitions lists of States changes of the Step. */
  transitions: TransitionConnection;
  /** links returns Participant linking and unlinking with this Node. */
  links: LinkConnection;
};

/** Step is a span of time. */
export type StepTransitionsArgs = {
  after?: Maybe<Scalars["Cursor"]>;
  first?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  last?: Maybe<Scalars["Int"]>;
};

/** Step is a span of time. */
export type StepLinksArgs = {
  after?: Maybe<Scalars["Cursor"]>;
  first?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  last?: Maybe<Scalars["Int"]>;
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

export type StepEdge = {
  __typename: "StepEdge";
  node: Step;
  cursor: Scalars["Cursor"];
};

export type StepConnection = {
  __typename: "StepConnection";
  totalCount: Scalars["Int"];
  pageInfo: PageInfo;
  edges: Array<StepEdge>;
};

export type StepOrder = {
  direction: OrderDirection;
  field?: Maybe<StepOrderField>;
};

export enum StepOrderField {
  CreatedAt = "CREATED_AT",
  StartedAt = "STARTED_AT",
  Duration = "DURATION",
}

/** A Transition records a State change. */
export type Transition = Node & {
  __typename: "Transition";
  /** id is the unique globally identifier for the record. */
  id: Scalars["ID"];
  /** createdAt is the time of creation of the record. */
  createdAt: Scalars["DateTime"];
  /** createdBy is the Actor that created the record. */
  createdBy: Actor;
  /** from is the State in which the Node was before the State change. */
  from: State;
  /** to is the State in which the Node was after the State change. */
  to: State;
  /** node is the Node that experienced this Transition. */
  node: Node;
};

/** TransitionInput transitions a Node. */
export type TransitionInput = {
  /** nodeID is the ID of the Node to transition. */
  nodeID: Scalars["ID"];
  /**
   * from is the current State of the Node. To avoid concurrency or repeat errors,
   * from is required, and the transition will not happen if the from State does
   * not correspond to the Node's current State.
   */
  from: State;
  /** to is the desired State of the Step. */
  to: State;
  /** cause is an optional open string explaining the reason for the transition. */
  cause?: Maybe<Scalars["String"]>;
};

/** TransitionPayload is the return payload for the transition() mutation. */
export type TransitionPayload = {
  __typename: "TransitionPayload";
  /** transition is the created Transition. */
  transition: Transition;
};

export type TransitionEdge = {
  __typename: "TransitionEdge";
  node: Transition;
  cursor: Scalars["Cursor"];
};

export type TransitionConnection = {
  __typename: "TransitionConnection";
  totalCount: Scalars["Int"];
  pageInfo: PageInfo;
  edges: Array<TransitionEdge>;
};

/** User is a user that has priviledged access to the data. */
export type User = Node & {
  __typename: "User";
  /** id is the unique globally identifier for the record. */
  id: Scalars["ID"];
  /** createdAt is the time of creation of the record. */
  createdAt: Scalars["DateTime"];
  /** username is the login name of the user. */
  username: Scalars["String"];
  /** name is the display name of the user. */
  name: Scalars["String"];
};

/** LoginInput is the input for login() */
export type LoginInput = {
  /** username is the user identifier string. */
  username: Scalars["String"];
  /** password of the user. */
  password: Scalars["String"];
};

/** LoginPayload is returned by login() */
export type LoginPayload = {
  __typename: "LoginPayload";
  /** user is the logged in User. */
  user: User;
  /** sessionToken is the session token to be used for authenticated requets. */
  sessionToken: Scalars["String"];
};

export type AttributesQueryVariables = Exact<{
  scopeID: Scalars["ID"];
  after?: Maybe<Scalars["Cursor"]>;
  first?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  last?: Maybe<Scalars["Int"]>;
}>;

export type AttributesQuery = { __typename: "Query" } & {
  attributes?: Maybe<
    { __typename: "AttributeConnection" } & Pick<
      AttributeConnection,
      "totalCount"
    > & {
        pageInfo: { __typename: "PageInfo" } & Pick<
          PageInfo,
          "hasNextPage" | "hasPreviousPage" | "startCursor" | "endCursor"
        >;
        edges: Array<
          { __typename: "AttributeEdge" } & Pick<AttributeEdge, "cursor"> & {
              node: { __typename: "Attribute" } & Pick<
                Attribute,
                | "id"
                | "createdAt"
                | "private"
                | "protected"
                | "immutable"
                | "deletedAt"
                | "key"
                | "val"
                | "index"
                | "current"
                | "version"
                | "vector"
              > & {
                  createdBy:
                    | ({ __typename: "User" } & Pick<
                        User,
                        "id" | "username" | "name"
                      >)
                    | ({ __typename: "Service" } & Pick<Service, "id" | "name">)
                    | ({ __typename: "Participant" } & Pick<
                        Participant,
                        "id" | "identifier" | "createdAt"
                      >);
                  node:
                    | ({ __typename: "Attribute" } & Pick<Attribute, "id">)
                    | ({ __typename: "Group" } & Pick<Group, "id">)
                    | ({ __typename: "Link" } & Pick<Link, "id">)
                    | ({ __typename: "Participant" } & Pick<Participant, "id">)
                    | ({ __typename: "Scope" } & Pick<Scope, "id">)
                    | ({ __typename: "Step" } & Pick<Step, "id">)
                    | ({ __typename: "Transition" } & Pick<Transition, "id">)
                    | ({ __typename: "User" } & Pick<User, "id">);
                };
            }
        >;
      }
  >;
};

export type SetAttributesMutationVariables = Exact<{
  input: Array<SetAttributeInput> | SetAttributeInput;
}>;

export type SetAttributesMutation = { __typename: "Mutation" } & {
  setAttributes: Array<
    { __typename: "SetAttributePayload" } & {
      attribute: { __typename: "Attribute" } & Pick<
        Attribute,
        | "id"
        | "createdAt"
        | "private"
        | "protected"
        | "immutable"
        | "deletedAt"
        | "key"
        | "val"
        | "index"
        | "current"
        | "version"
        | "vector"
      > & {
          createdBy:
            | ({ __typename: "User" } & Pick<User, "id" | "username" | "name">)
            | ({ __typename: "Service" } & Pick<Service, "id" | "name">)
            | ({ __typename: "Participant" } & Pick<
                Participant,
                "id" | "identifier" | "createdAt"
              >);
          node:
            | ({ __typename: "Attribute" } & Pick<Attribute, "id">)
            | ({ __typename: "Group" } & Pick<Group, "id">)
            | ({ __typename: "Link" } & Pick<Link, "id">)
            | ({ __typename: "Participant" } & Pick<Participant, "id">)
            | ({ __typename: "Scope" } & Pick<Scope, "id">)
            | ({ __typename: "Step" } & Pick<Step, "id">)
            | ({ __typename: "Transition" } & Pick<Transition, "id">)
            | ({ __typename: "User" } & Pick<User, "id">);
        };
    }
  >;
};

export type ChangesSubscriptionVariables = Exact<{ [key: string]: never }>;

export type ChangesSubscription = { __typename: "Subscription" } & {
  changes: { __typename: "ChangePayload" } & Pick<
    ChangePayload,
    "done" | "removed"
  > & {
      change:
        | ({ __typename: "StepChange" } & Pick<
            StepChange,
            "id" | "state" | "since" | "remaining" | "ellapsed" | "running"
          >)
        | ({ __typename: "AttributeChange" } & Pick<
            AttributeChange,
            | "id"
            | "nodeID"
            | "deleted"
            | "isNew"
            | "index"
            | "vector"
            | "version"
            | "key"
            | "val"
          >)
        | ({ __typename: "ParticipantChange" } & Pick<ParticipantChange, "id">)
        | ({ __typename: "ScopeChange" } & Pick<
            ScopeChange,
            "id" | "name" | "kind"
          >);
    };
};

export type AddGroupsMutationVariables = Exact<{
  input: Array<AddGroupInput> | AddGroupInput;
}>;

export type AddGroupsMutation = { __typename: "Mutation" } & {
  addGroups: Array<
    { __typename: "AddGroupPayload" } & {
      group: { __typename: "Group" } & Pick<Group, "id">;
    }
  >;
};

export type GroupsQueryVariables = Exact<{
  after?: Maybe<Scalars["Cursor"]>;
  first?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  last?: Maybe<Scalars["Int"]>;
}>;

export type GroupsQuery = { __typename: "Query" } & {
  groups?: Maybe<
    { __typename: "GroupConnection" } & Pick<GroupConnection, "totalCount"> & {
        edges: Array<
          { __typename: "GroupEdge" } & {
            node: { __typename: "Group" } & Pick<Group, "id" | "createdAt"> & {
                createdBy:
                  | ({ __typename: "User" } & Pick<
                      User,
                      "id" | "username" | "name"
                    >)
                  | ({ __typename: "Service" } & Pick<Service, "id" | "name">)
                  | ({ __typename: "Participant" } & Pick<
                      Participant,
                      "id" | "identifier" | "createdAt"
                    >);
              };
          }
        >;
        pageInfo: { __typename: "PageInfo" } & Pick<
          PageInfo,
          "hasNextPage" | "hasPreviousPage" | "startCursor" | "endCursor"
        >;
      }
  >;
};

export type OnEventSubscriptionVariables = Exact<{
  input?: Maybe<OnEventInput>;
}>;

export type OnEventSubscription = { __typename: "Subscription" } & {
  onEvent?: Maybe<
    { __typename: "OnEventPayload" } & Pick<
      OnEventPayload,
      "eventID" | "eventType"
    > & {
        node:
          | ({ __typename: "Attribute" } & Pick<
              Attribute,
              | "createdAt"
              | "private"
              | "protected"
              | "immutable"
              | "deletedAt"
              | "key"
              | "val"
              | "index"
              | "current"
              | "version"
              | "vector"
              | "id"
            > & {
                createdBy:
                  | ({ __typename: "User" } & Pick<
                      User,
                      "id" | "username" | "name"
                    >)
                  | ({ __typename: "Service" } & Pick<Service, "id" | "name">)
                  | ({ __typename: "Participant" } & Pick<
                      Participant,
                      "id" | "identifier" | "createdAt"
                    >);
                node:
                  | ({ __typename: "Attribute" } & Pick<Attribute, "id">)
                  | ({ __typename: "Group" } & Pick<Group, "id">)
                  | ({ __typename: "Link" } & Pick<Link, "id">)
                  | ({ __typename: "Participant" } & Pick<Participant, "id">)
                  | ({ __typename: "Scope" } & Pick<Scope, "id">)
                  | ({ __typename: "Step" } & Pick<Step, "id">)
                  | ({ __typename: "Transition" } & Pick<Transition, "id">)
                  | ({ __typename: "User" } & Pick<User, "id">);
              })
          | ({ __typename: "Group" } & Pick<Group, "createdAt" | "id"> & {
                createdBy:
                  | ({ __typename: "User" } & Pick<
                      User,
                      "id" | "username" | "name"
                    >)
                  | ({ __typename: "Service" } & Pick<Service, "id" | "name">)
                  | ({ __typename: "Participant" } & Pick<
                      Participant,
                      "id" | "identifier" | "createdAt"
                    >);
              })
          | ({ __typename: "Link" } & Pick<
              Link,
              "createdAt" | "link" | "id"
            > & {
                createdBy:
                  | ({ __typename: "User" } & Pick<
                      User,
                      "id" | "username" | "name"
                    >)
                  | ({ __typename: "Service" } & Pick<Service, "id" | "name">)
                  | ({ __typename: "Participant" } & Pick<
                      Participant,
                      "id" | "identifier" | "createdAt"
                    >);
                participant: { __typename: "Participant" } & Pick<
                  Participant,
                  "id"
                >;
                node:
                  | ({ __typename: "Attribute" } & Pick<Attribute, "id">)
                  | ({ __typename: "Group" } & Pick<Group, "id">)
                  | ({ __typename: "Link" } & Pick<Link, "id">)
                  | ({ __typename: "Participant" } & Pick<Participant, "id">)
                  | ({ __typename: "Scope" } & Pick<Scope, "id">)
                  | ({ __typename: "Step" } & Pick<Step, "id">)
                  | ({ __typename: "Transition" } & Pick<Transition, "id">)
                  | ({ __typename: "User" } & Pick<User, "id">);
              })
          | ({ __typename: "Participant" } & Pick<
              Participant,
              "createdAt" | "identifier" | "id"
            >)
          | ({ __typename: "Scope" } & Pick<
              Scope,
              "name" | "kind" | "createdAt" | "id"
            > & {
                createdBy:
                  | ({ __typename: "User" } & Pick<
                      User,
                      "id" | "username" | "name"
                    >)
                  | ({ __typename: "Service" } & Pick<Service, "id" | "name">)
                  | ({ __typename: "Participant" } & Pick<
                      Participant,
                      "id" | "identifier" | "createdAt"
                    >);
                attributes: { __typename: "AttributeConnection" } & Pick<
                  AttributeConnection,
                  "totalCount"
                > & {
                    pageInfo: { __typename: "PageInfo" } & Pick<
                      PageInfo,
                      | "hasNextPage"
                      | "hasPreviousPage"
                      | "startCursor"
                      | "endCursor"
                    >;
                    edges: Array<
                      { __typename: "AttributeEdge" } & Pick<
                        AttributeEdge,
                        "cursor"
                      > & {
                          node: { __typename: "Attribute" } & Pick<
                            Attribute,
                            | "id"
                            | "createdAt"
                            | "private"
                            | "protected"
                            | "immutable"
                            | "deletedAt"
                            | "key"
                            | "val"
                            | "index"
                            | "current"
                            | "version"
                            | "vector"
                          > & {
                              createdBy:
                                | ({ __typename: "User" } & Pick<
                                    User,
                                    "id" | "username" | "name"
                                  >)
                                | ({ __typename: "Service" } & Pick<
                                    Service,
                                    "id" | "name"
                                  >)
                                | ({ __typename: "Participant" } & Pick<
                                    Participant,
                                    "id" | "identifier" | "createdAt"
                                  >);
                              node:
                                | ({ __typename: "Attribute" } & Pick<
                                    Attribute,
                                    "id"
                                  >)
                                | ({ __typename: "Group" } & Pick<Group, "id">)
                                | ({ __typename: "Link" } & Pick<Link, "id">)
                                | ({ __typename: "Participant" } & Pick<
                                    Participant,
                                    "id"
                                  >)
                                | ({ __typename: "Scope" } & Pick<Scope, "id">)
                                | ({ __typename: "Step" } & Pick<Step, "id">)
                                | ({ __typename: "Transition" } & Pick<
                                    Transition,
                                    "id"
                                  >)
                                | ({ __typename: "User" } & Pick<User, "id">);
                            };
                        }
                    >;
                  };
              })
          | ({ __typename: "Step" } & Pick<
              Step,
              | "createdAt"
              | "duration"
              | "startedAt"
              | "endedAt"
              | "state"
              | "id"
            > & {
                createdBy:
                  | ({ __typename: "User" } & Pick<
                      User,
                      "id" | "username" | "name"
                    >)
                  | ({ __typename: "Service" } & Pick<Service, "id" | "name">)
                  | ({ __typename: "Participant" } & Pick<
                      Participant,
                      "id" | "identifier" | "createdAt"
                    >);
                transitions: { __typename: "TransitionConnection" } & Pick<
                  TransitionConnection,
                  "totalCount"
                > & {
                    pageInfo: { __typename: "PageInfo" } & Pick<
                      PageInfo,
                      | "hasNextPage"
                      | "hasPreviousPage"
                      | "startCursor"
                      | "endCursor"
                    >;
                    edges: Array<
                      { __typename: "TransitionEdge" } & Pick<
                        TransitionEdge,
                        "cursor"
                      > & {
                          node: { __typename: "Transition" } & Pick<
                            Transition,
                            "id" | "createdAt" | "from" | "to"
                          > & {
                              createdBy:
                                | ({ __typename: "User" } & Pick<
                                    User,
                                    "id" | "username" | "name"
                                  >)
                                | ({ __typename: "Service" } & Pick<
                                    Service,
                                    "id" | "name"
                                  >)
                                | ({ __typename: "Participant" } & Pick<
                                    Participant,
                                    "id" | "identifier" | "createdAt"
                                  >);
                              node:
                                | { __typename: "Attribute" }
                                | { __typename: "Group" }
                                | { __typename: "Link" }
                                | { __typename: "Participant" }
                                | { __typename: "Scope" }
                                | ({ __typename: "Step" } & Pick<Step, "id">)
                                | { __typename: "Transition" }
                                | { __typename: "User" };
                            };
                        }
                    >;
                  };
              })
          | ({ __typename: "Transition" } & Pick<
              Transition,
              "createdAt" | "from" | "to" | "id"
            > & {
                createdBy:
                  | ({ __typename: "User" } & Pick<
                      User,
                      "id" | "username" | "name"
                    >)
                  | ({ __typename: "Service" } & Pick<Service, "id" | "name">)
                  | ({ __typename: "Participant" } & Pick<
                      Participant,
                      "id" | "identifier" | "createdAt"
                    >);
                node:
                  | { __typename: "Attribute" }
                  | { __typename: "Group" }
                  | { __typename: "Link" }
                  | { __typename: "Participant" }
                  | { __typename: "Scope" }
                  | ({ __typename: "Step" } & Pick<Step, "id">)
                  | { __typename: "Transition" }
                  | { __typename: "User" };
              })
          | ({ __typename: "User" } & Pick<User, "id">);
      }
  >;
};

export type OnAnyEventSubscriptionVariables = Exact<{
  input?: Maybe<OnAnyEventInput>;
}>;

export type OnAnyEventSubscription = { __typename: "Subscription" } & {
  onAnyEvent?: Maybe<
    { __typename: "OnEventPayload" } & Pick<
      OnEventPayload,
      "eventID" | "eventType"
    > & {
        node:
          | ({ __typename: "Attribute" } & Pick<
              Attribute,
              | "createdAt"
              | "private"
              | "protected"
              | "immutable"
              | "deletedAt"
              | "key"
              | "val"
              | "index"
              | "current"
              | "version"
              | "vector"
              | "id"
            > & {
                createdBy:
                  | ({ __typename: "User" } & Pick<
                      User,
                      "id" | "username" | "name"
                    >)
                  | ({ __typename: "Service" } & Pick<Service, "id" | "name">)
                  | ({ __typename: "Participant" } & Pick<
                      Participant,
                      "id" | "identifier" | "createdAt"
                    >);
                node:
                  | ({ __typename: "Attribute" } & Pick<Attribute, "id">)
                  | ({ __typename: "Group" } & Pick<Group, "id">)
                  | ({ __typename: "Link" } & Pick<Link, "id">)
                  | ({ __typename: "Participant" } & Pick<Participant, "id">)
                  | ({ __typename: "Scope" } & Pick<Scope, "id">)
                  | ({ __typename: "Step" } & Pick<Step, "id">)
                  | ({ __typename: "Transition" } & Pick<Transition, "id">)
                  | ({ __typename: "User" } & Pick<User, "id">);
              })
          | ({ __typename: "Group" } & Pick<Group, "createdAt" | "id"> & {
                createdBy:
                  | ({ __typename: "User" } & Pick<
                      User,
                      "id" | "username" | "name"
                    >)
                  | ({ __typename: "Service" } & Pick<Service, "id" | "name">)
                  | ({ __typename: "Participant" } & Pick<
                      Participant,
                      "id" | "identifier" | "createdAt"
                    >);
              })
          | ({ __typename: "Link" } & Pick<
              Link,
              "createdAt" | "link" | "id"
            > & {
                createdBy:
                  | ({ __typename: "User" } & Pick<
                      User,
                      "id" | "username" | "name"
                    >)
                  | ({ __typename: "Service" } & Pick<Service, "id" | "name">)
                  | ({ __typename: "Participant" } & Pick<
                      Participant,
                      "id" | "identifier" | "createdAt"
                    >);
                participant: { __typename: "Participant" } & Pick<
                  Participant,
                  "id"
                >;
                node:
                  | ({ __typename: "Attribute" } & Pick<Attribute, "id">)
                  | ({ __typename: "Group" } & Pick<Group, "id">)
                  | ({ __typename: "Link" } & Pick<Link, "id">)
                  | ({ __typename: "Participant" } & Pick<Participant, "id">)
                  | ({ __typename: "Scope" } & Pick<Scope, "id">)
                  | ({ __typename: "Step" } & Pick<Step, "id">)
                  | ({ __typename: "Transition" } & Pick<Transition, "id">)
                  | ({ __typename: "User" } & Pick<User, "id">);
              })
          | ({ __typename: "Participant" } & Pick<
              Participant,
              "createdAt" | "identifier" | "id"
            >)
          | ({ __typename: "Scope" } & Pick<
              Scope,
              "name" | "kind" | "createdAt" | "id"
            > & {
                createdBy:
                  | ({ __typename: "User" } & Pick<
                      User,
                      "id" | "username" | "name"
                    >)
                  | ({ __typename: "Service" } & Pick<Service, "id" | "name">)
                  | ({ __typename: "Participant" } & Pick<
                      Participant,
                      "id" | "identifier" | "createdAt"
                    >);
                attributes: { __typename: "AttributeConnection" } & Pick<
                  AttributeConnection,
                  "totalCount"
                > & {
                    pageInfo: { __typename: "PageInfo" } & Pick<
                      PageInfo,
                      | "hasNextPage"
                      | "hasPreviousPage"
                      | "startCursor"
                      | "endCursor"
                    >;
                    edges: Array<
                      { __typename: "AttributeEdge" } & Pick<
                        AttributeEdge,
                        "cursor"
                      > & {
                          node: { __typename: "Attribute" } & Pick<
                            Attribute,
                            | "id"
                            | "createdAt"
                            | "private"
                            | "protected"
                            | "immutable"
                            | "deletedAt"
                            | "key"
                            | "val"
                            | "index"
                            | "current"
                            | "version"
                            | "vector"
                          > & {
                              createdBy:
                                | ({ __typename: "User" } & Pick<
                                    User,
                                    "id" | "username" | "name"
                                  >)
                                | ({ __typename: "Service" } & Pick<
                                    Service,
                                    "id" | "name"
                                  >)
                                | ({ __typename: "Participant" } & Pick<
                                    Participant,
                                    "id" | "identifier" | "createdAt"
                                  >);
                              node:
                                | ({ __typename: "Attribute" } & Pick<
                                    Attribute,
                                    "id"
                                  >)
                                | ({ __typename: "Group" } & Pick<Group, "id">)
                                | ({ __typename: "Link" } & Pick<Link, "id">)
                                | ({ __typename: "Participant" } & Pick<
                                    Participant,
                                    "id"
                                  >)
                                | ({ __typename: "Scope" } & Pick<Scope, "id">)
                                | ({ __typename: "Step" } & Pick<Step, "id">)
                                | ({ __typename: "Transition" } & Pick<
                                    Transition,
                                    "id"
                                  >)
                                | ({ __typename: "User" } & Pick<User, "id">);
                            };
                        }
                    >;
                  };
              })
          | ({ __typename: "Step" } & Pick<
              Step,
              | "createdAt"
              | "duration"
              | "startedAt"
              | "endedAt"
              | "state"
              | "id"
            > & {
                createdBy:
                  | ({ __typename: "User" } & Pick<
                      User,
                      "id" | "username" | "name"
                    >)
                  | ({ __typename: "Service" } & Pick<Service, "id" | "name">)
                  | ({ __typename: "Participant" } & Pick<
                      Participant,
                      "id" | "identifier" | "createdAt"
                    >);
                transitions: { __typename: "TransitionConnection" } & Pick<
                  TransitionConnection,
                  "totalCount"
                > & {
                    pageInfo: { __typename: "PageInfo" } & Pick<
                      PageInfo,
                      | "hasNextPage"
                      | "hasPreviousPage"
                      | "startCursor"
                      | "endCursor"
                    >;
                    edges: Array<
                      { __typename: "TransitionEdge" } & Pick<
                        TransitionEdge,
                        "cursor"
                      > & {
                          node: { __typename: "Transition" } & Pick<
                            Transition,
                            "id" | "createdAt" | "from" | "to"
                          > & {
                              createdBy:
                                | ({ __typename: "User" } & Pick<
                                    User,
                                    "id" | "username" | "name"
                                  >)
                                | ({ __typename: "Service" } & Pick<
                                    Service,
                                    "id" | "name"
                                  >)
                                | ({ __typename: "Participant" } & Pick<
                                    Participant,
                                    "id" | "identifier" | "createdAt"
                                  >);
                              node:
                                | { __typename: "Attribute" }
                                | { __typename: "Group" }
                                | { __typename: "Link" }
                                | { __typename: "Participant" }
                                | { __typename: "Scope" }
                                | ({ __typename: "Step" } & Pick<Step, "id">)
                                | { __typename: "Transition" }
                                | { __typename: "User" };
                            };
                        }
                    >;
                  };
              })
          | ({ __typename: "Transition" } & Pick<
              Transition,
              "createdAt" | "from" | "to" | "id"
            > & {
                createdBy:
                  | ({ __typename: "User" } & Pick<
                      User,
                      "id" | "username" | "name"
                    >)
                  | ({ __typename: "Service" } & Pick<Service, "id" | "name">)
                  | ({ __typename: "Participant" } & Pick<
                      Participant,
                      "id" | "identifier" | "createdAt"
                    >);
                node:
                  | { __typename: "Attribute" }
                  | { __typename: "Group" }
                  | { __typename: "Link" }
                  | { __typename: "Participant" }
                  | { __typename: "Scope" }
                  | ({ __typename: "Step" } & Pick<Step, "id">)
                  | { __typename: "Transition" }
                  | { __typename: "User" };
              })
          | ({ __typename: "User" } & Pick<User, "id">);
      }
  >;
};

export type LinkMutationVariables = Exact<{
  input: LinkInput;
}>;

export type LinkMutation = { __typename: "Mutation" } & {
  link: { __typename: "LinkPayload" } & {
    nodes: Array<
      | ({ __typename: "Attribute" } & Pick<Attribute, "id">)
      | ({ __typename: "Group" } & Pick<Group, "id">)
      | ({ __typename: "Link" } & Pick<Link, "id">)
      | ({ __typename: "Participant" } & Pick<Participant, "id">)
      | ({ __typename: "Scope" } & Pick<Scope, "id">)
      | ({ __typename: "Step" } & Pick<Step, "id">)
      | ({ __typename: "Transition" } & Pick<Transition, "id">)
      | ({ __typename: "User" } & Pick<User, "id">)
    >;
    participants: Array<
      { __typename: "Participant" } & Pick<Participant, "id">
    >;
  };
};

export type ParticipantsQueryVariables = Exact<{
  after?: Maybe<Scalars["Cursor"]>;
  first?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  last?: Maybe<Scalars["Int"]>;
}>;

export type ParticipantsQuery = { __typename: "Query" } & {
  participants?: Maybe<
    { __typename: "ParticipantConnection" } & Pick<
      ParticipantConnection,
      "totalCount"
    > & {
        edges: Array<
          { __typename: "ParticipantEdge" } & {
            node: { __typename: "Participant" } & Pick<
              Participant,
              "id" | "createdAt" | "identifier"
            >;
          }
        >;
        pageInfo: { __typename: "PageInfo" } & Pick<
          PageInfo,
          "hasNextPage" | "hasPreviousPage" | "startCursor" | "endCursor"
        >;
      }
  >;
};

export type AddParticipantMutationVariables = Exact<{
  input: AddParticipantInput;
}>;

export type AddParticipantMutation = { __typename: "Mutation" } & {
  addParticipant: { __typename: "AddParticipantPayload" } & Pick<
    AddParticipantPayload,
    "sessionToken"
  > & {
      participant: { __typename: "Participant" } & Pick<
        Participant,
        "id" | "createdAt" | "identifier"
      >;
    };
};

export type AddScopesMutationVariables = Exact<{
  input: Array<AddScopeInput> | AddScopeInput;
}>;

export type AddScopesMutation = { __typename: "Mutation" } & {
  addScopes: Array<
    { __typename: "AddScopePayload" } & {
      scope: { __typename: "Scope" } & Pick<
        Scope,
        "id" | "name" | "kind" | "createdAt"
      > & {
          createdBy:
            | ({ __typename: "User" } & Pick<User, "id" | "username" | "name">)
            | ({ __typename: "Service" } & Pick<Service, "id" | "name">)
            | ({ __typename: "Participant" } & Pick<
                Participant,
                "id" | "identifier" | "createdAt"
              >);
          attributes: { __typename: "AttributeConnection" } & Pick<
            AttributeConnection,
            "totalCount"
          > & {
              pageInfo: { __typename: "PageInfo" } & Pick<
                PageInfo,
                "hasNextPage" | "hasPreviousPage" | "startCursor" | "endCursor"
              >;
              edges: Array<
                { __typename: "AttributeEdge" } & Pick<
                  AttributeEdge,
                  "cursor"
                > & {
                    node: { __typename: "Attribute" } & Pick<
                      Attribute,
                      | "id"
                      | "createdAt"
                      | "private"
                      | "protected"
                      | "immutable"
                      | "deletedAt"
                      | "key"
                      | "val"
                      | "index"
                      | "current"
                      | "version"
                      | "vector"
                    > & {
                        createdBy:
                          | ({ __typename: "User" } & Pick<
                              User,
                              "id" | "username" | "name"
                            >)
                          | ({ __typename: "Service" } & Pick<
                              Service,
                              "id" | "name"
                            >)
                          | ({ __typename: "Participant" } & Pick<
                              Participant,
                              "id" | "identifier" | "createdAt"
                            >);
                        node:
                          | ({ __typename: "Attribute" } & Pick<
                              Attribute,
                              "id"
                            >)
                          | ({ __typename: "Group" } & Pick<Group, "id">)
                          | ({ __typename: "Link" } & Pick<Link, "id">)
                          | ({ __typename: "Participant" } & Pick<
                              Participant,
                              "id"
                            >)
                          | ({ __typename: "Scope" } & Pick<Scope, "id">)
                          | ({ __typename: "Step" } & Pick<Step, "id">)
                          | ({ __typename: "Transition" } & Pick<
                              Transition,
                              "id"
                            >)
                          | ({ __typename: "User" } & Pick<User, "id">);
                      };
                  }
              >;
            };
        };
    }
  >;
};

export type ScopesQueryVariables = Exact<{
  filter?: Maybe<Array<ScopedAttributesInput> | ScopedAttributesInput>;
  after?: Maybe<Scalars["Cursor"]>;
  first?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  last?: Maybe<Scalars["Int"]>;
}>;

export type ScopesQuery = { __typename: "Query" } & {
  scopes?: Maybe<
    { __typename: "ScopeConnection" } & Pick<ScopeConnection, "totalCount"> & {
        edges: Array<
          { __typename: "ScopeEdge" } & {
            node: { __typename: "Scope" } & Pick<
              Scope,
              "id" | "name" | "kind" | "createdAt"
            > & {
                createdBy:
                  | ({ __typename: "User" } & Pick<
                      User,
                      "id" | "username" | "name"
                    >)
                  | ({ __typename: "Service" } & Pick<Service, "id" | "name">)
                  | ({ __typename: "Participant" } & Pick<
                      Participant,
                      "id" | "identifier" | "createdAt"
                    >);
                attributes: { __typename: "AttributeConnection" } & Pick<
                  AttributeConnection,
                  "totalCount"
                > & {
                    pageInfo: { __typename: "PageInfo" } & Pick<
                      PageInfo,
                      | "hasNextPage"
                      | "hasPreviousPage"
                      | "startCursor"
                      | "endCursor"
                    >;
                    edges: Array<
                      { __typename: "AttributeEdge" } & Pick<
                        AttributeEdge,
                        "cursor"
                      > & {
                          node: { __typename: "Attribute" } & Pick<
                            Attribute,
                            | "id"
                            | "createdAt"
                            | "private"
                            | "protected"
                            | "immutable"
                            | "deletedAt"
                            | "key"
                            | "val"
                            | "index"
                            | "current"
                            | "version"
                            | "vector"
                          > & {
                              createdBy:
                                | ({ __typename: "User" } & Pick<
                                    User,
                                    "id" | "username" | "name"
                                  >)
                                | ({ __typename: "Service" } & Pick<
                                    Service,
                                    "id" | "name"
                                  >)
                                | ({ __typename: "Participant" } & Pick<
                                    Participant,
                                    "id" | "identifier" | "createdAt"
                                  >);
                              node:
                                | ({ __typename: "Attribute" } & Pick<
                                    Attribute,
                                    "id"
                                  >)
                                | ({ __typename: "Group" } & Pick<Group, "id">)
                                | ({ __typename: "Link" } & Pick<Link, "id">)
                                | ({ __typename: "Participant" } & Pick<
                                    Participant,
                                    "id"
                                  >)
                                | ({ __typename: "Scope" } & Pick<Scope, "id">)
                                | ({ __typename: "Step" } & Pick<Step, "id">)
                                | ({ __typename: "Transition" } & Pick<
                                    Transition,
                                    "id"
                                  >)
                                | ({ __typename: "User" } & Pick<User, "id">);
                            };
                        }
                    >;
                  };
              };
          }
        >;
        pageInfo: { __typename: "PageInfo" } & Pick<
          PageInfo,
          "hasNextPage" | "hasPreviousPage" | "startCursor" | "endCursor"
        >;
      }
  >;
};

export type ScopedAttributesSubscriptionVariables = Exact<{
  input: Array<ScopedAttributesInput> | ScopedAttributesInput;
}>;

export type ScopedAttributesSubscription = { __typename: "Subscription" } & {
  scopedAttributes: { __typename: "ScopedAttributesPayload" } & Pick<
    ScopedAttributesPayload,
    "isNew" | "done"
  > & {
      attribute?: Maybe<
        { __typename: "Attribute" } & Pick<
          Attribute,
          | "id"
          | "createdAt"
          | "private"
          | "protected"
          | "immutable"
          | "deletedAt"
          | "key"
          | "val"
          | "index"
          | "current"
          | "version"
          | "vector"
        > & {
            createdBy:
              | ({ __typename: "User" } & Pick<
                  User,
                  "id" | "username" | "name"
                >)
              | ({ __typename: "Service" } & Pick<Service, "id" | "name">)
              | ({ __typename: "Participant" } & Pick<
                  Participant,
                  "id" | "identifier" | "createdAt"
                >);
            node:
              | ({ __typename: "Attribute" } & Pick<Attribute, "id">)
              | ({ __typename: "Group" } & Pick<Group, "id">)
              | ({ __typename: "Link" } & Pick<Link, "id">)
              | ({ __typename: "Participant" } & Pick<Participant, "id">)
              | ({ __typename: "Scope" } & Pick<Scope, "id">)
              | ({ __typename: "Step" } & Pick<Step, "id">)
              | ({ __typename: "Transition" } & Pick<Transition, "id">)
              | ({ __typename: "User" } & Pick<User, "id">);
          }
      >;
    };
};

export type RegisterServiceMutationVariables = Exact<{
  input: RegisterServiceInput;
}>;

export type RegisterServiceMutation = { __typename: "Mutation" } & {
  registerService: { __typename: "RegisterServicePayload" } & Pick<
    RegisterServicePayload,
    "sessionToken"
  > & {
      service: { __typename: "Service" } & Pick<
        Service,
        "id" | "createdAt" | "name"
      >;
    };
};

export type AddStepsMutationVariables = Exact<{
  input: Array<AddStepInput> | AddStepInput;
}>;

export type AddStepsMutation = { __typename: "Mutation" } & {
  addSteps: Array<
    { __typename: "AddStepPayload" } & {
      step: { __typename: "Step" } & Pick<
        Step,
        "id" | "createdAt" | "duration" | "startedAt" | "endedAt" | "state"
      > & {
          createdBy:
            | ({ __typename: "User" } & Pick<User, "id" | "username" | "name">)
            | ({ __typename: "Service" } & Pick<Service, "id" | "name">)
            | ({ __typename: "Participant" } & Pick<
                Participant,
                "id" | "identifier" | "createdAt"
              >);
          transitions: { __typename: "TransitionConnection" } & Pick<
            TransitionConnection,
            "totalCount"
          > & {
              pageInfo: { __typename: "PageInfo" } & Pick<
                PageInfo,
                "hasNextPage" | "hasPreviousPage" | "startCursor" | "endCursor"
              >;
              edges: Array<
                { __typename: "TransitionEdge" } & Pick<
                  TransitionEdge,
                  "cursor"
                > & {
                    node: { __typename: "Transition" } & Pick<
                      Transition,
                      "id" | "createdAt" | "from" | "to"
                    > & {
                        createdBy:
                          | ({ __typename: "User" } & Pick<
                              User,
                              "id" | "username" | "name"
                            >)
                          | ({ __typename: "Service" } & Pick<
                              Service,
                              "id" | "name"
                            >)
                          | ({ __typename: "Participant" } & Pick<
                              Participant,
                              "id" | "identifier" | "createdAt"
                            >);
                        node:
                          | { __typename: "Attribute" }
                          | { __typename: "Group" }
                          | { __typename: "Link" }
                          | { __typename: "Participant" }
                          | { __typename: "Scope" }
                          | ({ __typename: "Step" } & Pick<Step, "id">)
                          | { __typename: "Transition" }
                          | { __typename: "User" };
                      };
                  }
              >;
            };
        };
    }
  >;
};

export type StepsQueryVariables = Exact<{
  after?: Maybe<Scalars["Cursor"]>;
  first?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Cursor"]>;
  last?: Maybe<Scalars["Int"]>;
}>;

export type StepsQuery = { __typename: "Query" } & {
  steps?: Maybe<
    { __typename: "StepConnection" } & Pick<StepConnection, "totalCount"> & {
        edges: Array<
          { __typename: "StepEdge" } & {
            node: { __typename: "Step" } & Pick<
              Step,
              | "id"
              | "createdAt"
              | "duration"
              | "startedAt"
              | "endedAt"
              | "state"
            > & {
                createdBy:
                  | ({ __typename: "User" } & Pick<
                      User,
                      "id" | "username" | "name"
                    >)
                  | ({ __typename: "Service" } & Pick<Service, "id" | "name">)
                  | ({ __typename: "Participant" } & Pick<
                      Participant,
                      "id" | "identifier" | "createdAt"
                    >);
                transitions: { __typename: "TransitionConnection" } & Pick<
                  TransitionConnection,
                  "totalCount"
                > & {
                    pageInfo: { __typename: "PageInfo" } & Pick<
                      PageInfo,
                      | "hasNextPage"
                      | "hasPreviousPage"
                      | "startCursor"
                      | "endCursor"
                    >;
                    edges: Array<
                      { __typename: "TransitionEdge" } & Pick<
                        TransitionEdge,
                        "cursor"
                      > & {
                          node: { __typename: "Transition" } & Pick<
                            Transition,
                            "id" | "createdAt" | "from" | "to"
                          > & {
                              createdBy:
                                | ({ __typename: "User" } & Pick<
                                    User,
                                    "id" | "username" | "name"
                                  >)
                                | ({ __typename: "Service" } & Pick<
                                    Service,
                                    "id" | "name"
                                  >)
                                | ({ __typename: "Participant" } & Pick<
                                    Participant,
                                    "id" | "identifier" | "createdAt"
                                  >);
                              node:
                                | { __typename: "Attribute" }
                                | { __typename: "Group" }
                                | { __typename: "Link" }
                                | { __typename: "Participant" }
                                | { __typename: "Scope" }
                                | ({ __typename: "Step" } & Pick<Step, "id">)
                                | { __typename: "Transition" }
                                | { __typename: "User" };
                            };
                        }
                    >;
                  };
              };
          }
        >;
        pageInfo: { __typename: "PageInfo" } & Pick<
          PageInfo,
          "hasNextPage" | "hasPreviousPage" | "startCursor" | "endCursor"
        >;
      }
  >;
};

export type TransitionMutationVariables = Exact<{
  input: TransitionInput;
}>;

export type TransitionMutation = { __typename: "Mutation" } & {
  transition: { __typename: "TransitionPayload" } & {
    transition: { __typename: "Transition" } & Pick<
      Transition,
      "id" | "createdAt" | "from" | "to"
    > & {
        createdBy:
          | ({ __typename: "User" } & Pick<User, "id" | "username" | "name">)
          | ({ __typename: "Service" } & Pick<Service, "id" | "name">)
          | ({ __typename: "Participant" } & Pick<
              Participant,
              "id" | "identifier" | "createdAt"
            >);
        node:
          | { __typename: "Attribute" }
          | { __typename: "Group" }
          | { __typename: "Link" }
          | { __typename: "Participant" }
          | { __typename: "Scope" }
          | ({ __typename: "Step" } & Pick<Step, "id">)
          | { __typename: "Transition" }
          | { __typename: "User" };
      };
  };
};

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;

export type LoginMutation = { __typename: "Mutation" } & {
  login: { __typename: "LoginPayload" } & Pick<LoginPayload, "sessionToken"> & {
      user: { __typename: "User" } & Pick<
        User,
        "id" | "createdAt" | "username" | "name"
      >;
    };
};

export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[];
  };
}
const result: PossibleTypesResultData = {
  possibleTypes: {
    Actor: ["User", "Service", "Participant"],
    Node: [
      "Attribute",
      "Group",
      "Link",
      "Participant",
      "Scope",
      "Step",
      "Transition",
      "User",
    ],
    Change: [
      "StepChange",
      "AttributeChange",
      "ParticipantChange",
      "ScopeChange",
    ],
  },
};
export default result;

export const AttributesDocument: DocumentNode<
  AttributesQuery,
  AttributesQueryVariables
> = {
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
                                    name: { kind: "Name", value: "id" },
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
};
export const SetAttributesDocument: DocumentNode<
  SetAttributesMutation,
  SetAttributesMutationVariables
> = {
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
};
export const ChangesDocument: DocumentNode<
  ChangesSubscription,
  ChangesSubscriptionVariables
> = {
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
};
export const AddGroupsDocument: DocumentNode<
  AddGroupsMutation,
  AddGroupsMutationVariables
> = {
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
};
export const GroupsDocument: DocumentNode<GroupsQuery, GroupsQueryVariables> = {
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
};
export const OnEventDocument: DocumentNode<
  OnEventSubscription,
  OnEventSubscriptionVariables
> = {
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
                                    name: { kind: "Name", value: "id" },
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
                                                        value: "id",
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
};
export const OnAnyEventDocument: DocumentNode<
  OnAnyEventSubscription,
  OnAnyEventSubscriptionVariables
> = {
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
                                    name: { kind: "Name", value: "id" },
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
                                                        value: "id",
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
};
export const LinkDocument: DocumentNode<LinkMutation, LinkMutationVariables> = {
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
};
export const ParticipantsDocument: DocumentNode<
  ParticipantsQuery,
  ParticipantsQueryVariables
> = {
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
};
export const AddParticipantDocument: DocumentNode<
  AddParticipantMutation,
  AddParticipantMutationVariables
> = {
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
};
export const AddScopesDocument: DocumentNode<
  AddScopesMutation,
  AddScopesMutationVariables
> = {
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
                                                  value: "id",
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
};
export const ScopesDocument: DocumentNode<ScopesQuery, ScopesQueryVariables> = {
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
                                                        value: "id",
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
};
export const ScopedAttributesDocument: DocumentNode<
  ScopedAttributesSubscription,
  ScopedAttributesSubscriptionVariables
> = {
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
                              name: { kind: "Name", value: "id" },
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
};
export const RegisterServiceDocument: DocumentNode<
  RegisterServiceMutation,
  RegisterServiceMutationVariables
> = {
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
};
export const AddStepsDocument: DocumentNode<
  AddStepsMutation,
  AddStepsMutationVariables
> = {
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
};
export const StepsDocument: DocumentNode<StepsQuery, StepsQueryVariables> = {
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
};
export const TransitionDocument: DocumentNode<
  TransitionMutation,
  TransitionMutationVariables
> = {
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
};
export const LoginDocument: DocumentNode<
  LoginMutation,
  LoginMutationVariables
> = {
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
};
export type AttributeKeySpecifier = (
  | "id"
  | "createdAt"
  | "createdBy"
  | "private"
  | "protected"
  | "immutable"
  | "deletedAt"
  | "key"
  | "val"
  | "index"
  | "vector"
  | "version"
  | "versions"
  | "current"
  | "node"
  | AttributeKeySpecifier
)[];
export type AttributeFieldPolicy = {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  createdAt?: FieldPolicy<any> | FieldReadFunction<any>;
  createdBy?: FieldPolicy<any> | FieldReadFunction<any>;
  private?: FieldPolicy<any> | FieldReadFunction<any>;
  protected?: FieldPolicy<any> | FieldReadFunction<any>;
  immutable?: FieldPolicy<any> | FieldReadFunction<any>;
  deletedAt?: FieldPolicy<any> | FieldReadFunction<any>;
  key?: FieldPolicy<any> | FieldReadFunction<any>;
  val?: FieldPolicy<any> | FieldReadFunction<any>;
  index?: FieldPolicy<any> | FieldReadFunction<any>;
  vector?: FieldPolicy<any> | FieldReadFunction<any>;
  version?: FieldPolicy<any> | FieldReadFunction<any>;
  versions?: FieldPolicy<any> | FieldReadFunction<any>;
  current?: FieldPolicy<any> | FieldReadFunction<any>;
  node?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type SetAttributePayloadKeySpecifier = (
  | "attribute"
  | SetAttributePayloadKeySpecifier
)[];
export type SetAttributePayloadFieldPolicy = {
  attribute?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QueryKeySpecifier = (
  | "attributes"
  | "groups"
  | "participants"
  | "scopes"
  | "steps"
  | QueryKeySpecifier
)[];
export type QueryFieldPolicy = {
  attributes?: FieldPolicy<any> | FieldReadFunction<any>;
  groups?: FieldPolicy<any> | FieldReadFunction<any>;
  participants?: FieldPolicy<any> | FieldReadFunction<any>;
  scopes?: FieldPolicy<any> | FieldReadFunction<any>;
  steps?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type MutationKeySpecifier = (
  | "addGroups"
  | "addParticipant"
  | "addScopes"
  | "addSteps"
  | "link"
  | "login"
  | "registerService"
  | "setAttributes"
  | "transition"
  | MutationKeySpecifier
)[];
export type MutationFieldPolicy = {
  addGroups?: FieldPolicy<any> | FieldReadFunction<any>;
  addParticipant?: FieldPolicy<any> | FieldReadFunction<any>;
  addScopes?: FieldPolicy<any> | FieldReadFunction<any>;
  addSteps?: FieldPolicy<any> | FieldReadFunction<any>;
  link?: FieldPolicy<any> | FieldReadFunction<any>;
  login?: FieldPolicy<any> | FieldReadFunction<any>;
  registerService?: FieldPolicy<any> | FieldReadFunction<any>;
  setAttributes?: FieldPolicy<any> | FieldReadFunction<any>;
  transition?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type AttributeEdgeKeySpecifier = (
  | "node"
  | "cursor"
  | AttributeEdgeKeySpecifier
)[];
export type AttributeEdgeFieldPolicy = {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type AttributeConnectionKeySpecifier = (
  | "totalCount"
  | "pageInfo"
  | "edges"
  | AttributeConnectionKeySpecifier
)[];
export type AttributeConnectionFieldPolicy = {
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type NodeKeySpecifier = ("id" | NodeKeySpecifier)[];
export type NodeFieldPolicy = {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type SubscriptionKeySpecifier = (
  | "changes"
  | "onAnyEvent"
  | "onEvent"
  | "scopedAttributes"
  | SubscriptionKeySpecifier
)[];
export type SubscriptionFieldPolicy = {
  changes?: FieldPolicy<any> | FieldReadFunction<any>;
  onAnyEvent?: FieldPolicy<any> | FieldReadFunction<any>;
  onEvent?: FieldPolicy<any> | FieldReadFunction<any>;
  scopedAttributes?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ChangePayloadKeySpecifier = (
  | "change"
  | "removed"
  | "done"
  | ChangePayloadKeySpecifier
)[];
export type ChangePayloadFieldPolicy = {
  change?: FieldPolicy<any> | FieldReadFunction<any>;
  removed?: FieldPolicy<any> | FieldReadFunction<any>;
  done?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type StepChangeKeySpecifier = (
  | "id"
  | "since"
  | "state"
  | "remaining"
  | "ellapsed"
  | "running"
  | StepChangeKeySpecifier
)[];
export type StepChangeFieldPolicy = {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  since?: FieldPolicy<any> | FieldReadFunction<any>;
  state?: FieldPolicy<any> | FieldReadFunction<any>;
  remaining?: FieldPolicy<any> | FieldReadFunction<any>;
  ellapsed?: FieldPolicy<any> | FieldReadFunction<any>;
  running?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ScopeChangeKeySpecifier = (
  | "id"
  | "kind"
  | "name"
  | ScopeChangeKeySpecifier
)[];
export type ScopeChangeFieldPolicy = {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  kind?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type AttributeChangeKeySpecifier = (
  | "id"
  | "nodeID"
  | "deleted"
  | "isNew"
  | "index"
  | "vector"
  | "version"
  | "key"
  | "val"
  | AttributeChangeKeySpecifier
)[];
export type AttributeChangeFieldPolicy = {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  nodeID?: FieldPolicy<any> | FieldReadFunction<any>;
  deleted?: FieldPolicy<any> | FieldReadFunction<any>;
  isNew?: FieldPolicy<any> | FieldReadFunction<any>;
  index?: FieldPolicy<any> | FieldReadFunction<any>;
  vector?: FieldPolicy<any> | FieldReadFunction<any>;
  version?: FieldPolicy<any> | FieldReadFunction<any>;
  key?: FieldPolicy<any> | FieldReadFunction<any>;
  val?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ParticipantChangeKeySpecifier = (
  | "id"
  | ParticipantChangeKeySpecifier
)[];
export type ParticipantChangeFieldPolicy = {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PageInfoKeySpecifier = (
  | "hasNextPage"
  | "hasPreviousPage"
  | "startCursor"
  | "endCursor"
  | PageInfoKeySpecifier
)[];
export type PageInfoFieldPolicy = {
  hasNextPage?: FieldPolicy<any> | FieldReadFunction<any>;
  hasPreviousPage?: FieldPolicy<any> | FieldReadFunction<any>;
  startCursor?: FieldPolicy<any> | FieldReadFunction<any>;
  endCursor?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type GroupKeySpecifier = (
  | "id"
  | "createdAt"
  | "createdBy"
  | "links"
  | GroupKeySpecifier
)[];
export type GroupFieldPolicy = {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  createdAt?: FieldPolicy<any> | FieldReadFunction<any>;
  createdBy?: FieldPolicy<any> | FieldReadFunction<any>;
  links?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type AddGroupPayloadKeySpecifier = (
  | "group"
  | AddGroupPayloadKeySpecifier
)[];
export type AddGroupPayloadFieldPolicy = {
  group?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type GroupEdgeKeySpecifier = (
  | "node"
  | "cursor"
  | GroupEdgeKeySpecifier
)[];
export type GroupEdgeFieldPolicy = {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type GroupConnectionKeySpecifier = (
  | "totalCount"
  | "pageInfo"
  | "edges"
  | GroupConnectionKeySpecifier
)[];
export type GroupConnectionFieldPolicy = {
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type OnEventPayloadKeySpecifier = (
  | "eventID"
  | "eventType"
  | "node"
  | OnEventPayloadKeySpecifier
)[];
export type OnEventPayloadFieldPolicy = {
  eventID?: FieldPolicy<any> | FieldReadFunction<any>;
  eventType?: FieldPolicy<any> | FieldReadFunction<any>;
  node?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type LinkKeySpecifier = (
  | "id"
  | "createdAt"
  | "createdBy"
  | "link"
  | "participant"
  | "node"
  | LinkKeySpecifier
)[];
export type LinkFieldPolicy = {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  createdAt?: FieldPolicy<any> | FieldReadFunction<any>;
  createdBy?: FieldPolicy<any> | FieldReadFunction<any>;
  link?: FieldPolicy<any> | FieldReadFunction<any>;
  participant?: FieldPolicy<any> | FieldReadFunction<any>;
  node?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type LinkPayloadKeySpecifier = (
  | "nodes"
  | "participants"
  | LinkPayloadKeySpecifier
)[];
export type LinkPayloadFieldPolicy = {
  nodes?: FieldPolicy<any> | FieldReadFunction<any>;
  participants?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type LinkEdgeKeySpecifier = ("node" | "cursor" | LinkEdgeKeySpecifier)[];
export type LinkEdgeFieldPolicy = {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type LinkConnectionKeySpecifier = (
  | "totalCount"
  | "pageInfo"
  | "edges"
  | LinkConnectionKeySpecifier
)[];
export type LinkConnectionFieldPolicy = {
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ParticipantKeySpecifier = (
  | "id"
  | "createdAt"
  | "identifier"
  | "links"
  | ParticipantKeySpecifier
)[];
export type ParticipantFieldPolicy = {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  createdAt?: FieldPolicy<any> | FieldReadFunction<any>;
  identifier?: FieldPolicy<any> | FieldReadFunction<any>;
  links?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type AddParticipantPayloadKeySpecifier = (
  | "participant"
  | "sessionToken"
  | AddParticipantPayloadKeySpecifier
)[];
export type AddParticipantPayloadFieldPolicy = {
  participant?: FieldPolicy<any> | FieldReadFunction<any>;
  sessionToken?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ParticipantEdgeKeySpecifier = (
  | "node"
  | "cursor"
  | ParticipantEdgeKeySpecifier
)[];
export type ParticipantEdgeFieldPolicy = {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ParticipantConnectionKeySpecifier = (
  | "totalCount"
  | "pageInfo"
  | "edges"
  | ParticipantConnectionKeySpecifier
)[];
export type ParticipantConnectionFieldPolicy = {
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ScopeKeySpecifier = (
  | "id"
  | "createdAt"
  | "createdBy"
  | "name"
  | "kind"
  | "attributes"
  | "links"
  | ScopeKeySpecifier
)[];
export type ScopeFieldPolicy = {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  createdAt?: FieldPolicy<any> | FieldReadFunction<any>;
  createdBy?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  kind?: FieldPolicy<any> | FieldReadFunction<any>;
  attributes?: FieldPolicy<any> | FieldReadFunction<any>;
  links?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type AddScopePayloadKeySpecifier = (
  | "scope"
  | AddScopePayloadKeySpecifier
)[];
export type AddScopePayloadFieldPolicy = {
  scope?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ScopedAttributesPayloadKeySpecifier = (
  | "attribute"
  | "done"
  | "isNew"
  | ScopedAttributesPayloadKeySpecifier
)[];
export type ScopedAttributesPayloadFieldPolicy = {
  attribute?: FieldPolicy<any> | FieldReadFunction<any>;
  done?: FieldPolicy<any> | FieldReadFunction<any>;
  isNew?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ScopeEdgeKeySpecifier = (
  | "node"
  | "cursor"
  | ScopeEdgeKeySpecifier
)[];
export type ScopeEdgeFieldPolicy = {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ScopeConnectionKeySpecifier = (
  | "totalCount"
  | "pageInfo"
  | "edges"
  | ScopeConnectionKeySpecifier
)[];
export type ScopeConnectionFieldPolicy = {
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ServiceKeySpecifier = (
  | "id"
  | "createdAt"
  | "name"
  | ServiceKeySpecifier
)[];
export type ServiceFieldPolicy = {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  createdAt?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type RegisterServicePayloadKeySpecifier = (
  | "service"
  | "sessionToken"
  | RegisterServicePayloadKeySpecifier
)[];
export type RegisterServicePayloadFieldPolicy = {
  service?: FieldPolicy<any> | FieldReadFunction<any>;
  sessionToken?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type StepKeySpecifier = (
  | "id"
  | "createdAt"
  | "createdBy"
  | "duration"
  | "state"
  | "startedAt"
  | "endedAt"
  | "transitions"
  | "links"
  | StepKeySpecifier
)[];
export type StepFieldPolicy = {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  createdAt?: FieldPolicy<any> | FieldReadFunction<any>;
  createdBy?: FieldPolicy<any> | FieldReadFunction<any>;
  duration?: FieldPolicy<any> | FieldReadFunction<any>;
  state?: FieldPolicy<any> | FieldReadFunction<any>;
  startedAt?: FieldPolicy<any> | FieldReadFunction<any>;
  endedAt?: FieldPolicy<any> | FieldReadFunction<any>;
  transitions?: FieldPolicy<any> | FieldReadFunction<any>;
  links?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type AddStepPayloadKeySpecifier = (
  | "step"
  | AddStepPayloadKeySpecifier
)[];
export type AddStepPayloadFieldPolicy = {
  step?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type StepEdgeKeySpecifier = ("node" | "cursor" | StepEdgeKeySpecifier)[];
export type StepEdgeFieldPolicy = {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type StepConnectionKeySpecifier = (
  | "totalCount"
  | "pageInfo"
  | "edges"
  | StepConnectionKeySpecifier
)[];
export type StepConnectionFieldPolicy = {
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type TransitionKeySpecifier = (
  | "id"
  | "createdAt"
  | "createdBy"
  | "from"
  | "to"
  | "node"
  | TransitionKeySpecifier
)[];
export type TransitionFieldPolicy = {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  createdAt?: FieldPolicy<any> | FieldReadFunction<any>;
  createdBy?: FieldPolicy<any> | FieldReadFunction<any>;
  from?: FieldPolicy<any> | FieldReadFunction<any>;
  to?: FieldPolicy<any> | FieldReadFunction<any>;
  node?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type TransitionPayloadKeySpecifier = (
  | "transition"
  | TransitionPayloadKeySpecifier
)[];
export type TransitionPayloadFieldPolicy = {
  transition?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type TransitionEdgeKeySpecifier = (
  | "node"
  | "cursor"
  | TransitionEdgeKeySpecifier
)[];
export type TransitionEdgeFieldPolicy = {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type TransitionConnectionKeySpecifier = (
  | "totalCount"
  | "pageInfo"
  | "edges"
  | TransitionConnectionKeySpecifier
)[];
export type TransitionConnectionFieldPolicy = {
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type UserKeySpecifier = (
  | "id"
  | "createdAt"
  | "username"
  | "name"
  | UserKeySpecifier
)[];
export type UserFieldPolicy = {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  createdAt?: FieldPolicy<any> | FieldReadFunction<any>;
  username?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type LoginPayloadKeySpecifier = (
  | "user"
  | "sessionToken"
  | LoginPayloadKeySpecifier
)[];
export type LoginPayloadFieldPolicy = {
  user?: FieldPolicy<any> | FieldReadFunction<any>;
  sessionToken?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type TypedTypePolicies = TypePolicies & {
  Attribute?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AttributeKeySpecifier
      | (() => undefined | AttributeKeySpecifier);
    fields?: AttributeFieldPolicy;
  };
  SetAttributePayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | SetAttributePayloadKeySpecifier
      | (() => undefined | SetAttributePayloadKeySpecifier);
    fields?: SetAttributePayloadFieldPolicy;
  };
  Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | QueryKeySpecifier
      | (() => undefined | QueryKeySpecifier);
    fields?: QueryFieldPolicy;
  };
  Mutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | MutationKeySpecifier
      | (() => undefined | MutationKeySpecifier);
    fields?: MutationFieldPolicy;
  };
  AttributeEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AttributeEdgeKeySpecifier
      | (() => undefined | AttributeEdgeKeySpecifier);
    fields?: AttributeEdgeFieldPolicy;
  };
  AttributeConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AttributeConnectionKeySpecifier
      | (() => undefined | AttributeConnectionKeySpecifier);
    fields?: AttributeConnectionFieldPolicy;
  };
  Node?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | NodeKeySpecifier | (() => undefined | NodeKeySpecifier);
    fields?: NodeFieldPolicy;
  };
  Subscription?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | SubscriptionKeySpecifier
      | (() => undefined | SubscriptionKeySpecifier);
    fields?: SubscriptionFieldPolicy;
  };
  ChangePayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ChangePayloadKeySpecifier
      | (() => undefined | ChangePayloadKeySpecifier);
    fields?: ChangePayloadFieldPolicy;
  };
  StepChange?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | StepChangeKeySpecifier
      | (() => undefined | StepChangeKeySpecifier);
    fields?: StepChangeFieldPolicy;
  };
  ScopeChange?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ScopeChangeKeySpecifier
      | (() => undefined | ScopeChangeKeySpecifier);
    fields?: ScopeChangeFieldPolicy;
  };
  AttributeChange?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AttributeChangeKeySpecifier
      | (() => undefined | AttributeChangeKeySpecifier);
    fields?: AttributeChangeFieldPolicy;
  };
  ParticipantChange?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ParticipantChangeKeySpecifier
      | (() => undefined | ParticipantChangeKeySpecifier);
    fields?: ParticipantChangeFieldPolicy;
  };
  PageInfo?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PageInfoKeySpecifier
      | (() => undefined | PageInfoKeySpecifier);
    fields?: PageInfoFieldPolicy;
  };
  Group?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GroupKeySpecifier
      | (() => undefined | GroupKeySpecifier);
    fields?: GroupFieldPolicy;
  };
  AddGroupPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AddGroupPayloadKeySpecifier
      | (() => undefined | AddGroupPayloadKeySpecifier);
    fields?: AddGroupPayloadFieldPolicy;
  };
  GroupEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GroupEdgeKeySpecifier
      | (() => undefined | GroupEdgeKeySpecifier);
    fields?: GroupEdgeFieldPolicy;
  };
  GroupConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GroupConnectionKeySpecifier
      | (() => undefined | GroupConnectionKeySpecifier);
    fields?: GroupConnectionFieldPolicy;
  };
  OnEventPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OnEventPayloadKeySpecifier
      | (() => undefined | OnEventPayloadKeySpecifier);
    fields?: OnEventPayloadFieldPolicy;
  };
  Link?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | LinkKeySpecifier | (() => undefined | LinkKeySpecifier);
    fields?: LinkFieldPolicy;
  };
  LinkPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | LinkPayloadKeySpecifier
      | (() => undefined | LinkPayloadKeySpecifier);
    fields?: LinkPayloadFieldPolicy;
  };
  LinkEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | LinkEdgeKeySpecifier
      | (() => undefined | LinkEdgeKeySpecifier);
    fields?: LinkEdgeFieldPolicy;
  };
  LinkConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | LinkConnectionKeySpecifier
      | (() => undefined | LinkConnectionKeySpecifier);
    fields?: LinkConnectionFieldPolicy;
  };
  Participant?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ParticipantKeySpecifier
      | (() => undefined | ParticipantKeySpecifier);
    fields?: ParticipantFieldPolicy;
  };
  AddParticipantPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AddParticipantPayloadKeySpecifier
      | (() => undefined | AddParticipantPayloadKeySpecifier);
    fields?: AddParticipantPayloadFieldPolicy;
  };
  ParticipantEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ParticipantEdgeKeySpecifier
      | (() => undefined | ParticipantEdgeKeySpecifier);
    fields?: ParticipantEdgeFieldPolicy;
  };
  ParticipantConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ParticipantConnectionKeySpecifier
      | (() => undefined | ParticipantConnectionKeySpecifier);
    fields?: ParticipantConnectionFieldPolicy;
  };
  Scope?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ScopeKeySpecifier
      | (() => undefined | ScopeKeySpecifier);
    fields?: ScopeFieldPolicy;
  };
  AddScopePayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AddScopePayloadKeySpecifier
      | (() => undefined | AddScopePayloadKeySpecifier);
    fields?: AddScopePayloadFieldPolicy;
  };
  ScopedAttributesPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ScopedAttributesPayloadKeySpecifier
      | (() => undefined | ScopedAttributesPayloadKeySpecifier);
    fields?: ScopedAttributesPayloadFieldPolicy;
  };
  ScopeEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ScopeEdgeKeySpecifier
      | (() => undefined | ScopeEdgeKeySpecifier);
    fields?: ScopeEdgeFieldPolicy;
  };
  ScopeConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ScopeConnectionKeySpecifier
      | (() => undefined | ScopeConnectionKeySpecifier);
    fields?: ScopeConnectionFieldPolicy;
  };
  Service?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ServiceKeySpecifier
      | (() => undefined | ServiceKeySpecifier);
    fields?: ServiceFieldPolicy;
  };
  RegisterServicePayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | RegisterServicePayloadKeySpecifier
      | (() => undefined | RegisterServicePayloadKeySpecifier);
    fields?: RegisterServicePayloadFieldPolicy;
  };
  Step?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | StepKeySpecifier | (() => undefined | StepKeySpecifier);
    fields?: StepFieldPolicy;
  };
  AddStepPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AddStepPayloadKeySpecifier
      | (() => undefined | AddStepPayloadKeySpecifier);
    fields?: AddStepPayloadFieldPolicy;
  };
  StepEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | StepEdgeKeySpecifier
      | (() => undefined | StepEdgeKeySpecifier);
    fields?: StepEdgeFieldPolicy;
  };
  StepConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | StepConnectionKeySpecifier
      | (() => undefined | StepConnectionKeySpecifier);
    fields?: StepConnectionFieldPolicy;
  };
  Transition?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | TransitionKeySpecifier
      | (() => undefined | TransitionKeySpecifier);
    fields?: TransitionFieldPolicy;
  };
  TransitionPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | TransitionPayloadKeySpecifier
      | (() => undefined | TransitionPayloadKeySpecifier);
    fields?: TransitionPayloadFieldPolicy;
  };
  TransitionEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | TransitionEdgeKeySpecifier
      | (() => undefined | TransitionEdgeKeySpecifier);
    fields?: TransitionEdgeFieldPolicy;
  };
  TransitionConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | TransitionConnectionKeySpecifier
      | (() => undefined | TransitionConnectionKeySpecifier);
    fields?: TransitionConnectionFieldPolicy;
  };
  User?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | UserKeySpecifier | (() => undefined | UserKeySpecifier);
    fields?: UserFieldPolicy;
  };
  LoginPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | LoginPayloadKeySpecifier
      | (() => undefined | LoginPayloadKeySpecifier);
    fields?: LoginPayloadFieldPolicy;
  };
};
