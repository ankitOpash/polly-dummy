import { useMemo } from 'react'
import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from '@apollo/client'
import { persistCache } from "apollo-cache-persist";
import { setContext } from "@apollo/client/link/context"
import { onError } from "@apollo/client/link/error";
import merge from 'deepmerge'

// ** Config

if (typeof window !== 'undefined') {
  try {
    persistCache({
      cache: new InMemoryCache(),
      storage: window.localStorage,
    });
  } catch (error) {
    console.error('Error restoring Apollo cache', error);
  }
}

let apolloClient

const signOut = () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "/"
};

const authLink = setContext((_, { headers }) => {

  // const token = localStorage.getItem(authConfig.storageTokenKeyName);
  // const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGVjMmQ2YzMwNGIwOTM3OTlhNDdjM2IiLCJlbWFpbCI6ImFkbWluQHBvbHluaW5lLmNvbSIsInJvbGUiOiI2NGVjMmQ2YzMwNGIwOTM3OTlhNDdjMzYiLCJjb21wYW55IjoiNjRlYzJkNmMzMDRiMDkzNzk5YTQ3YzJmIiwiaWF0IjoxNjk1Mzg0ODExLCJleHAiOjE2OTc5NzY4MTF9.pQ8Cy9hCl0XEan5fQ8qE1h-MrcgGREDGN61xRB-z8h3l0En0sPMLng6SEa5mU4e7R9fXsQoQ1OIWk0V_vxybeQ";

  return {
    headers: {
      ...headers,
      //  authorization: token ? `Bearer ${token}` : "",
    }
  }
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, extensions, path }) => {
      if (extensions.code === 'UNAUTHENTICATED') {
        signOut()
      }
    });
  }
});

const httpLink = createHttpLink({
  // uri: process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT,
  // uri: 'https://www.cgitours.com/api/graphql',
  uri: "http://192.168.0.180:3000/graphql",
  // credentials: '*',
});

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: ApolloLink.from([authLink, errorLink, httpLink]),
    defaultOptions: {
      query: {
        fetchPolicy: 'cache-and-network'
      }
    },
    cache: new InMemoryCache({ addTypename: false }),
  })
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient()

  if (initialState) {
    const existingCache = _apolloClient.extract()

    const data = merge(initialState, existingCache)

    _apolloClient.cache.restore(data)
  }

  if (typeof window === 'undefined') return _apolloClient

  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState])

  return store
}
