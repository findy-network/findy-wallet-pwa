import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Box, Heading } from 'grommet'

import { useQuery, gql } from '@apollo/client'
import Waiting from './Waiting'

const nodeFragment = gql`
  fragment ProofNodeFragment on Proof {
    id
    role
    attributes {
      name
      credDefId
    }
    initiatedByUs
    result
    createdMs
    approvedMs
    verifiedMs
  }
`

Proof.fragments = {
  node: nodeFragment,
  edge: gql`
    fragment ProofEdgeFragment on ProofEdge {
      cursor
      node {
        ...ProofNodeFragment
      }
    }
    ${nodeFragment}
  `,
}

export const PROOF_QUERY = gql`
  query GetProof($id: ID!) {
    proof(id: $id) {
      ...ProofNodeFragment
    }
  }
  ${Proof.fragments.node}
`

type TParams = { id: string }

function Proof({ match }: RouteComponentProps<TParams>) {
  const { loading, error, data } = useQuery(PROOF_QUERY, {
    variables: {
      id: match.params.id,
    },
  })
  const node = data?.proof
  return (
    <>
      {loading || error ? (
        <Waiting loading={loading} error={error} />
      ) : (
        <>
          <Heading level={2}>Proof {node.id}</Heading>
          <Box>
            <Box>
              <div>ID</div>
              <div>{node.id}</div>
            </Box>
          </Box>
        </>
      )}
    </>
  )
}

export default Proof
