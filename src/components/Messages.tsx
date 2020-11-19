import React from 'react'
import { Box, Button, Heading } from 'grommet'
import { User } from 'grommet-icons'

import { useQuery, gql } from '@apollo/client'

import { IMessageEdge } from './Types'
import { Link } from 'react-router-dom'
import Message from './Message'
import Waiting from './Waiting'
import Utils from './Utils'

export const MESSAGES_QUERY = gql`
  query GetMessages($id: ID!, $cursor: String) {
    connection(id: $id) {
      messages(first: 1, after: $cursor) {
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
  const { loading, error, data, fetchMore } = useQuery(MESSAGES_QUERY, {
    variables: {
      id: connectionId,
    },
  })

  return (
    <>
      <Heading level={2}>Messages</Heading>
      {loading || error ? (
        <Waiting loading={loading} error={error} />
      ) : (
        <Box margin="small">
          {data.connection.messages.edges.map(({ node }: IMessageEdge) => (
            <Link key={node.id} to={`/messages/${node.id}`}>
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
                  {node.message}
                </Heading>
              </Box>
            </Link>
          ))}
          {data.connection.messages.pageInfo.hasNextPage && (
            <Button
              label="Load more"
              onClick={() =>
                fetchMore({
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
    </>
  )
}

export default Messages
