package runtime

import "github.com/empiricaly/tajriba/internal/models"

func paginate(items []models.Cursorer, after *string, first *int, before *string, last *int) (attrs []models.Cursorer, total int, hasNext, hasPrev bool, err error) {
	totallen := len(items)

	if first == nil && last == nil {
		return nil, 0, false, false, ErrLengthInvalid
	}

	if first != nil {
		start := 0

		if after != nil {
			for i, v := range items {
				if v.Cursor() == *after {
					start = i + 1

					break
				}
			}

			if start == 0 {
				return nil, 0, false, false, ErrCursorNotFound
			}
		}

		if start >= totallen {
			return nil, totallen, false, totallen > 0, nil
		}

		subsetlen := len(items[start:])

		if *first > subsetlen {
			return items, totallen, false, start > 0, nil
		}

		return items[start:*first], totallen, subsetlen > *first, start > 0, nil
	}

	ending := totallen

	if before != nil {
		for i := len(items) - 1; i >= 0; i-- {
			v := items[i]
			if v.Cursor() == *after {
				ending = i

				break
			}
		}

		if ending == totallen {
			return nil, 0, false, false, ErrCursorNotFound
		}
	}

	start := ending - *last

	if start < 0 {
		return items[0:ending], totallen, ending < totallen, false, nil
	}

	subset := items[start:ending]

	return subset, totallen, ending < totallen, start > 0, nil
}
