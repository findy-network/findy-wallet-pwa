import React from 'react'
import { Box, Button, Paragraph } from 'grommet'

import { useQuery, gql } from '@apollo/client'

import { IConnectionEdge } from './Types'
import { NavLink } from 'react-router-dom'
import Waiting from './Waiting'
import { pageInfo } from './Fragments'
import { pairwise as fragments } from './Fragments'
import { Person as PersonIco } from '@material-ui/icons'

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
  ${fragments.edge}
  ${pageInfo}
`
const linkStyle = {
  textDecoration: "none", 
  borderLeft: "3px solid transparent",
  color: "#FFFFFF80"
};

const activelinkStyle = {
  borderLeft: "3px solid #006EE6",
  color: "#FFFFFF"
};


function Connections() {
  const { loading, error, data, fetchMore } = useQuery(CONNECTIONS_QUERY)
  return (
    <>
      {loading || error ? (
        <Waiting loading={loading} error={error} />
      ) : (
        <Box margin="none">
          {data.connections.edges.map(({ node }: IConnectionEdge) => (
            <NavLink 
              key={node.id} 
              to={`/connections/${node.id}`}
              activeStyle={activelinkStyle}
              style={linkStyle}
            >
              <Box
                direction="row"
                align="center"
                pad="1rem"
              >
                <PersonIco style={{fontSize: "1.5rem", marginRight: ".5rem"}}/>
                <Paragraph style={{fontSize: ".95rem", fontWeight: (500)}} margin="none">
                  {node.theirLabel}
                </Paragraph>
              </Box>
            </NavLink>
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
