package runtime

import "github.com/empiricaly/tajriba/internal/models"

func paginateFirst(items []models.Cursorer, after *string, first int) (
	attrs []models.Cursorer, total int, hasNext, hasPrev bool, err error) {
	totallen := len(items)
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

	if first > subsetlen {
		return items, totallen, false, start > 0, nil
	}

	return items[start : start+first], totallen, subsetlen > first, start > 0, nil
}

func paginateLast(items []models.Cursorer, before *string, last int) (
	attrs []models.Cursorer, total int, hasNext, hasPrev bool, err error) {
	totallen := len(items)

	ending := totallen

	if before != nil {
		for i := len(items) - 1; i >= 0; i-- {
			v := items[i]
			if v.Cursor() == *before {
				ending = i

				break
			}
		}

		if ending == totallen {
			return nil, 0, false, false, ErrCursorNotFound
		}
	}

	start := ending - last

	if start < 0 {
		return items[0:ending], totallen, ending < totallen, false, nil
	}

	subset := items[start:ending]

	return subset, totallen, ending < totallen, start > 0, nil
}

func paginate(items []models.Cursorer, after *string, first *int, before *string, last *int) (
	attrs []models.Cursorer, total int, hasNext, hasPrev bool, err error) {
	switch {
	case first != nil && last != nil:
		return nil, 0, false, false, ErrLengthInvalid
	case first != nil:
		return paginateFirst(items, after, *first)
	case last != nil:
		return paginateLast(items, before, *last)
	default:
		return nil, 0, false, false, ErrLengthInvalid
	}
}
