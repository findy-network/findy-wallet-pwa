import React from 'react'
import { Box, Button, Heading } from 'grommet'
import { User } from 'grommet-icons'

import { useQuery, gql } from '@apollo/client'

import { IConnectionEdge } from './Types'
import { Link } from 'react-router-dom'
import Connection from './Connection'
import Waiting from './Waiting'
import { pageInfo } from './Fragments'


export const CONNECTIONS_QUERY = gql`
  query GetConnections($cursor: String) {
    connections(first: 10, after: $cursor) {
      edges {
        ...PairwiseEdgeFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${Connection.fragments.edge}
  ${pageInfo}
`

function Connections() {
  const { loading, error, data, fetchMore } = useQuery(CONNECTIONS_QUERY)

  return (
    <>
      <Heading level={2}>Connections</Heading>
      {loading || error ? (
        <Waiting loading={loading} error={error} />
      ) : (
          <Box margin="small">
            {data.connections.edges.map(({ node }: IConnectionEdge) => (
              <Link key={node.id} to={`/connections/${node.id}`}>
                <Box
                  background="light-1"
                  direction="row"
                  align="center"
                  pad="medium"
                  border="bottom"
                  height={{ min: '8rem' }}
                >
                  <User />
                  <Heading margin="medium" level="6">
                    {node.theirLabel}
                  </Heading>
                </Box>
              </Link>
            ))}
            {data.connections.pageInfo.hasNextPage && (
              <Button
                label="Load more"
                onClick={() =>
                  fetchMore({
                    variables: {
                      cursor: data.connections.pageInfo.endCursor,
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

export default Connections
