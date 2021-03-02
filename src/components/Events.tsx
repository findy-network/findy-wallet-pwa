import React from 'react'
import { Box, Button, Heading, Text } from 'grommet'
import { User, Fireball } from 'grommet-icons'

import { useQuery, gql } from '@apollo/client'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { IEventEdge } from './Types'
import Waiting from './Waiting'
import Unread from './Unread'
import Event from './Event'
import Utils from './Utils'
import { pageInfo } from './Fragments'

export const EVENTS_QUERY = gql`
  query GetEvents($cursor: String) {
    events(last: 5, before: $cursor) {
      edges {
        ...EventEdgeFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${Event.fragments.edge}
  ${pageInfo}
`

export const CONNECTION_EVENTS_QUERY = gql`
  query GetConnectionEvents($id: ID!, $cursor: String) {
    connection(id: $id) {
      events(last: 3, before: $cursor) {
        edges {
          ...EventEdgeFragment
        }
        pageInfo {
          ...PageInfoFragment
        }
      }
    }
  }
  ${Event.fragments.edge}
  ${pageInfo}
`

const RelativeBox = styled(Box)`
  position: relative;
  a {
    text-decoration: none;
  }
`

interface IProps {
  connectionId?: string
}

function Events({ connectionId }: IProps) {
  /*// TODO: for some reason we get react error for memory consumption
  // if useQuery is used, thus executing query after mount
  const [execQuery, { loading, error, data, fetchMore }] = useLazyQuery(
    EVENTS_QUERY
  )
  useEffect(() => {
    execQuery()
  }, [execQuery])*/

  const { loading, error, data, fetchMore } = useQuery(
    connectionId ? CONNECTION_EVENTS_QUERY : EVENTS_QUERY,
    {
      ...(connectionId ? { variables: { id: connectionId } } : {}),
    }
  )

  const doFetchMore = fetchMore || (() => { })
  const isLoading = loading || (!error && !data)
  const showWaiting = isLoading || error

  const events = data?.events || data?.connection?.events

  return (
    <Box height={{ min: 'initial' }}>
      {showWaiting ? (
        <Waiting loading={isLoading} error={error} />
      ) : (
          <RelativeBox margin="small">
            <Heading level={3}>Events</Heading>

            {[...events.edges].reverse().map(({ node }: IEventEdge) => (
              <Link key={node.id} to={`/events/${node.id}`}>
                <RelativeBox
                  background="light-1"
                  border="bottom"
                  pad="medium"
                  height={{ min: '8rem' }}
                >
                  <Unread show={!node.read} />
                  <Text>{Utils.toTimeString(node.createdMs)}</Text>
                  <Box direction="row" align="center">
                    <Box>
                      {node.connection ? (
                        <>
                          <User />
                          <Text>{node.connection.theirLabel}</Text>
                        </>
                      ) : (
                          <Fireball />
                        )}
                    </Box>
                    <Box>
                      <Heading margin="medium" level="4">
                        {node.description}
                      </Heading>
                    </Box>
                  </Box>
                </RelativeBox>
              </Link>
            ))}
            {events.pageInfo.hasPreviousPage && (
              <Button
                label="Load older"
                onClick={() =>
                  doFetchMore({
                    variables: {
                      cursor: events.pageInfo.startCursor,
                    },
                  })
                }
              ></Button>
            )}
          </RelativeBox>
        )}
    </Box>
  )
}

export default Events
