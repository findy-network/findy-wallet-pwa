import React from 'react'
import { Box, Button, Paragraph as P } from 'grommet'
import styled from 'styled-components'

import { useQuery, gql } from '@apollo/client'

import { IConnectionEdge } from './Types'
import { NavLink } from 'react-router-dom'
import Waiting from './Waiting'
import { pageInfo } from './Fragments'
import { pairwise as fragments } from './Fragments'
import { User as PersonIco } from 'grommet-icons'
import { colors } from '../theme'

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

const activeClassName = 'nav-item-active'

const Row = styled(NavLink).attrs({ activeClassName })`
  text-decoration: none;
  border-left: 3px solid transparent;
  color: ${colors.inactive};
  svg {
    stroke: ${colors.inactive};
  }

  &.${activeClassName} {
    border-left: 3px solid ${colors.selected};
    color: ${colors.active};
    svg {
      stroke: ${colors.selected};
    }
  }
`

const Icon = styled(PersonIco)`
  font-size: 1.5;
  margin-right: 0.5rem;
`

const Paragraph = styled(P)`
  font-size: 0.95rem;
  font-weight: 500;
`

function Connections() {
  const { loading, error, data, fetchMore } = useQuery(CONNECTIONS_QUERY)
  return (
    <>
      {loading || error ? (
        <Waiting loading={loading} error={error} />
      ) : (
        <Box margin="none">
          {data.connections.edges.map(({ node }: IConnectionEdge) => (
            <Row key={node.id} to={`/connections/${node.id}`}>
              <Box direction="row" align="center" pad="1rem">
                <Icon />
                <Paragraph margin="none">{node.theirLabel}</Paragraph>
              </Box>
            </Row>
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
