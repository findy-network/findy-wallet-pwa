import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Button, Stack, TextInput, Keyboard } from 'grommet'
import styled from 'styled-components'

import { useQuery, useMutation, gql, makeVar } from '@apollo/client'
import Waiting from './Waiting'
import {
  pairwise as fragments,
  pageInfo,
  event as eventFragments,
} from './Fragments'
import { IEventEdge, ProtocolType } from './Types'
import Job from './Job'
import { device, colors, chat } from '../theme'

import { SEND_MESSAGE_MUTATION, MARK_EVENTREAD_MUTATION } from './Queries'
import { LinkUp } from 'grommet-icons'

export const activeConnectionName = makeVar('')

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
  margin: auto;
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

const Container = styled.div`
  max-height: inherit;
  height: inherit;
  overflow-y: auto;
}`

function Connection() {
  const params = useParams()
  const navigate = useNavigate()
  const [markEvent] = useMutation(MARK_EVENTREAD_MUTATION, {
    onCompleted: (resp: any) => {
      //console.log(resp)
    },
    onError: (e) => {
      console.log('ERROR: ' + e)
    },
  })
  const { loading, error, data, fetchMore } = useQuery(CONNECTION_QUERY, {
    variables: {
      id: params.id,
    },
    onCompleted: (data) => {
      const edges = data.connection.events.edges
      activeConnectionName(data.connection.theirLabel)
      if (edges[edges.length - 1]) {
        markEvent({
          variables: {
            input: {
              id: edges[edges.length - 1].node.id,
            },
          },
        })
      }
    },
    onError: () => {
      navigate(`/`)
    },
  })

  const node = data?.connection
  const jobIds: Array<string> = []

  const [message, setMessage] = useState('')
  const [sendMessage] = useMutation(SEND_MESSAGE_MUTATION, {
    onCompleted: () => setMessage(''),
    onError: (e) => {
      console.log('ERROR: ' + e)
    },
  })

  const events = node?.events.edges.map((item: IEventEdge) => {
    if (item.node.job) {
      if (jobIds.includes(item.node.job.node.id)) {
        return { ...item, node: { ...item.node, job: null } }
      }
      jobIds.push(item.node.job.node.id)
    }
    return item
  })

  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [events])

  return (
    <>
      {loading || (error && !data) ? (
        <Waiting loading={loading} error={error} />
      ) : (
        <Chat>
          <ChatContent>
            <Container>
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
              {events.map(({ node }: IEventEdge, index: number) => (
                <Box
                  animation={{ type: 'fadeIn', duration: 1500 }}
                  key={node.id}
                >
                  {node.job &&
                    node.job?.node.protocol !== ProtocolType.NONE && (
                      <Job job={node.job.node} index={index} />
                    )}
                </Box>
              ))}
              <div ref={bottomRef}></div>
            </Container>
            <InputStack>
              <Keyboard
                onEnter={() => {
                  if (message !== '') {
                    sendMessage({
                      variables: {
                        input: {
                          message: message,
                          connectionId: params.id,
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
                          connectionId: params.id,
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
