import React, { useEffect, useState } from 'react'
import { Box, Button, Heading, Text } from 'grommet'
import { User, Fireball } from 'grommet-icons'

import { useQuery, gql } from '@apollo/client'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { IEventEdge } from './Types'
import EventNotifications from './EventNotifications'
import Waiting from './Waiting'
import { addedEventIdsVar } from '../apollo'
import Unread from './Unread'
import Event from './Event'

const EVENTS_QUERY = gql`
  query GetEvents($cursor: String) {
    events(last: 5, before: $cursor) {
      edges {
        cursor
        node {
          ...EventDataFragment
        }
      }
      pageInfo {
        endCursor
        startCursor
        hasPreviousPage
        hasNextPage
      }
    }
  }
  ${Event.fragments.data}
`

const EVENTS_SUBSCRIPTION = gql`
  subscription OnEventAdded {
    eventAdded {
      cursor
      node {
        ...EventDataFragment
      }
    }
  }
  ${Event.fragments.data}
`

const RelativeBox = styled(Box)`
  position: relative;
  a {
    text-decoration: none;
  }
`

function Home() {
  const { loading, error, data, fetchMore, subscribeToMore } = useQuery(
    EVENTS_QUERY,
    {
      nextFetchPolicy: 'cache-only',
    }
  )

  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    if (!subscribed) {
      subscribeToMore({
        document: EVENTS_SUBSCRIPTION,
        updateQuery: (prev: any, { subscriptionData: { data } }: any) => {
          if (!data) return prev
          const newEvent = data.eventAdded
          const exists = prev.events.edges.find(
            (item: IEventEdge) => item.node.id === newEvent.node.id
          )

          if (!exists) {
            const newState = {
              ...prev,
              events: {
                ...prev.events,
                edges: [...prev.events.edges, newEvent],
                pageInfo: {
                  ...prev.events.pageInfo,
                  endCursor: newEvent.cursor,
                },
              },
            }
            addedEventIdsVar([...addedEventIdsVar(), newEvent.node.id])
            return newState
          }
          return prev
        },
      })
      setSubscribed(true)
    }
  }, [subscribeToMore, subscribed])

  return (
    <>
      <Heading level={2}>Home</Heading>
      {loading || error ? (
        <Waiting loading={loading} error={error} />
      ) : (
        <RelativeBox margin="small">
          <EventNotifications events={data.events.edges} />
          {[...data.events.edges].reverse().map(({ node }: IEventEdge) => (
            <Link key={node.id} to={`/events/${node.id}`}>
              <RelativeBox
                background="light-1"
                border="bottom"
                pad="medium"
                height={{ min: '8rem' }}
              >
                <Unread show={!node.read} />
                <Text>
                  {new Date(
                    parseInt(node.createdMs, 10) * 1000
                  ).toLocaleString()}
                </Text>
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
          {data.events.pageInfo.hasPreviousPage && (
            <Button
              label="Load older"
              onClick={() =>
                fetchMore({
                  variables: {
                    cursor: data.events.pageInfo.startCursor,
                  },
                })
              }
            ></Button>
          )}
        </RelativeBox>
      )}
    </>
  )
}

export default Home
