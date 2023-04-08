package runtime_test

import (
	"context"
	"fmt"
	"os"
	"time"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"

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

	It("should handle vector attributes", Focus, func() {
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
						delay:   20,
						scopeID: scopes[0].ID,
						input: &attribInput{
							Key:   "a",
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
						delay: 200,
					},
				},
			)
		})

		p.Go(func() kvs {
			defer GinkgoRecover()

			return runAdmin(ctx, rt,
				[]*delayedInput{
					{
						delay:   50,
						scopeID: scopes[0].ID,
						input: &attribInput{
							Key:   "b",
							Value: "1",
						},
					},
					{
						delay:   60,
						scopeID: scopes[0].ID,
						input: &attribInput{
							Key:   "a",
							Value: "4",
						},
					},
					{
						delay: 200,
					},
				},
			)
		})

		// runUser(ctx, rt, wg,
		// 	[]*delayedInput{},
		// )

		res := p.Wait()

		fmt.Fprint(os.Stderr, "\n\n")
		for _, r := range res {
			fmt.Fprintln(os.Stderr, r.String())
		}

		// spew.Dump(res)
	})
})
