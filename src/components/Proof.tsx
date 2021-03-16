import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Box, Heading } from 'grommet'

import { useQuery, gql } from '@apollo/client'
import Waiting from './Waiting'
import { IProofAttribute, IProofValue } from './Types'

const nodeFragment = gql`
  fragment ProofNodeFragment on Proof {
    id
    role
    attributes {
      id
      name
      credDefId
    }
    initiatedByUs
    result
    createdMs
    approvedMs
    verifiedMs
    values {
      attributeId
      value
    }
    provable {
      provable
    }
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
              {node.attributes.map((item: IProofAttribute) => {
                const value = node.values.find(
                  (val: IProofValue) => val.attributeId === item.id
                )
                return (
                  <div key={item.id}>
                    <div>
                      <strong>Name:</strong>
                      <span>{item.name}</span>
                    </div>
                    <div>
                      <span>Cred def ID:</span>
                      <span>{item.credDefId}</span>
                    </div>
                    <div>
                      <span>Value:</span>
                      <span>{value?.value}</span>
                    </div>
                  </div>
                )
              })}
            </Box>
          </Box>
        </>
      )}
    </>
  )
}

export default Proof
