import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  split,
  HttpLink,
  makeVar,
} from '@apollo/client'
import {
  getMainDefinition,
  relayStylePagination,
} from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'
import { setContext } from '@apollo/client/link/context'
import config from './config'

export const addedEventIdsVar = makeVar<string[]>([])

const httpLink = new HttpLink({
  uri: `${config.gqlUrl}/query`,
})
const token = localStorage.getItem('token')
const authHeader = { Authorization: `Bearer ${token}` }

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      ...authHeader,
    },
  }
})

const wsLink = new WebSocketLink({
  uri: `ws://${config.gqlHost}/query?access_token=${token}`,
  options: {
    reconnect: true,
    connectionParams: () => {
      return authHeader
    },
  },
})

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink)
)

export const cache = new InMemoryCache({
  typePolicies: {
    // TODO: do not refetch connection data and nested fields
    // on view load
    Pairwise: {
      fields: {
        messages: relayStylePagination(),
        credentials: relayStylePagination(),
        proofs: relayStylePagination(),
        jobs: relayStylePagination(),
        events: relayStylePagination(),
      },
    },
    Query: {
      fields: {
        events: relayStylePagination(),
        connections: relayStylePagination(),
        credentials: relayStylePagination(),
        jobs: relayStylePagination(),
        connection: {
          //keyArgs: ["id"],
          merge: true,
        },
        /*cachedConnection(_, { args, toReference }: FieldFunctionOptions) {
          return toReference({
            __typename: 'Pairwise',
            id: args!.id,
          })
        },*/
      },
    },
  },
})

export default new ApolloClient({
  uri: `${config.gqlUrl}/query`,
  cache,
  link: ApolloLink.from([splitLink]),
})
