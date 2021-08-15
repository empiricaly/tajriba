# Tajriba

Tajriba is the experiment runtime used by Empirica v2. It handles low-level
needs of Empirica (timers, persistence, access controls, synchnization...)
behind a GraphQL API.

Tajriba can be imported as a library (as done by Empirica CLI), or can run
standalone with the included `tajriba` command (see `cmds/tajriba`).

A simple `tajriba.js` client library can be found in `lib/tajriba`
