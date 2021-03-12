import typeDefs from './schema'

import { ApolloClient, InMemoryCache } from '@apollo/client'

import { connections, connectionNode, events } from './data'

export const cache = new InMemoryCache({
  typePolicies: {
    Pairwise: {
      fields: {
        events: {
          read() {
            return events
          },
        },
      },
    },
    Query: {
      fields: {
        user: {
          read() {
            return { name: 'Minnie Mouse' }
          },
        },
        connections: {
          read() {
            return connections
          },
        },
        connection: {
          read() {
            return connectionNode
          },
        },
      },
    },
  },
})

const client = new ApolloClient({
  cache,
  typeDefs,
})

export default client
