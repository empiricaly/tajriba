package models

// Cursorer is a struct that has a cursor.
type Cursorer interface {
	Cursor() string
}
