package runtime_test

import (
	"context"
	"fmt"
	"time"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"

	"github.com/empiricaly/tajriba/internal/auth/actor"
	"github.com/empiricaly/tajriba/internal/models"
	"github.com/empiricaly/tajriba/internal/runtime"
	"github.com/empiricaly/tajriba/internal/store"
	"github.com/empiricaly/tajriba/internal/utils/ids"
	"github.com/sourcegraph/conc/pool"
)

var _ = Describe("Attribute", func() {
	ctx := context.Background()
	var err error
	var rt *runtime.Runtime

	BeforeEach(func() {
		logger := log.Level(zerolog.TraceLevel).Output(GinkgoWriter)
		ctx = logger.WithContext(ctx)

		ctx, err = ids.Init(ctx)
		Expect(err).To(BeNil())

		conn, err := store.Connect(ctx, &store.Config{UseMemory: true})
		Expect(err).To(BeNil())

		ctx = store.SetContext(ctx, conn)

		// SetContext sets the user on the context.
		ctx = actor.SetContext(ctx, &models.User{ID: "user1"})

		rt, err = runtime.Start(ctx, nil)
		Expect(err).To(BeNil())

		noErr := ""
		runtime.TestingSubErrors = &noErr
	})

	It("should handle vector attributes", func() {
		scopes := addScopes(ctx, rt, []*scopeInput{
			{
				name: "myscope",
				kind: "thing",
				attributes: []*attribInput{
					{
						Key:   "a",
						Value: "0",
					},
				},
			},
		})

		ctx, cancel := context.WithTimeout(ctx, 5000*time.Millisecond)
		defer cancel()

		p := pool.NewWithResults[kvs]()

		p.Go(func() kvs {
			defer GinkgoRecover()

			return runPlayer(
				ctx,
				rt,
				"player1",
				[]string{scopes[0].ID},
				[]*delayedInput{
					{
						delay:   10,
						scopeID: scopes[0].ID,
						input: &attribInput{
							Key:   "b",
							Value: "0",
						},
					},
					{
						delay:   15,
						scopeID: scopes[0].ID,
						input: &attribInput{
							Key:    "c",
							Value:  "1",
							Append: boolp(true),
						},
					},
					{
						delay:   20,
						scopeID: scopes[0].ID,
						input: &attribInput{
							Key:   "a",
							Value: "1",
						},
					},
					{
						delay:   15,
						scopeID: scopes[0].ID,
						input: &attribInput{
							Key:   "c",
							Value: "3",
							Index: intp(2),
						},
					},
					{
						delay:   30,
						scopeID: scopes[0].ID,
						input: &attribInput{
							Key:   "d",
							Value: "x",
							Index: intp(1),
						},
					},
					{
						delay:   55,
						scopeID: scopes[0].ID,
						input: &attribInput{
							Key:   "d",
							Value: "y",
							Index: intp(1),
						},
					},
					{
						delay: 200,
					},
				},
			)
		})

		p.Go(func() kvs {
			defer GinkgoRecover()

			return runAdmin(ctx, rt,
				"admin1",
				[]*delayedInput{
					{
						delay:   30,
						scopeID: scopes[0].ID,
						input: &attribInput{
							Key:   "a",
							Value: "2",
						},
					},
					{
						delay:   40,
						scopeID: scopes[0].ID,
						input: &attribInput{
							Key:   "a",
							Value: "3",
						},
					},
					{
						delay:   15,
						scopeID: scopes[0].ID,
						input: &attribInput{
							Key:   "d",
							Value: "x",
							Index: intp(0),
						},
					},
					{
						delay: 200,
					},
				},
			)
		})

		p.Go(func() kvs {
			defer GinkgoRecover()

			return runAdmin(ctx, rt,
				"admin2",
				[]*delayedInput{
					{
						delay:   35,
						scopeID: scopes[0].ID,
						input: &attribInput{
							Key:   "b",
							Value: "1",
						},
					},
					{
						delay:   35,
						scopeID: scopes[0].ID,
						input: &attribInput{
							Key:   "a",
							Value: "4",
						},
					},
					{
						delay:   65,
						scopeID: scopes[0].ID,
						input: &attribInput{
							Key:    "d",
							Value:  "z",
							Append: boolp(true),
						},
					},
					{
						delay: 200,
					},
				},
			)
		})

		res := p.Wait()

		GinkgoWriter.Print("\n\n")
		for _, r := range res {
			GinkgoWriter.Print(r.String())
		}

		for _, b := range res {
			for _, c := range res {
				Expect(b.Comparable()).To(Equal(c.Comparable()))
			}
		}
	})

	It("should handle vector attributes new sub", func() {
		scopes := addScopes(ctx, rt, []*scopeInput{
			{
				name: "myscope",
				kind: "thing",
				attributes: []*attribInput{
					{
						Key:   "a",
						Value: "0",
					},
				},
			},
		})

		ctx, cancel := context.WithTimeout(ctx, 5000*time.Millisecond)
		defer cancel()

		p := pool.NewWithResults[kvs]()

		p.Go(func() kvs {
			defer GinkgoRecover()

			return runPlayer(
				ctx,
				rt,
				"player1",
				[]string{scopes[0].ID},
				[]*delayedInput{
					{
						delay:   10,
						scopeID: scopes[0].ID,
						input: &attribInput{
							Key:   "b",
							Value: "0",
						},
					},
					{
						delay:   15,
						scopeID: scopes[0].ID,
						input: &attribInput{
							Key:    "c",
							Value:  "1",
							Append: boolp(true),
						},
					},
					{
						delay:   20,
						scopeID: scopes[0].ID,
						input: &attribInput{
							Key:   "a",
							Value: "1",
						},
					},
					{
						delay:   15,
						scopeID: scopes[0].ID,
						input: &attribInput{
							Key:   "c",
							Value: "3",
							Index: intp(2),
						},
					},
					{
						delay:   30,
						scopeID: scopes[0].ID,
						input: &attribInput{
							Key:   "d",
							Value: "x",
							Index: intp(1),
						},
					},
					{
						delay:   55,
						scopeID: scopes[0].ID,
						input: &attribInput{
							Key:   "d",
							Value: "y",
							Index: intp(1),
						},
					},
					{
						delay: 500,
					},
				},
			)
		})

		p.Go(func() kvs {
			defer GinkgoRecover()

			return runAdmin(ctx, rt,
				"admin1",
				[]*delayedInput{
					{
						delay:   30,
						scopeID: scopes[0].ID,
						input: &attribInput{
							Key:   "a",
							Value: "2",
						},
					},
					{
						delay:   40,
						scopeID: scopes[0].ID,
						input: &attribInput{
							Key:   "a",
							Value: "3",
						},
					},
					{
						delay:   15,
						scopeID: scopes[0].ID,
						input: &attribInput{
							Key:   "d",
							Value: "x",
							Index: intp(0),
						},
					},
					{
						delay: 500,
					},
				},
			)
		})

		p.Go(func() kvs {
			defer GinkgoRecover()

			return runAdmin(ctx, rt,
				"admin2",
				[]*delayedInput{
					{
						delay:   35,
						scopeID: scopes[0].ID,
						input: &attribInput{
							Key:   "b",
							Value: "1",
						},
					},
					{
						delay:   40,
						scopeID: scopes[0].ID,
						input: &attribInput{
							Key:   "a",
							Value: "4",
						},
					},
					{
						delay:   65,
						scopeID: scopes[0].ID,
						input: &attribInput{
							Key:    "d",
							Value:  "z",
							Append: boolp(true),
						},
					},
					{
						delay: 500,
					},
				},
			)
		})

		time.Sleep(500 * time.Millisecond)

		p.Go(func() kvs {
			defer GinkgoRecover()

			return runPlayer(
				ctx,
				rt,
				"player2",
				[]string{scopes[0].ID},
				[]*delayedInput{
					{
						delay: 200,
					},
				},
			)
		})

		res := p.Wait()

		GinkgoWriter.Print("\n\n")
		for _, r := range res {
			GinkgoWriter.Print(r.String())
		}

		GinkgoWriter.Print(time.Now().Format(time.RFC3339Nano))
		GinkgoWriter.Print("\n\n")

		var player2 kvs
		for _, r := range res {
			if r.tag == "player2" {
				player2 = r
			}
		}

		// Check final state is the same for all
		for _, b := range res {
			Expect(b.vals).To(Equal(player2.vals))
		}
	})

	It("should handle concurrent changes atomically", func() {
		scopes := addScopes(ctx, rt, []*scopeInput{
			{
				name: "myscope",
				kind: "thing",
				attributes: []*attribInput{
					{
						Key:   "a",
						Value: "0",
					},
				},
			},
		})

		ctx, cancel := context.WithTimeout(ctx, 5000*time.Millisecond)
		defer cancel()

		p := pool.NewWithResults[kvs]()

		p.Go(func() kvs {
			defer GinkgoRecover()

			return runPlayer(
				ctx,
				rt,
				"player1",
				[]string{scopes[0].ID},
				[]*delayedInput{
					{
						delay:   10,
						scopeID: scopes[0].ID,
						input: &attribInput{
							Key:   "a",
							Value: "1",
						},
					},
					{
						delay:   20,
						scopeID: scopes[0].ID,
						input: &attribInput{
							Key:   "b",
							Value: "1",
						},
					},
					{
						delay:   30,
						scopeID: scopes[0].ID,
						input: &attribInput{
							Key:   "c",
							Value: "1",
						},
					},
					{
						delay: 200,
					},
				},
			)
		})

		p.Go(func() kvs {
			defer GinkgoRecover()

			return runAdmin(ctx, rt,
				"admin1",
				[]*delayedInput{
					{
						delay:   10,
						scopeID: scopes[0].ID,
						input: &attribInput{
							Key:   "a",
							Value: "2",
						},
					},
					{
						delay:   20,
						scopeID: scopes[0].ID,
						input: &attribInput{
							Key:   "b",
							Value: "2",
						},
					},
					{
						delay:   30,
						scopeID: scopes[0].ID,
						input: &attribInput{
							Key:   "c",
							Value: "2",
						},
					},
					{
						delay: 200,
					},
				},
			)
		})

		p.Go(func() kvs {
			defer GinkgoRecover()

			return runAdmin(ctx, rt,
				"admin2",
				[]*delayedInput{
					{
						delay:   10,
						scopeID: scopes[0].ID,
						input: &attribInput{
							Key:   "a",
							Value: "3",
						},
					},
					{
						delay:   20,
						scopeID: scopes[0].ID,
						input: &attribInput{
							Key:   "b",
							Value: "3",
						},
					},
					{
						delay:   30,
						scopeID: scopes[0].ID,
						input: &attribInput{
							Key:   "c",
							Value: "3",
						},
					},
					{
						delay: 200,
					},
				},
			)
		})

		p.Go(func() kvs {
			defer GinkgoRecover()

			return runPlayer(
				ctx,
				rt,
				"player2",
				[]string{scopes[0].ID},
				[]*delayedInput{
					{
						delay: 300,
					},
				},
			)
		})

		time.Sleep(500 * time.Millisecond)

		p.Go(func() kvs {
			defer GinkgoRecover()

			return runPlayer(
				ctx,
				rt,
				"player3",
				[]string{scopes[0].ID},
				[]*delayedInput{
					{
						delay: 300,
					},
				},
			)
		})

		p.Go(func() kvs {
			defer GinkgoRecover()

			return runAdmin(ctx, rt,
				"admin3",
				[]*delayedInput{
					{
						delay: 200,
					},
				},
			)
		})

		res := p.Wait()

		GinkgoWriter.Print("\n\n")
		for _, r := range res {
			GinkgoWriter.Print(r.String())
		}

		for _, b := range res[1:] {
			Expect(b.vals).To(Equal(res[0].vals))
		}
	})

	It("should handle handle dead connections", NodeTimeout(10*time.Second), func(sctx SpecContext) {
		defer setupDeadlock()()

		logger := log.Level(zerolog.TraceLevel).Output(GinkgoWriter)
		ctx = logger.WithContext(sctx)

		ctx, err = ids.Init(ctx)
		Expect(err).To(BeNil())

		conn, err := store.Connect(ctx, &store.Config{UseMemory: true})
		Expect(err).To(BeNil())

		ctx = store.SetContext(ctx, conn)

		// SetContext sets the user on the context.
		ctx = actor.SetContext(ctx, &models.User{ID: "user1"})

		rt, err = runtime.Start(ctx, nil)
		Expect(err).To(BeNil())

		scopes := addScopes(ctx, rt, []*scopeInput{
			{
				name: "myscope",
				kind: "thing",
				attributes: []*attribInput{
					{
						Key:   "a",
						Value: "0",
					},
				},
			},
		})

		p := pool.NewWithResults[kvs]().WithContext(ctx)

		val := runtime.MaxWebsocketMsgBuf
		runtime.MaxWebsocketMsgBuf = 10
		defer func() {
			runtime.MaxWebsocketMsgBuf = val
		}()

		p.Go(func(ctx context.Context) (kvs, error) {
			defer GinkgoRecover()

			defer fmt.Print("kvs done\n")

			for i := 0; i < 110; i++ {
				if ctx.Err() != nil {
					defer fmt.Print("kvs cancelled\n")

					return kvs{}, nil
				}

				setAttributes(ctx, rt, scopes[0].ID, []*attribInput{
					{
						Key:   fmt.Sprintf("value%d", i),
						Value: fmt.Sprintf("value%d", i),
					},
				})
			}

			return kvs{}, nil
		})

		p.Go(func(ctx context.Context) (kvs, error) {
			defer GinkgoRecover()
			defer fmt.Print("player1 done\n")

			return runPlayer(
				ctx,
				rt,
				"player1",
				[]string{scopes[0].ID},
				[]*delayedInput{
					{
						delay: 2000,
					},
				},
				1200*time.Millisecond,
			), nil
		})

		p.Go(func(ctx context.Context) (kvs, error) {
			defer GinkgoRecover()
			defer fmt.Print("player2 done\n")

			return runPlayer(
				ctx,
				rt,
				"player2",
				[]string{scopes[0].ID},
				[]*delayedInput{
					{
						delay: 2000,
					},
				},
			), nil
		})

		_, err = p.Wait()
		Expect(err).To(BeNil())

		// res, err := p.Wait()
		// Expect(err).To(BeNil())

		// GinkgoWriter.Print("\n\n")
		// for _, r := range res {
		// 	GinkgoWriter.Print(r.String())
		// }

		// for _, b := range res[1:] {
		// 	Expect(b.vals).To(Equal(res[0].vals))
		// }
	})
})
