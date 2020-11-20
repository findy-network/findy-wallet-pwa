import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Box, Heading } from 'grommet'

import { useQuery, gql } from '@apollo/client'
import Waiting from './Waiting'

const nodeFragment = gql`
  fragment MessageNodeFragment on BasicMessage {
    id
    message
    sentByMe
    delivered
    createdMs
  }
`

Message.fragments = {
  node: nodeFragment,
  edge: gql`
    fragment MessageEdgeFragment on BasicMessageEdge {
      cursor
      node {
        ...MessageNodeFragment
      }
    }
    ${nodeFragment}
  `,
}

export const MESSAGE_QUERY = gql`
  query GetMessage($id: ID!) {
    message(id: $id) {
      ...MessageNodeFragment
    }
  }
  ${Message.fragments.node}
`

type TParams = { id: string }

function Message({ match }: RouteComponentProps<TParams>) {
  const { loading, error, data } = useQuery(MESSAGE_QUERY, {
    variables: {
      id: match.params.id,
    },
  })
  const node = data?.message
  return (
    <>
      {loading || error ? (
        <Waiting loading={loading} error={error} />
      ) : (
        <>
          <Heading level={2}>Message {node.id}</Heading>
          <Box>
            <Box>
              <div>Message</div>
              <div>{node.message}</div>
            </Box>
          </Box>
        </>
      )}
    </>
  )
}

export default Message
