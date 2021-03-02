import React from 'react'
import { Box, Button, Heading, Text } from 'grommet'
import { Certificate } from 'grommet-icons'

import { useQuery, gql } from '@apollo/client'

import { ICredentialEdge } from './Types'
import { Link } from 'react-router-dom'
import Waiting from './Waiting'
import Utils from './Utils'
import { credential as fragments, pageInfo } from './Fragments'

export const CREDENTIALS_QUERY = gql`
  query GetCredentials($cursor: String) {
    credentials(first: 10, after: $cursor) {
      edges {
        ...CredentialEdgeFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${fragments.edge}
  ${pageInfo}
`

export const CONNECTION_CREDENTIALS_QUERY = gql`
  query GetConnectionCredentials($id: ID!, $cursor: String) {
    connection(id: $id) {
      credentials(first: 3, after: $cursor) {
        edges {
          ...CredentialEdgeFragment
        }
        pageInfo {
          ...PageInfoFragment
        }
      }
    }
  }
  ${fragments.edge}
  ${pageInfo}
`

interface IProps {
  connectionId?: string
}

function Credentials({ connectionId }: IProps) {
  const { loading, error, data, fetchMore } = useQuery(
    connectionId ? CONNECTION_CREDENTIALS_QUERY : CREDENTIALS_QUERY,
    {
      ...(connectionId ? { variables: { id: connectionId } } : {}),
    }
  )
  const isLoading = loading || (!error && !data)
  const showWaiting = isLoading || error

  const credentials = data?.credentials || data?.connection?.credentials

  return (
    <Box height={{ min: 'initial' }}>
      <Heading level={2}>Credentials</Heading>
      {showWaiting ? (
        <Waiting loading={loading} error={error} />
      ) : (
          <Box margin="small">
            {credentials.edges.map(({ node }: ICredentialEdge, index: number) => (
              <Link key={node.id} to={`/credentials/${node.id}`}>
                <Box
                  background="light-1"
                  direction="row"
                  align="center"
                  pad="medium"
                  border="bottom"
                  height={{ min: '8rem' }}
                >
                  <Certificate />
                  <Box>
                    <Text>
                      {`${index + 1}. ${Utils.toTimeString(node.createdMs)}`}
                    </Text>
                    <Heading margin="medium" level="6">
                      {`${node.schemaId} ${node.id}`}
                    </Heading>
                  </Box>
                </Box>
              </Link>
            ))}
            {credentials.pageInfo.hasNextPage && (
              <Button
                label="Load more"
                onClick={() =>
                  fetchMore({
                    variables: {
                      cursor: credentials.pageInfo.endCursor,
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

export default Credentials
