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

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        events: relayStylePagination(),
        connections: relayStylePagination(),
        jobs: relayStylePagination(),

        // Hmm...
        // Pagination logic does not seem to work "out-of-the-apollo"
        // when there are nested items
        // TODO: redesign this
        connection: {
          read(connection, args) {
            const { isReference } = args
            if (isReference(connection)) {
              return connection
            }
            if (connection) {
              const arrayKey =
                Object.keys(connection).find((item) => item !== '__typename') ||
                ''
              const existing = connection[arrayKey]
              const objects = relayStylePagination().read!(existing, args)
              return { ...connection, [arrayKey]: objects }
            }
            return connection
          },
          merge(existing, incoming, args) {
            const { isReference } = args
            if (isReference(incoming)) {
              return { ...existing, ...incoming }
            }
            if (incoming) {
              const isArrayName = (item: string) =>
                item !== '__typename' && item !== '__ref'
              const prevArrayKey = existing
                ? Object.keys(existing).find(isArrayName) || ''
                : ''
              const newArrayKey = Object.keys(incoming).find(isArrayName) || ''
              const merge = relayStylePagination().merge!
              if (typeof merge === 'function') {
                const cursorData = newArrayKey.match(
                  /"(after|before)":"((\\"|[^"])*)"/i
                )
                const newArgs = cursorData && {
                  ...args.args,
                  [cursorData[1]]: cursorData[2],
                }
                const mergeArgs = cursorData ? { ...args, args: newArgs } : args
                const prevData =
                  typeof existing[prevArrayKey] !== 'string' &&
                  existing[prevArrayKey]
                const objects = merge(
                  prevData,
                  incoming[newArrayKey],
                  mergeArgs
                )
                const n = {
                  __typename: incoming.__typename,
                  [prevArrayKey || newArrayKey]: objects,
                }
                return n
              }
            }
            return existing
          },
        },
        cachedConnection(_, { args, toReference }: FieldFunctionOptions) {
          return toReference({
            __typename: 'Pairwise',
            id: args!.id,
          })
        },
      },
    },
  },
})

export default new ApolloClient({
  uri: `http://${uri}`,
  cache,
  link: ApolloLink.from([splitLink]),
})
