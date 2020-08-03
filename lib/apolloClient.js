import { useMemo } from "react";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloLink,
} from "@apollo/client";
import { concatPagination } from "@apollo/client/utilities";

let apolloClient;

const uniswap = new HttpLink({
  uri: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
  credentials: "include",
});

const balancer = new HttpLink({
  uri: "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer",
  credentials: "include",
});

// Compound
// link: new HttpLink({
//   uri: "https://api.thegraph.com/subgraphs/name/graphprotocol/compound-v2", // Server URL (must be absolute)
//   credentials: "include", // Additional fetch() options like `credentials` or `headers`
// }),

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: ApolloLink.split(
      (operation) => operation.getContext().dataSrc === "balancer",
      balancer,
      uniswap
    ),
    // link: new HttpLink({
    //   uri: "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer", // Server URL (must be absolute)
    //   credentials: "include", // Additional fetch() options like `credentials` or `headers`
    // }),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            allPosts: concatPagination(),
          },
        },
      },
    }),
  });
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
