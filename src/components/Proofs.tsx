import React from 'react'
import { Box, Button, Heading, Text } from 'grommet'
import { Compare } from 'grommet-icons'

import { useQuery, gql } from '@apollo/client'

import { IProofEdge } from './Types'
import { Link } from 'react-router-dom'
import Proof from './Proof'
import Waiting from './Waiting'
import Utils from './Utils'

export const PROOFS_QUERY = gql`
  query GetConnectionProofs($id: ID!, $cursor: String) {
    connection(id: $id) {
      proofs(first: 3, after: $cursor) {
        edges {
          ...ProofEdgeFragment
        }
        pageInfo {
          ...PageInfoFragment
        }
      }
    }
  }
  ${Proof.fragments.edge}
  ${Utils.fragments.pageInfo}
`

interface IProps {
  connectionId?: string
}

function Proofs({ connectionId }: IProps) {
  const { loading, error, data, fetchMore } = useQuery(PROOFS_QUERY, {
    variables: { id: connectionId },
  })
  const isLoading = loading || (!error && !data)
  const showWaiting = isLoading || error

  const proofs = data?.connection?.proofs

  return (
    <Box height={{ min: 'initial' }}>
      <Heading level={2}>Proofs</Heading>
      {showWaiting ? (
        <Waiting loading={loading} error={error} />
      ) : (
        <Box margin="small">
          {proofs.edges.map(({ node }: IProofEdge, index: number) => (
            <Link key={node.id} to={`/proofs/${node.id}`}>
              <Box
                background="light-1"
                direction="row"
                align="center"
                pad="medium"
                border="bottom"
                height={{ min: '8rem' }}
              >
                <Compare />
                <Box>
                  <Text>
                    {`${index + 1}. ${Utils.toTimeString(node.createdMs)}`}
                  </Text>
                  <Heading margin="medium" level="6">
                    {`${node.id}`}
                  </Heading>
                </Box>
              </Box>
            </Link>
          ))}
          {proofs.pageInfo.hasNextPage && (
            <Button
              label="Load more"
              onClick={() =>
                fetchMore({
                  variables: {
                    cursor: proofs.pageInfo.endCursor,
                  },
                })
              }
            ></Button>
          )}
        </Box>
      )}
    </Box>
  )
}

export default Proofs
