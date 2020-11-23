import React, { useEffect } from 'react'
import { Box, Button, Heading, Text } from 'grommet'
import { Chat } from 'grommet-icons'

import { useLazyQuery, gql } from '@apollo/client'

import { IMessageEdge } from './Types'
import { Link } from 'react-router-dom'
import Message from './Message'
import Waiting from './Waiting'
import Utils from './Utils'

export const MESSAGES_QUERY = gql`
  query GetMessages($id: ID!, $cursor: String) {
    connection(id: $id) {
      messages(first: 3, after: $cursor) {
        edges {
          ...MessageEdgeFragment
        }
        pageInfo {
          ...PageInfoFragment
        }
      }
    }
  }
  ${Message.fragments.edge}
  ${Utils.fragments.pageInfo}
`

interface IProps {
  connectionId: string
}

function Messages({ connectionId }: IProps) {
  const [execQuery, { loading, error, data, fetchMore }] = useLazyQuery(
    MESSAGES_QUERY
  )
  useEffect(() => {
    execQuery({
      variables: {
        id: connectionId,
      },
    })
  }, [execQuery, connectionId])

  const doFetchMore = fetchMore || (() => {})
  const isLoading = loading || (!error && !data)
  const showWaiting = isLoading || error

  return (
    <Box>
      <Heading level={2}>Messages</Heading>
      {showWaiting ? (
        <Waiting loading={loading} error={error} />
      ) : (
        <Box margin="small">
          {data.connection.messages.edges.map(
            ({ node }: IMessageEdge, index: number) => (
              <Link key={node.id} to={`/messages/${node.id}`}>
                <Box
                  background="light-1"
                  direction="row"
                  align="center"
                  pad="medium"
                  border="bottom"
                  height={{ min: '8rem' }}
                >
                  <Chat />
                  <Box>
                    <Text>{`${index + 1}. ${Utils.toTimeString(
                      node.createdMs
                    )}`}</Text>
                    <Heading margin="medium" level="6">
                      {node.message}
                    </Heading>
                  </Box>
                </Box>
              </Link>
            )
          )}
          {data.connection.messages.pageInfo.hasNextPage && (
            <Button
              label="Load more"
              onClick={() =>
                doFetchMore({
                  variables: {
                    id: connectionId,
                    cursor: data.connection.messages.pageInfo.endCursor,
                  },
                })
              }
            ></Button>
          )}
        </Box>
      )}
    </Box>
  )
}

export default Messages
