import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { useHistory } from 'react-router'

import Waiting from './Waiting'

export const CONNECTIONS_QUERY = gql`
  query GetConnections {
    connections(first: 1) {
      edges {
        node {
          id
        }
      }
    }
  }
`

function Home() {
  const history = useHistory()
  const onCompleted = (data: any) => {
    if (data && data.connections.edges.length > 0) {
      const { id } = data.connections.edges[0].node
      history.push(`/connections/${id}`)
    }
  }
  const { loading, error, data } = useQuery(CONNECTIONS_QUERY, {
    fetchPolicy: 'cache-only',
    onCompleted,
  })
  const isLoading = loading || (!error && !data)
  const showWaiting = isLoading || error

  return showWaiting ? (
    <Waiting loading={loading} error={error} />
  ) : (
    <div>No connections</div>
  )
}

export default Home
