import { Dispatch, SetStateAction } from 'react'
import { Box, Button, Stack, Paragraph as P } from 'grommet'
import styled from 'styled-components'
import { useQuery, gql } from '@apollo/client'
import { NavLink } from 'react-router-dom'

import { IConnectionEdge } from './Types'
import Waiting from './Waiting'
import { pageInfo } from './Fragments'
import { pairwise as fragments } from './Fragments'
import { colors } from '../theme'
import { ReactComponent as PersonIcon } from '../theme/person-icon.svg'

export const CONNECTIONS_QUERY = gql`
  query GetConnections($cursor: String) {
    connections(last: 10, before: $cursor) {
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

const Container = styled(Box)`
  .nav-item {
    text-decoration: none;
    border-left: 3px solid transparent;
    color: ${colors.inactive};
    svg {
      stroke: ${colors.inactive};
    }
  }
  .nav-item-active {
    border-left: 3px solid ${colors.selected};
    color: ${colors.active};
    svg {
      stroke: ${colors.selected};
      circle {
        ${() => `fill: ${colors.selected}`};
        ${() => `stroke: ${colors.selected}`};
      }
    }
  }
`

const Paragraph = styled(P)`
  font-size: 0.95rem;
  font-weight: 500;
`

const Icon = styled(PersonIcon)`
  circle {
    ${() => `fill: ${colors.inactive}`};
    ${() => `stroke: ${colors.inactive}`};
  }
  padding-right: 12px;
  vertical-align: middle;
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
  hideMenu?: Dispatch<SetStateAction<boolean>>
}) {
  const { loading, error, data, fetchMore } = useQuery(CONNECTIONS_QUERY)

  // Reverse order so that last connection is displayed first.
  // Add numbers to similar names. TODO: backend should do this.
  const names: { [key: string]: number } = {}
  const items = [...(data?.connections?.edges || [])].reverse().map((item) => {
    const name = item.node.theirLabel
    if (names[name]) {
      names[name] += 1
    } else {
      names[name] = 1
    }
    return {
      ...item,
      node: {
        ...item.node,
        theirLabel: `${name} ${names[name] > 1 ? `(${names[name]})` : ''}`,
      },
    }
  })

  return (
    <>
      {loading || error ? (
        <Waiting loading={loading} error={error} />
      ) : (
        <Container margin="none">
          {items.map(({ node }: IConnectionEdge) => (
            <NavLink
              onClick={() => {
                hideMenu!(false)
              }}
              key={node.id}
              to={`/connections/${node.id}`}
              className={({ isActive }) =>
                isActive ? 'nav-item nav-item-active' : 'nav-item'
              }
            >
              <Box direction="row" align="center" pad="1rem">
                <Stack anchor="top-right">
                  <Icon width="30px" height="30px" />
                  {node.events?.nodes[0] && !node.events?.nodes[0].read && (
                    <RedDot />
                  )}
                </Stack>
                <Paragraph id={`conn-${node.id}`} margin="none">
                  {node.theirLabel}
                </Paragraph>
              </Box>
            </NavLink>
          ))}
          {data.connections.pageInfo.hasPreviousPage && (
            <Button
              label="Load more"
              onClick={() =>
                fetchMore({
                  variables: {
                    cursor: data.connections.pageInfo.startCursor,
                  },
                })
              }
            ></Button>
          )}
        </Container>
      )}
    </>
  )
}

export default Connections
