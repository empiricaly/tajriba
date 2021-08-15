package runtime

import (
	"context"
	"encoding/json"

	"github.com/empiricaly/tajriba/internal/auth/actor"
	"github.com/empiricaly/tajriba/internal/models"
	"github.com/empiricaly/tajriba/internal/store"
	"github.com/empiricaly/tajriba/internal/utils/ids"
	"github.com/pkg/errors"
	"github.com/tidwall/gjson"
)

type objectMap struct {
	values map[string]interface{}

	scopesMap       map[string]*models.Scope
	stepsMap        map[string]*models.Step
	attributesMap   map[string]*models.Attribute
	participantsMap map[string]*models.Participant
	usersMap        map[string]*models.User
	linksMap        map[string]*models.Link
	transitionsMap  map[string]*models.Transition
	servicesMap     map[string]*models.Service
	sessionsMap     map[string]*models.Session
	groupsMap       map[string]*models.Group

	scopes       []*models.Scope
	steps        []*models.Step
	attributes   []*models.Attribute
	participants []*models.Participant
	users        []*models.User
	links        []*models.Link
	transitions  []*models.Transition
	services     []*models.Service
	sessions     []*models.Session
	groups       []*models.Group

	attrVersions    map[string][]*models.Attribute
	attrLastVersion map[string]*models.Attribute
}

func newObjectMap() *objectMap {
	return &objectMap{
		values:          make(map[string]interface{}),
		scopesMap:       make(map[string]*models.Scope),
		stepsMap:        make(map[string]*models.Step),
		attributesMap:   make(map[string]*models.Attribute),
		participantsMap: make(map[string]*models.Participant),
		usersMap:        make(map[string]*models.User),
		linksMap:        make(map[string]*models.Link),
		transitionsMap:  make(map[string]*models.Transition),
		servicesMap:     make(map[string]*models.Service),
		sessionsMap:     make(map[string]*models.Session),
		groupsMap:       make(map[string]*models.Group),
		scopes:          make([]*models.Scope, 0),
		steps:           make([]*models.Step, 0),
		attributes:      make([]*models.Attribute, 0),
		participants:    make([]*models.Participant, 0),
		users:           make([]*models.User, 0),
		links:           make([]*models.Link, 0),
		transitions:     make([]*models.Transition, 0),
		services:        make([]*models.Service, 0),
		sessions:        make([]*models.Session, 0),
		groups:          make([]*models.Group, 0),
		attrVersions:    make(map[string][]*models.Attribute),
		attrLastVersion: make(map[string]*models.Attribute),
	}
}

const quotedIDLen = 18

func (o *objectMap) load(ctx context.Context) error {
	conn := store.ForContext(ctx)

	lists := make(map[ids.IDType][]interface{})

	err := conn.Load(func(b []byte) error {
		result := gjson.GetBytes(b, "id")
		var raw []byte
		if result.Index > 0 {
			raw = b[result.Index : result.Index+len(result.Raw)]
		} else {
			raw = []byte(result.Raw)
		}

		if len(raw) != quotedIDLen {
			return errors.New("invalid id")
		}

		raw = raw[1:17]

		t, err := ids.TypeB(ctx, raw)
		if err != nil {
			return errors.Wrap(err, "parse id")
		}

		v, err := o.newObj(t)
		if err != nil {
			return errors.Wrap(err, "init new object")
		}

		err = json.Unmarshal(b, v)
		if err != nil {
			return errors.Wrap(err, "unmarshall json")
		}

		lists[t] = append(lists[t], v)
		o.values[string(raw)] = v

		err = o.addObj(v, string(raw))
		if err != nil {
			return errors.Wrap(err, "add obj")
		}

		return nil
	})
	if err != nil {
		return errors.Wrap(err, "load db")
	}

	if err := o.associate(); err != nil {
		return errors.Wrap(err, "associate")
	}

	// spew.Dump(o)

	return nil
}

func (o *objectMap) newObj(t ids.IDType) (interface{}, error) {
	switch t {
	case ids.Scope:
		return new(models.Scope), nil
	case ids.Step:
		return new(models.Step), nil
	case ids.Attribute:
		return new(models.Attribute), nil
	case ids.Participant:
		return new(models.Participant), nil
	case ids.User:
		return new(models.User), nil
	case ids.Link:
		return new(models.Link), nil
	case ids.Transition:
		return new(models.Transition), nil
	case ids.Service:
		return new(models.Service), nil
	case ids.Session:
		return new(models.Session), nil
	default:
		return nil, errors.New("unknown id meta")
	}
}

func (o *objectMap) addObj(v interface{}, id string) error {
	switch vv := v.(type) {
	case *models.Scope:
		o.scopes = append(o.scopes, vv)
		o.scopesMap[vv.ID] = vv
	case *models.Step:
		o.steps = append(o.steps, vv)
		o.stepsMap[id] = vv
	case *models.Attribute:
		o.attributes = append(o.attributes, vv)
		o.attributesMap[id] = vv
	case *models.Participant:
		o.participants = append(o.participants, vv)
		o.participantsMap[id] = vv
	case *models.User:
		o.users = append(o.users, vv)
		o.usersMap[vv.Username] = vv
	case *models.Link:
		o.links = append(o.links, vv)
		o.linksMap[id] = vv
	case *models.Transition:
		o.transitions = append(o.transitions, vv)
		o.transitionsMap[id] = vv
	case *models.Service:
		o.services = append(o.services, vv)
		o.servicesMap[id] = vv
	case *models.Session:
		o.sessions = append(o.sessions, vv)
		o.sessionsMap[vv.Token] = vv
	case *models.Group:
		o.groups = append(o.groups, vv)
		o.groupsMap[id] = vv
	default:
		return errors.New("unknown id meta")
	}

	o.values[id] = v

	return nil
}

func (o *objectMap) associate() error {
	// * Note: Must associate Attributes first (to find current versions)
	if err := o.associateAttributes(); err != nil {
		return errors.Wrap(err, "associate attributes")
	}

	if err := o.associateLinks(); err != nil {
		return errors.Wrap(err, "associate links")
	}

	if err := o.associateParticipants(); err != nil {
		return errors.Wrap(err, "associate participants")
	}

	if err := o.associateScopes(); err != nil {
		return errors.Wrap(err, "associate scopes")
	}

	if err := o.associateSteps(); err != nil {
		return errors.Wrap(err, "associate steps")
	}

	if err := o.associateSessions(); err != nil {
		return errors.Wrap(err, "associate sessions")
	}

	if err := o.associateGroups(); err != nil {
		return errors.Wrap(err, "associate groups")
	}

	return nil
}

func (o *objectMap) associateAttributes() error {
	for _, a := range o.attributes {
		if err := o.associateAttribute(a); err != nil {
			return errors.Wrap(err, "associate attribute")
		}
	}

	return nil
}

func (o *objectMap) associateAttribute(a *models.Attribute) (err error) {
	// CreatedBy
	a.CreatedBy, err = o.findActor(a.ID, a.CreatedByID)
	if err != nil {
		return errors.Wrap(err, "createdBy for attribute")
	}

	// Node
	a.Node, err = o.findNode(a.ID, a.NodeID)
	if err != nil {
		return errors.Wrap(err, "node for attribute")
	}

	// Versions
	key := a.NodeID + a.Key
	if prev, ok := o.attrLastVersion[key]; ok {
		o.attrVersions[key] = append(o.attrVersions[key], prev)
		prev.Current = false
	}

	o.attrLastVersion[key] = a
	a.Versions = o.attrVersions[key]
	a.Current = true

	return nil
}

func (o *objectMap) associateLinks() error {
	for _, l := range o.links {
		if err := o.associateLink(l); err != nil {
			return errors.Wrap(err, "associate link")
		}
	}

	return nil
}

func (o *objectMap) associateLink(l *models.Link) (err error) {
	// CreatedBy
	l.CreatedBy, err = o.findActor(l.ID, l.CreatedByID)
	if err != nil {
		return errors.Wrap(err, "createdBy for link")
	}

	// Node
	l.Node, err = o.findNode(l.ID, l.NodeID)
	if err != nil {
		return errors.Wrap(err, "node for link")
	}

	// Participant
	l.Participant, err = o.findParticipant(l.ID, l.ParticipantID)
	if err != nil {
		return errors.Wrap(err, "participant for link")
	}

	return nil
}

func (o *objectMap) associateParticipants() error {
	for _, p := range o.participants {
		o.associateParticipant(p)
	}

	return nil
}

func (o *objectMap) associateParticipant(p *models.Participant) {
	// Links
	p.Links = o.findLinks(p.ID)
}

func (o *objectMap) associateScopes() error {
	for _, s := range o.scopes {
		if err := o.associateScope(s); err != nil {
			return errors.Wrap(err, "associate scope")
		}
	}

	return nil
}

func (o *objectMap) associateScope(s *models.Scope) (err error) {
	// CreatedBy
	s.CreatedBy, err = o.findActor(s.ID, s.CreatedByID)
	if err != nil {
		return errors.Wrap(err, "createdBy for scope")
	}

	// Attributes
	s.Attributes, s.AttributesMap = o.findAttributes(s.ID)

	// Links
	s.Links = o.findLinks(s.ID)

	return nil
}

func (o *objectMap) associateSteps() error {
	for _, s := range o.steps {
		if err := o.associateStep(s); err != nil {
			return errors.Wrap(err, "associate step")
		}
	}

	return nil
}

func (o *objectMap) associateStep(s *models.Step) (err error) {
	// CreatedBy
	s.CreatedBy, err = o.findActor(s.ID, s.CreatedByID)
	if err != nil {
		return errors.Wrap(err, "createdBy for step")
	}

	// Links
	s.Links = o.findLinks(s.ID)

	// Transitions
	s.Transitions = o.findTransitions(s.ID)

	if len(s.Transitions) == 0 {
		s.State = models.StateCreated
	} else {
		last := s.Transitions[len(s.Transitions)-1]
		s.State = last.To

		for _, t := range s.Transitions {
			if t.To == models.StateRunning && s.StartedAt == nil {
				s.StartedAt = &t.CreatedAt
			}
			if t.To == models.StateEnded ||
				t.To == models.StateTerminated ||
				t.To == models.StateFailed {
				if s.EndedAt == nil {
					s.EndedAt = &t.CreatedAt
				} else {
					return errors.New("step stopped multiple times")
				}
			}
		}
	}

	// TODO Start step if running

	return nil
}

func (o *objectMap) associateSessions() error {
	for _, s := range o.sessions {
		if err := o.associateSession(s); err != nil {
			return errors.Wrap(err, "associate session")
		}
	}

	return nil
}

func (o *objectMap) associateSession(s *models.Session) (err error) {
	node, err := o.findNode(s.ID, s.ActorID)
	if err != nil {
		return errors.Wrap(err, "node for session")
	}

	actr, ok := node.(actor.Actor)
	if !ok {
		return ErrInvalidNode
	}

	s.Actor = actr

	switch v := node.(type) {
	case *models.Participant:
		v.Sessions = append(v.Sessions, s)
	case *models.Service:
		v.Sessions = append(v.Sessions, s)
	case *models.User:
		v.Sessions = append(v.Sessions, s)
	default:
		return ErrInvalidNode
	}

	return nil
}

func (o *objectMap) associateGroups() error {
	for _, g := range o.groups {
		if err := o.associateGroup(g); err != nil {
			return errors.Wrap(err, "associate group")
		}
	}

	return nil
}

func (o *objectMap) associateGroup(s *models.Group) (err error) {
	// CreatedBy
	s.CreatedBy, err = o.findActor(s.ID, s.CreatedByID)
	if err != nil {
		return errors.Wrap(err, "createdBy for group")
	}

	// Links
	s.Links = o.findLinks(s.ID)

	return nil
}

func (o *objectMap) findTransitions(id string) []*models.Transition {
	var transitions []*models.Transition

	for _, t := range o.transitions {
		if t.NodeID == id {
			transitions = append(transitions, t)
		}
	}

	return transitions
}

func (o *objectMap) findAttributes(id string) (attributes []*models.Attribute, amap map[string]*models.Attribute) {
	amap = make(map[string]*models.Attribute)

	for _, a := range o.attributes {
		if a.Current && a.NodeID == id {
			attributes = append(attributes, a)
			amap[a.Key] = a
		}
	}

	return attributes, amap
}

func (o *objectMap) findLinks(id string) []*models.Link {
	var links []*models.Link

	for _, l := range o.links {
		if l.NodeID == id {
			links = append(links, l)
		}
	}

	return links
}

func (o *objectMap) findParticipant(id, participantID string) (*models.Participant, error) {
	v, ok := o.values[participantID]
	if !ok {
		return nil, errors.Errorf("participant not found on record (%s)", id)
	}

	vv, ok := v.(*models.Participant)
	if !ok {
		return nil, errors.Errorf("participant is not an record (%s)", id)
	}

	return vv, nil
}

func (o *objectMap) findNode(id, nodeID string) (models.Node, error) {
	v, ok := o.values[nodeID]
	if !ok {
		return nil, errors.Errorf("node not found on record (%s)", id)
	}

	vv, ok := v.(models.Node)
	if !ok {
		return nil, errors.Errorf("node is not an record (%s)", id)
	}

	return vv, nil
}

func (o *objectMap) findActor(id, actorID string) (actor.Actor, error) {
	v, ok := o.values[actorID]
	if !ok {
		return nil, errors.Errorf("createdBy not found on record (%s)", id)
	}

	vv, ok := v.(actor.Actor)
	if !ok {
		return nil, errors.Errorf("createdBy is not an record (%s)", id)
	}

	return vv, nil
}
