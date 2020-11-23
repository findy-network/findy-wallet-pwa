import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Box, Heading } from 'grommet'

import { useQuery, gql } from '@apollo/client'
import Waiting from './Waiting'
import Messages from './Messages'
import Credentials from './Credentials'
import Proofs from './Proofs'

const nodeFragment = gql`
  fragment PairwiseNodeFragment on Pairwise {
    id
    ourDid
    theirDid
    theirEndpoint
    theirLabel
    createdMs
    approvedMs
    invited
  }
`

Connection.fragments = {
  node: nodeFragment,
  edge: gql`
    fragment PairwiseEdgeFragment on PairwiseEdge {
      cursor
      node {
        ...PairwiseNodeFragment
      }
    }
    ${nodeFragment}
  `,
}

export const CONNECTION_QUERY = gql`
  query GetConnection($id: ID!) {
    connection(id: $id) {
      ...PairwiseNodeFragment
    }
  }
  ${Connection.fragments.node}
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
            <Box>
              <div>ID</div>
              <div>{node.id}</div>
              <div>My DID</div>
              <div>{node.ourDid}</div>
              <Credentials connectionId={node.id} />
              <Proofs connectionId={node.id} />
              <Messages connectionId={node.id} />
            </Box>
          </Box>
        </Box>
      )}
    </>
  )
}

export default Connection
