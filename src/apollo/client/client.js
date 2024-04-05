import { useMemo } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
} from '@apollo/client';
import { persistCache } from 'apollo-cache-persist';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import merge from 'deepmerge';

// ** Config
import authConfig from 'src/configs/auth';

if (typeof window !== 'undefined') {
  try {
    // See above for additional options, including other storage providers.
    persistCache({
      cache: new InMemoryCache(),
      storage: window.localStorage,
    });
  } catch (error) {
    console.error('Error restoring Apollo cache', error);
  }
}

let apolloClient;

const signOut = () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = '/'; // redirect user to login page
};

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token =
    'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTAxYWU4NjgzODIxMzM0ZjNhNWYxZGUiLCJlbWFpbCI6ImFkbWluQHBvbHluaW5lLmNvbSIsInJvbGUiOiI2NTAxYWU4NjgzODIxMzM0ZjNhNWYxZDkiLCJjb21wYW55IjoiNjUwMWFlODY4MzgyMTMzNGYzYTVmMWQyIiwiaWF0IjoxNzExOTQ2MjY5LCJleHAiOjE3MTIwMzI2Njl9.3ILj7uHmyln785tPeQJHIeFT3T7gF53wlrdJA8CRlLhPFWgHWqoZ9aar3urTyT99CrAmAkuaG57DAkj45304Gg';

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, extensions, path }) => {
      if (extensions.code === 'UNAUTHENTICATED') {
        signOut();
      }
    });
  }
});

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/api/graphql',
  credentials: 'same-origin',
});

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: ApolloLink.from([authLink, errorLink, httpLink]),
    defaultOptions: {
      query: {
        fetchPolicy: 'cache-and-network',
      },
    },
    cache: new InMemoryCache({ addTypename: false }),
  });
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // get hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState, existingCache);

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data);
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;

  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);

  return store;
}
