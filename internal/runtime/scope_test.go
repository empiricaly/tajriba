package runtime_test

import (
	"context"
	"fmt"
	"time"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
	"github.com/sasha-s/go-deadlock"

	"github.com/empiricaly/tajriba/internal/auth/actor"
	"github.com/empiricaly/tajriba/internal/graph/mgen"
	"github.com/empiricaly/tajriba/internal/models"
	"github.com/empiricaly/tajriba/internal/runtime"
	"github.com/empiricaly/tajriba/internal/store"
	"github.com/empiricaly/tajriba/internal/utils/ids"
)

func strp(s string) *string {
	return &s
}

type attribInput struct {
	Key   string
	Value string
}

type scopeInput struct {
	name       string
	kind       string
	attributes []*attribInput
}

func addScopes(ctx context.Context, rt *runtime.Runtime, inputs []*scopeInput) []*models.Scope {
	var scopes []*models.Scope

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

func setAttributes(ctx context.Context, rt *runtime.Runtime, scopeID string, inputs []*attribInput) {
	var attrs []*mgen.SetAttributeInput
	for _, attr := range inputs {
		attrs = append(attrs, &mgen.SetAttributeInput{
			Key:    attr.Key,
			Val:    strp(attr.Value),
			NodeID: strp(scopeID),
		})
	}

	_, err := rt.SetAttributes(ctx, attrs)
	Expect(err).To(BeNil())
}

var _ = Describe("Scope", func() {
	ctx := context.Background()
	var err error
	var rt *runtime.Runtime

	BeforeEach(func() {
		ctx, err = ids.Init(ctx)
		Expect(err).To(BeNil())

		conn, err := store.Connect(ctx, &store.Config{UseMemory: true})
		Expect(err).To(BeNil())

		ctx = store.SetContext(ctx, conn)

		// SetContext sets the user on the context.
		ctx = actor.SetContext(ctx, &models.User{ID: "user1"})

		rt, err = runtime.Start(ctx)
		Expect(err).To(BeNil())
	})

	It("should be added", func() {
		s, err := rt.AddScope(ctx, strp("myscope"), strp("thing"), nil)
		Expect(err).To(BeNil())

		Expect(*s.Name).To(Equal("myscope"))
		Expect(*s.Kind).To(Equal("thing"))
	})

	It("should be added with attributes", func() {
		s, err := rt.AddScope(ctx, strp("myscope"), strp("thing"), []*mgen.SetAttributeInput{
			{
				Key: "attr1",
				Val: strp(`"value1"`),
			},
			{
				Key: "attr2",
				Val: strp(`123`),
			},
		})
		Expect(err).To(BeNil())

		Expect(*s.Name).To(Equal("myscope"))
		Expect(*s.Kind).To(Equal("thing"))

		Expect(len(s.Attributes)).To(Equal(2))
		for _, attr := range s.Attributes {
			switch attr.Key {
			case "attr1":
				Expect(*attr.Val).To(Equal(`"value1"`))
			case "attr2":
				Expect(*attr.Val).To(Equal(`123`))
			default:
				Fail("unexpected attribute")
			}
		}
	})

	It("should not deadlock", func() {
		optsTimeout := deadlock.Opts.DeadlockTimeout
		optsOnDeadlock := deadlock.Opts.OnPotentialDeadlock
		defer func() {
			deadlock.Opts.DeadlockTimeout = optsTimeout
			deadlock.Opts.OnPotentialDeadlock = optsOnDeadlock
		}()

		deadlock.Opts.DeadlockTimeout = 2 * time.Second
		deadlock.Opts.OnPotentialDeadlock = func() {
			Fail("potential deadlock")
		}

		ctx, cancel := context.WithCancel(ctx)
		count := 0
		const total = 100

		go func() {
			for i := 0; i < total; i++ {
				scopes := addScopes(ctx, rt, []*scopeInput{
					{
						name: fmt.Sprintf("myscope %d", i),
						kind: "thing",
						attributes: []*attribInput{
							{
								Key:   "attr1",
								Value: "value1",
							},
						},
					},
				})

				for i := 0; i < total/10; i++ {
					setAttributes(ctx, rt, scopes[0].ID, []*attribInput{
						{
							Key:   "attr1",
							Value: "value2",
						},
					})
				}

			}
		}()

		for i := 0; i < total; i++ {
			c, err := rt.SubScopedAttributes(ctx, models.ScopedAttributesInputs{
				{
					KVs: []*models.KV{
						{
							Key: "attr1",
							Val: "value1",
						},
					},
				},
			}, false)
			Expect(err).To(BeNil())

			go func() {
				for {
					s, ok := <-c
					if !ok {
						return
					}

					if s.Attribute == nil {
						continue
					}

					for i := 0; i < total/10; i++ {
						setAttributes(ctx, rt, s.Attribute.Node.(*models.Scope).ID, []*attribInput{
							{
								Key:   "attr1",
								Value: "value3",
							},
						})
					}

					count++
				}
			}()
		}

		time.Sleep(3 * time.Second)

		cancel()
	})
})
