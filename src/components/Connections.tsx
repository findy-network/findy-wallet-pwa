import React, { Dispatch, SetStateAction } from 'react'
import { Box, Button, Stack, Paragraph as P } from 'grommet'
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

const RedDot = styled(Box)`
  background: ${colors.eventDot};
  border-radius: 50%;
  width: 10px;
  height: 10px;
`

function Connections({
  hideMenu,
}: {
  hideMenu: Dispatch<SetStateAction<boolean>>
}) {
  const { loading, error, data, fetchMore } = useQuery(CONNECTIONS_QUERY)
  return (
    <>
      {loading || error ? (
        <Waiting loading={loading} error={error} />
      ) : (
        <Box margin="none">
          {data.connections.edges.map(({ node }: IConnectionEdge) => (
            <Row
              onClick={() => hideMenu(false)}
              key={node.id}
              to={`/connections/${node.id}`}
            >
              <Box direction="row" align="center" pad="1rem">
                <Stack anchor="top-right">
                  <Icon />
                  {node.events?.nodes[0] && !node.events?.nodes[0].read && (
                    <RedDot />
                  )}
                </Stack>
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
