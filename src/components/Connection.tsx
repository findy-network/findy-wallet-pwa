import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Box, Heading } from 'grommet'

import { useQuery, gql } from '@apollo/client'
import Waiting from './Waiting'
import { pairwise as fragments, pageInfo } from './Fragments'
import Event from './Event'
import { IEventEdge } from './Types'


Connection.fragments = fragments

export const CONNECTION_QUERY = gql`
  query GetConnection($id: ID!, $cursor: String) {
    connection(id: $id) {
      ...PairwiseNodeFragment
      events(last: 3, before: $cursor) {
        edges {
          ...FullEventEdgeFragment
        }
        pageInfo {
          ...PageInfoFragment
        }
      }

    }
  }
  ${Connection.fragments.node}
  ${Event.fragments.fullEdge}
  ${pageInfo}
`

type TParams = { id: string }

function Connection({ match }: RouteComponentProps<TParams>) {
  const { loading, error, data } = useQuery(CONNECTION_QUERY, {
    variables: {
      id: match.params.id,
    },
  })
  const node = data?.connection
  return (
    <>
      {loading || error ? (
        <Waiting loading={loading} error={error} />
      ) : (
          <Box>
            <Heading level={2}>Connection {node.theirLabel}</Heading>
            <Box>
              {[...node.events.edges].reverse().map(({ node }: IEventEdge) => (<div key={node.id}>{node.description}</div>))}
            </Box>
          </Box>
        )}
    </>
  )
}

export default Connection
