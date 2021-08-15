// Currently graphql-ws is not implemented server side, will switch when it is.

import {
  ApolloLink,
  FetchResult,
  Observable,
  Operation,
} from "@apollo/client/core";
import { GraphQLError, print } from "graphql";
import { Client, ClientOptions, createClient } from "graphql-ws";

export class WebSocketLink extends ApolloLink {
  private client: Client;

  constructor(options: ClientOptions) {
    super();
    this.client = createClient(options);
  }

  public request(operation: Operation): Observable<FetchResult> {
    return new Observable((sink) => {
      return this.client.subscribe<FetchResult>(
        { ...operation, query: print(operation.query) },
        {
          next: sink.next.bind(sink),
          complete: sink.complete.bind(sink),
          error: (err) => {
            if (err instanceof Error) {
              return sink.error(err);
            }

            if (err instanceof CloseEvent) {
              return sink.error(
                // reason will be available on clean closes
                new Error(
                  `Socket closed with event ${err.code} ${err.reason || ""}`
                )
              );
            }

            return sink.error(
              new Error(
                (err as GraphQLError[]).map(({ message }) => message).join(", ")
              )
            );
          },
        }
      );
    });
  }
}

// const link = new WebSocketLink({
//   url: this.wsURL,
//   retryAttempts: 1000,
//   webSocketImpl: ws,
//   generateID: newID,
//   on: {
//     connecting: () => {
//       console.log("connecting");
//     },
//     opened: () => {
//       console.log("opened");
//     },
//     connected: () => {
//       console.log("connected");
//     },
//     message: () => {
//       console.log("message");
//     },
//     closed: () => {
//       console.log("closed");
//     },
//     error: (err) => {
//       console.log("error", err);
//     },
//   },
//   connectionParams: () => {
//     if (!this.token) {
//       return {};
//     }

//     return {
//       Authorization: `Bearer ${this.token}`,
//     };
//   },
// });
