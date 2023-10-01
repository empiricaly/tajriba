package runtime_test

import (
	"context"
	"fmt"
	"net/http"
	"time"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"

	"github.com/empiricaly/tajriba/internal/auth/actor"
	"github.com/empiricaly/tajriba/internal/graph/mgen"
	"github.com/empiricaly/tajriba/internal/models"
	"github.com/empiricaly/tajriba/internal/runtime"
	"github.com/empiricaly/tajriba/internal/server/metadata"
	"github.com/empiricaly/tajriba/internal/store"
	"github.com/empiricaly/tajriba/internal/utils/ids"
)

var _ = Describe("Hooks", func() {
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

		ctx = metadata.SetRequestForContext(ctx, &metadata.Request{
			Headers: map[string][]string{},
			Request: &http.Request{},
			Token:   "token1",
			Actor:   actor.ForContext(ctx),
		})

		// type Request struct {
		// 	Headers map[string][]string
		// 	Request *http.Request
		// 	Token   string
		// 	Actor   actor.Actor
		// }

		rt, err = runtime.Start(ctx, nil)
		Expect(err).To(BeNil())

		noErr := ""
		runtime.TestingSubErrors = &noErr
	})

	It("should trigger with scopes", func() {
		ch, err := rt.SubOnAnyEvent(ctx, &mgen.OnAnyEventInput{})
		Expect(err).To(BeNil())

		evts := make([]*mgen.OnEventPayload, 0, 10)

		go func() {
			for {
				evt := <-ch

				GinkgoWriter.Printf("evt: %#+v\n", evt)

				evts = append(evts, evt)
			}
		}()

		time.Sleep(100 * time.Millisecond)

		_, err = rt.AddScope(ctx, strp("myscope"), strp("thing"), nil)
		Expect(err).To(BeNil())

		time.Sleep(100 * time.Millisecond)

		Expect(len(evts)).To(Equal(2))
		Expect(evts[0].EventType).To(Equal(mgen.EventTypeParticipantConnected))
		Expect(evts[0].Node).To(BeNil())
		Expect(evts[0].Done).To(Equal(true))
		Expect(evts[1].EventType).To(Equal(mgen.EventTypeScopeAdd))
		Expect(*(evts[1].Node.(*models.Scope).Name)).To(Equal("myscope"))
		Expect(evts[1].Done).To(Equal(true))
	})

	It("should trigger with attributes", func() {
		ch, err := rt.SubOnAnyEvent(ctx, &mgen.OnAnyEventInput{})
		Expect(err).To(BeNil())

		evts := make([]*mgen.OnEventPayload, 0, 10)

		go func() {
			for {
				evt := <-ch

				GinkgoWriter.Printf("evt: %#+v\n", evt)

				evts = append(evts, evt)
			}
		}()

		time.Sleep(100 * time.Millisecond)

		_, err = rt.AddScope(ctx, strp("myscope"), strp("thing"), []*mgen.SetAttributeInput{
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

		time.Sleep(100 * time.Millisecond)

		Expect(len(evts)).To(Equal(4))
		Expect(evts[0].EventType).To(Equal(mgen.EventTypeParticipantConnected))
		Expect(evts[1].EventType).To(Equal(mgen.EventTypeScopeAdd))
		Expect(evts[2].EventType).To(Equal(mgen.EventTypeAttributeUpdate))
		Expect(evts[3].EventType).To(Equal(mgen.EventTypeAttributeUpdate))
	})

	It("should not deadlock", Serial, func() {
		defer setupDeadlock()()

		ctx, cancel := context.WithCancel(ctx)

		evts1 := startEventsSub(ctx, rt, 0)
		evts2 := startEventsSub(ctx, rt, 100*time.Millisecond)

		time.Sleep(100 * time.Millisecond)

		sent := 0
		const total = 25

		go func() {
			defer GinkgoRecover()

			for i := 0; i < total; i++ {
				scopes := addScopes(ctx, rt, []*scopeInput{
					{
						name: fmt.Sprintf("myscope %d", i),
						kind: "thing",
						attributes: []*attribInput{
							{
								Key:   fmt.Sprintf("attr1-%d", i),
								Value: "value1",
							},
						},
					},
				})
				sent++
				sent++

				for j := 0; j < total/10; j++ {
					setAttributes(ctx, rt, scopes[0].ID, []*attribInput{
						{
							Key:   fmt.Sprintf("attr1-%d-%d", i, j),
							Value: "value2",
						},
					})
					sent++
				}

			}
		}()

		time.Sleep(3000 * time.Millisecond)

		GinkgoWriter.Printf("sent: %d\n", sent)

		count, countAttrUp := evts1()
		GinkgoWriter.Printf("attr received: %d ; updated: %d\n", count, countAttrUp)
		Expect(count).To(Equal(sent + 1))

		count, _ = evts2()
		Expect(count).To(BeNumerically("<", sent+1))

		time.Sleep(100 * time.Millisecond)

		cancel()
	})
})

func startEventsSub(ctx context.Context, rt *runtime.Runtime, delay time.Duration) func() (int, int) {
	ch, err := rt.SubOnAnyEvent(ctx, &mgen.OnAnyEventInput{})
	Expect(err).To(BeNil())

	evts := make([]*mgen.OnEventPayload, 0, 10)
	count := 0
	countAttrUp := 0

	go func() {
		for {
			evt, ok := <-ch
			if !ok {
				break
			}

			// GinkgoWriter.Printf("evt: %#+v\n", evt)

			if evt.EventType == mgen.EventTypeAttributeUpdate && evt.Node != nil {
				countAttrUp++
			}

			evts = append(evts, evt)
			count++
			if count%1000 == 0 {
				GinkgoWriter.Printf("evt: %#+v\n", evt)
			}

			if delay > 0 {
				time.Sleep(delay)
			}
		}
	}()

	return func() (int, int) {
		return count, countAttrUp
	}
}
