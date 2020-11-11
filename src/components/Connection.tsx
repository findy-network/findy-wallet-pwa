import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Box, Heading } from 'grommet'

import { useQuery, gql } from '@apollo/client'
import Waiting from './Waiting'

Connection.fragments = {
  data: gql`
    fragment PairwiseNodeFragment on PairwiseEdge {
      node {
        id
        ourDid
        theirDid
        theirEndpoint
        theirLabel
        createdMs
        approvedMs
        initiatedByUs
      }
      cursor
    }
  `,
}

export const CONNECTION_QUERY = gql`
  query GetConnection($id: ID!) {
    connection(id: $id) {
      ...PairwiseNodeFragment
    }
  }
  ${Connection.fragments.data}
`

type TParams = { id: string }

function Connection({ match }: RouteComponentProps<TParams>) {
  const { loading, error, data } = useQuery(CONNECTION_QUERY, {
    variables: {
      id: match.params.id,
    },
  })
  const node = data?.connection.node
  return (
    <>
      {loading || error ? (
        <Waiting loading={loading} error={error} />
      ) : (
        <>
          <Heading level={2}>Connection {node.theirLabel}</Heading>
          <Box>
            <Box>
              <div>ID</div>
              <div>{node.id}</div>
              <div>My DID</div>
              <div>{node.ourDid}</div>
            </Box>
          </Box>
        </>
      )}
    </>
  )
}

export default Connection
