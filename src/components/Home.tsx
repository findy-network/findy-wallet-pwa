import React, { useEffect } from 'react'
import { Box, Button, Heading, Text } from 'grommet'
import { User, Fireball } from 'grommet-icons'

import { useLazyQuery, gql } from '@apollo/client'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { IEventEdge } from './Types'
import Waiting from './Waiting'
import Unread from './Unread'
import Event from './Event'

import { fetchPolicyVar } from '../apollo'

export const EVENTS_QUERY = gql`
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

const RelativeBox = styled(Box)`
  position: relative;
  a {
    text-decoration: none;
  }
`

function Home() {
  // TODO: for some reason we get react error for memory consumption
  // if useQuery is used, thus executing query after mount
  const [
    execQuery,
    { loading, error, data, fetchMore },
  ] = useLazyQuery(EVENTS_QUERY, { fetchPolicy: fetchPolicyVar() })
  useEffect(() => {
    execQuery()
  }, [execQuery])

  const doFetchMore = fetchMore || (() => {})
  const isLoading = loading || (!error && !data)
  const showWaiting = isLoading || error

  return (
    <>
      <Heading level={2}>Home</Heading>
      {showWaiting ? (
        <Waiting loading={isLoading} error={error} />
      ) : (
        <RelativeBox margin="small">
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
                doFetchMore({
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
