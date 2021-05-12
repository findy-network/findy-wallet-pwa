import React, { useContext, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Box, Button, Stack, TextInput, Keyboard } from 'grommet'
import styled from 'styled-components'

import { useQuery, gql } from '@apollo/client'
import Waiting from './Waiting'
import {
  pairwise as fragments,
  pageInfo,
  event as eventFragments,
} from './Fragments'
import { IEventEdge, ProtocolType } from './Types'
import Event from './Event'
import Job from './Job'
import { device, colors, chat } from '../theme'
import { useMutation } from '@apollo/client'

import ScrollableFeed from 'react-scrollable-feed'
import { SEND_MESSAGE_MUTATION, MARK_EVENTREAD_MUTATION } from './Queries'
import { LinkUp } from 'grommet-icons'
import { ConnectionContext } from './Navi'

export const CONNECTION_QUERY = gql`
  query GetConnection($id: ID!, $cursor: String) {
    connection(id: $id) {
      ...PairwiseNodeFragment
      events(last: 20, before: $cursor) {
        edges {
          ...FullEventEdgeFragment
        }
        pageInfo {
          ...PageInfoFragment
        }
      }
    }
  }
  ${fragments.node}
  ${eventFragments.fullEdge}
  ${pageInfo}
`

const Chat = styled(Box)`
  margin: 0 auto;
  height: 100%;
  width: 100%;
  @media ${device.tablet} {
    width: 60%;
  }
  position: relative;
  overflow: hidden;
`

const ChatContent = styled(Box)`
  position: absolute;
  width: 100%;
  max-height: 100%;
  bottom: 0;
  padding: 1px;
`

const InputStack = styled(Stack)`
  width: 100%;
  position: relative;
  min-height: ${chat.inputHeight};
  margin: ${chat.inputMargin};
`

const Input = styled(TextInput)`
  position: absolute;
  border-radius: ${chat.inputRadius};
  border: 1px solid ${colors.chatBorder};
  height: ${chat.inputHeight};
  z-index: 1;
`

const EnterIcon = styled(LinkUp)`
  stroke: ${colors.background};
`

const Send = styled(Button)`
  text-align: center;
  background: ${colors.brand};
  position: absolute;
  height: 100%;
  width: 60px;
  border-radius: ${chat.inputRadius};
  right: 0;
  z-index: 1;
  padding: 0;
  &:hover ${EnterIcon} {
    stroke: ${colors.selected};
  }
`

const MoreButton = styled(Button)`
  width: 100%;
  border-radius: 0;
  padding: 10px;
  box-shadow: 40px 0px 30px 10px ${colors.shadow};
`

type TParams = { id: string }

function Connection({ match }: RouteComponentProps<TParams>) {
  const { setConnection } = useContext(ConnectionContext)
  const { loading, error, data, fetchMore } = useQuery(CONNECTION_QUERY, {
    errorPolicy: 'all',
    variables: {
      id: match.params.id,
    },
    onCompleted: () => {
      complete()
    },
    onError: () => {
      if (data) {
        complete()
      }
    },
  })

  const complete = () => {
    const edges = data.connection.events.edges
    if (edges[edges.length - 1]) {
      setConnection(data.connection.theirLabel)
      markEvent({
        variables: {
          input: {
            id: edges[edges.length - 1].node.id,
          },
        },
      })
    }
  }

  const node = data?.connection
  const jobIds: Array<string> = []

  const [message, setMessage] = useState('')
  const [sendMessage] = useMutation(SEND_MESSAGE_MUTATION, {
    onCompleted: () => setMessage(''),
    onError: (e) => {
      console.log('ERROR: ' + e)
    },
  })

  const [markEvent] = useMutation(MARK_EVENTREAD_MUTATION, {
    onCompleted: (resp: any) => console.log(resp),
    onError: (e) => {
      console.log('ERROR ' + e)
    },
  })

  // TODO: figure out how we should render
  // jobs that receive multiple events
  const events = node?.events.edges.map((item: IEventEdge) => {
    if (item.node.job) {
      if (jobIds.includes(item.node.job.node.id)) {
        return { ...item, node: { ...item.node, job: null } }
      }
      jobIds.push(item.node.job.node.id)
    }
    return item
  })
  return (
    <>
      {loading || (error && !data) ? (
        <Waiting loading={loading} error={error} />
      ) : (
        <Chat>
          <ChatContent>
            <ScrollableFeed forceScroll={true}>
              {data.connection.events.pageInfo.hasPreviousPage && (
                <MoreButton
                  hoverIndicator={{ color: colors.focus, opacity: 'medium' }}
                  label="Load more"
                  onClick={() =>
                    fetchMore({
                      variables: {
                        cursor: data.connection.events.pageInfo.startCursor,
                      },
                    })
                  }
                ></MoreButton>
              )}
              {events.map(({ node }: IEventEdge) => (
                <Box
                  animation={{ type: 'fadeIn', duration: 1500 }}
                  key={node.id}
                >
                  {node.job && node.job?.node.protocol !== ProtocolType.NONE ? (
                    <Job job={node.job.node} />
                  ) : (
                    <Event node={node} />
                  )}
                </Box>
              ))}
            </ScrollableFeed>
            <InputStack>
              <Keyboard
                onEnter={() => {
                  if (message !== '') {
                    sendMessage({
                      variables: {
                        input: {
                          message: message,
                          connectionId: match.params.id,
                        },
                      },
                    })
                  }
                }}
              >
                <Input
                  placeholder="Type your answer here..."
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                />
              </Keyboard>
              <Send
                type="submit"
                icon={<EnterIcon />}
                onClick={() => {
                  if (message !== '') {
                    sendMessage({
                      variables: {
                        input: {
                          message: message,
                          connectionId: match.params.id,
                        },
                      },
                    })
                  }
                }}
              ></Send>
            </InputStack>
          </ChatContent>
        </Chat>
      )}
    </>
  )
}

export default Connection
