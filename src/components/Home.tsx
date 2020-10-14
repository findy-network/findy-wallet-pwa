import React, { useEffect, useState } from 'react'
import { Box, Button, Heading, Text } from 'grommet'
import { User, Fireball } from 'grommet-icons'

import { useQuery, gql } from '@apollo/client'

import { IEventEdge } from './Types'
import Waiting from './Waiting'

const EVENTS_QUERY = gql`
  query GetEvents($cursor: String) {
    events(last: 5, before: $cursor) {
      edges {
        cursor
        node {
          id
          description
          createdMs
          connection {
            id
            theirLabel
          }
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
`

const EVENTS_SUBSCRIPTION = gql`
  subscription OnEventAdded {
    eventAdded {
      cursor
      node {
        id
        description
        createdMs
        connection {
          id
          theirLabel
        }
      }
    }
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
        updateQuery: (prev, { subscriptionData: { data } }) => {
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
        <Box margin="small">
          {[...data.events.edges].reverse().map(({ node }: IEventEdge) => (
            <Box
              key={node.id}
              background="light-1"
              border="bottom"
              pad="medium"
              height={{ min: '8rem' }}
            >
              <Text>
                {new Date(parseInt(node.createdMs, 10) * 1000).toLocaleString()}
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
            </Box>
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
        </Box>
      )}
    </>
  )
}

export default Home
