import React from 'react'
import { Box, Button, Heading } from 'grommet'
import { Certificate } from 'grommet-icons'

import { useQuery, gql } from '@apollo/client'

import { ICredentialEdge } from './Types'
import { Link } from 'react-router-dom'
import Credential from './Credential'
import Waiting from './Waiting'
import Utils from './Utils'

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
  ${Credential.fragments.edge}
  ${Utils.fragments.pageInfo}
`

function Credentials() {
  const { loading, error, data, fetchMore } = useQuery(CREDENTIALS_QUERY)

  return (
    <>
      <Heading level={2}>Credentials</Heading>
      {loading || error ? (
        <Waiting loading={loading} error={error} />
      ) : (
        <Box margin="small">
          {data.credentials.edges.map(({ node }: ICredentialEdge) => (
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
                <Heading margin="medium" level="6">
                  {`${node.schemaId} ${node.id}`}
                </Heading>
              </Box>
            </Link>
          ))}
          {data.credentials.pageInfo.hasNextPage && (
            <Button
              label="Load more"
              onClick={() =>
                fetchMore({
                  variables: {
                    cursor: data.credentials.pageInfo.endCursor,
                  },
                })
              }
            ></Button>
          )}
        </Box>
      )}
    </>
  )
}

export default Credentials
