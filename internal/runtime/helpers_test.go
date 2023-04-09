package runtime_test

import (
	"context"
	"fmt"
	"sort"
	"strings"
	"time"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"

	"github.com/empiricaly/tajriba/internal/auth/actor"
	"github.com/empiricaly/tajriba/internal/graph/mgen"
	"github.com/empiricaly/tajriba/internal/models"
	"github.com/empiricaly/tajriba/internal/runtime"
)

func strp(s string) *string {
	return &s
}

func boolp(b bool) *bool {
	return &b
}

func intp(i int) *int {
	return &i
}

func isPTrue(b *bool) bool {
	if b == nil {
		return false
	}

	return *b
}

type scopeInput struct {
	name       string
	kind       string
	attributes []*attribInput
}

func addScopes(ctx context.Context, rt *runtime.Runtime, inputs []*scopeInput) []*models.Scope {
	scopes := make([]*models.Scope, 0, len(inputs))

	for _, input := range inputs {
		var attrs []*mgen.SetAttributeInput
		for _, attr := range input.attributes {
			attrs = append(attrs, &mgen.SetAttributeInput{
				Key: attr.Key,
				Val: strp(attr.Value),
			})
		}

		s, err := rt.AddScope(ctx, strp(input.name), strp(input.kind), attrs)
		Expect(err).To(BeNil())

		scopes = append(scopes, s)
	}

	return scopes
}

type attribInput struct {
	Key       string
	Value     string
	Index     *int
	Append    *bool
	Private   *bool
	Immutable *bool
	Protected *bool
}

func setAttributes(ctx context.Context, rt *runtime.Runtime, scopeID string, inputs []*attribInput) {
	attrs := make([]*mgen.SetAttributeInput, 0, len(inputs))

	for _, attr := range inputs {
		attrs = append(attrs, &mgen.SetAttributeInput{
			Key:       attr.Key,
			Val:       strp(attr.Value),
			Index:     attr.Index,
			Append:    attr.Append,
			Private:   attr.Private,
			Immutable: attr.Immutable,
			Protected: attr.Protected,
			NodeID:    strp(scopeID),
		})
	}

	_, err := rt.SetAttributes(ctx, attrs)
	Expect(err).To(BeNil())
}

type delayedInput struct {
	delay   int // in milliseconds
	input   *attribInput
	scopeID string
}

func runPlayer(ctx context.Context, rt *runtime.Runtime, name string, scopeIDs []string, input []*delayedInput) (res kvs) {
	ctx, cancel := context.WithCancel(ctx)

	res = newKvs(name)

	part, _, err := rt.AddParticipant(ctx, name)
	Expect(err).To(BeNil())

	ctx = actor.SetContext(ctx, part)
	c, err := rt.SubChanges(ctx)
	Expect(err).To(BeNil())

	_, err = rt.Link(ctx, mgen.LinkInput{
		NodeIDs:        scopeIDs,
		ParticipantIDs: []string{part.ID},
		Link:           true,
	})
	Expect(err).To(BeNil())

	go func() {
		defer GinkgoRecover()

		for {
			s, ok := <-c
			if !ok {
				GinkgoWriter.Print(name, " done ", time.Now().Format(time.RFC3339Nano), "\n")

				return
			}

			attrChg, ok := s.Change.(*models.AttributeChange)
			if !ok {
				continue
			}

			a := &models.Attribute{
				ID:     attrChg.ID,
				Key:    attrChg.Key,
				Val:    attrChg.Val,
				Index:  attrChg.Index,
				Vector: attrChg.Vector,
			}

			GinkgoWriter.Print(name, " newattr ", a.LookupKey(), " ", time.Now().Format(time.RFC3339Nano), "\n")

			res.addAttr(a)
		}
	}()

	GinkgoWriter.Print(name, " runattr ", time.Now().Format(time.RFC3339Nano), "\n")
	runAttributes(ctx, rt, input)
	GinkgoWriter.Print(name, " cancel ", time.Now().Format(time.RFC3339Nano), "\n")
	cancel()

	return res
}

func runAdmin(ctx context.Context, rt *runtime.Runtime, name string, input []*delayedInput) (res kvs) {
	ctx, cancel := context.WithCancel(ctx)

	res = newKvs(name)

	c, err := rt.SubScopedAttributes(ctx, models.ScopedAttributesInputs{
		{Names: []string{"myscope"}},
	}, false)
	Expect(err).To(BeNil())

	go func() {
		defer GinkgoRecover()

		for {
			s, ok := <-c
			if !ok {
				return
			}

			if s.Attribute == nil {
				if !s.Done {
					Fail("unexpected nil attribute with no done")
				}

				continue
			}

			res.addAttr(s.Attribute)
		}
	}()

	runAttributes(ctx, rt, input)
	cancel()

	return res
}

func runAttributes(ctx context.Context, rt *runtime.Runtime, input []*delayedInput) {
	for _, i := range input {
		time.Sleep(time.Duration(i.delay) * time.Millisecond)

		if i.input == nil {
			continue
		}

		setAttributes(ctx, rt, i.scopeID, []*attribInput{i.input})
	}
}

type kvs struct {
	tag     string
	last    time.Time
	vals    map[string]*val
	history []map[string]*val
}

func newKvs(tag string) kvs {
	return kvs{
		tag:  tag,
		vals: make(map[string]*val),
	}
}

func sortedKeys(m map[string]*val) []string {
	keys := make([]string, 0, len(m))
	for k := range m {
		keys = append(keys, k)
	}

	sort.Strings(keys)

	return keys
}

func (k *kvs) Comparable() *kvs {
	return &kvs{
		vals:    k.vals,
		history: k.history,
	}
}

func (k *kvs) String() string {
	var b strings.Builder

	b.WriteString(fmt.Sprintf("%s - %s\n", k.tag, k.last.Format(time.RFC3339Nano)))

	res := make([]string, 0, len(k.vals))
	for _, key := range sortedKeys(k.vals) {
		res = append(res, fmt.Sprintf("%s: %s", key, k.vals[key]))
	}

	b.WriteString(strings.Join(res, ", ") + "\n")

	for index, h := range k.history {
		res := make([]string, 0, len(h))
		first := true

		for _, k := range sortedKeys(h) {
			if first {
				res = append(res, fmt.Sprintf("    %02d - %s: %s", index, k, h[k]))
				first = false

				continue
			}

			res = append(res, fmt.Sprintf("%s: %s", k, h[k]))
		}

		if len(h) == 0 {
			if first {
				res = append(res, fmt.Sprintf("    %02d - ∅", index))
			} else {
				res = append(res, "∅")
			}
		}

		b.WriteString(strings.Join(res, ", ") + "\n")
	}

	return b.String() + "\n"
}

func (k *kvs) copyVals() map[string]*val {
	vals := make(map[string]*val, len(k.vals))

	for k, v := range k.vals {
		vals[k] = v.copy()
	}

	return vals
}

func (k *kvs) addAttr(attr *models.Attribute) {
	k.history = append(k.history, k.copyVals())
	k.last = time.Now()

	if attr.Vector {
		if attr.Index == nil {
			Fail("nil index for vector attribute")
		}

		if _, ok := k.vals[attr.Key]; !ok {
			k.vals[attr.Key] = new(val)
		}

		k.vals[attr.Key].update(attr.Val, *attr.Index)

		return
	}

	if attr.Val == nil {
		k.vals[attr.Key] = &val{scalar: ""}

		return
	}

	k.vals[attr.Key] = &val{scalar: *attr.Val}
}

type val struct {
	scalar string
	vector []string
}

func (v *val) String() string {
	if v == nil {
		return ""
	}

	if v.vector != nil {
		vals := make([]string, 0, len(v.vector))

		for _, v := range v.vector {
			if v == "" {
				vals = append(vals, "∅")
			} else {
				vals = append(vals, v)
			}
		}

		return fmt.Sprintf("[%s]", strings.Join(vals, " "))
	}

	return v.scalar
}

func (v *val) copy() *val {
	if v == nil {
		return nil
	}

	if v.vector == nil {
		return &val{
			scalar: v.scalar,
		}
	}

	return &val{
		vector: append([]string{}, v.vector...),
	}
}

func (v *val) update(val *string, index int) {
	if v.vector == nil {
		v.vector = make([]string, index+1)
	} else if len(v.vector) <= index {
		v.grow(index)
	}

	if val == nil {
		v.vector[index] = ""

		return
	}

	v.vector[index] = *val
}

func (v *val) grow(i int) {
	v.vector = append(v.vector, make([]string, i-len(v.vector)+1)...)
}
