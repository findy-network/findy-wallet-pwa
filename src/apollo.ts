import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  split,
  HttpLink,
  FieldFunctionOptions,
  makeVar,
} from '@apollo/client'
import {
  getMainDefinition,
  relayStylePagination,
} from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'
import { setContext } from '@apollo/client/link/context'

export const addedEventIdsVar = makeVar<string[]>([])

const uri = 'localhost:8085/query'

const httpLink = new HttpLink({
  uri: `http://${uri}`,
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
  uri: `ws://${uri}?access_token=${token}`,
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

const client = new ApolloClient({
  uri: `http://${uri}`,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          events: relayStylePagination(),
          connections: relayStylePagination(),
          cachedConnection(_, { args, toReference }: FieldFunctionOptions) {
            return toReference({
              __typename: 'Pairwise',
              id: args!.id,
            })
          },
        },
      },
    },
  }),
  link: ApolloLink.from([splitLink]),
})

export default client
