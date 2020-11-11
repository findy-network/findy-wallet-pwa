import React, { useState, useEffect } from 'react'

import { useReactiveVar } from '@apollo/client'

import { IEdge, IEventEdge, ProtocolType } from './Types'
import Notification from './Notification'
import client, { addedEventIdsVar, cache } from '../apollo'
import { EVENTS_QUERY } from './Home'
import Event from './Event'
import { useQuery, useLazyQuery, gql } from '@apollo/client'
import { JOB_QUERY } from './Job'
import { JOBS_QUERY } from './Jobs'
import { CONNECTION_QUERY } from './Connection'
import { CONNECTIONS_QUERY } from './Connections'

const EVENTS_SUBSCRIPTION = gql`
  subscription OnEventAdded {
    eventAdded {
      cursor
      ...EventNodeFragment
    }
  }
  ${Event.fragments.data}
`

const stateWithNewItem = (
  prevState: any,
  itemName: string,
  newItem: IEdge,
  last: boolean
) => {
  const state =
    prevState && prevState[itemName] ? prevState : { [itemName]: { edges: [] } }
  const items = state[itemName]
  // No need to add item if it is already there
  if (
    !newItem ||
    items.edges.find((item: IEdge) => item.node.id === newItem.node.id)
  ) {
    return { state, updated: false }
  }
  return {
    state: {
      ...state,
      [itemName]: {
        ...items,
        edges: [...items.edges, newItem],
        pageInfo: {
          ...items.pageInfo,
          ...(last
            ? { endCursor: newItem.cursor }
            : { startCursor: newItem.cursor }),
        },
      },
    },
    updated: true,
  }
}

function EventNotifications() {
  const addedEventIds = useReactiveVar(addedEventIdsVar)
  const { data, subscribeToMore } = useQuery(EVENTS_QUERY, {
    fetchPolicy: 'cache-only',
  })
  const [subscribed, setSubscribed] = useState(false)

  const [execJobQuery] = useLazyQuery(JOB_QUERY, {
    onCompleted: (jobData) => {
      try {
        // this will throw if there are no items in cache
        const state: any = cache.readQuery({ query: JOBS_QUERY })
        if (!state.jobs.pageInfo.hasNextPage) {
          const newState = stateWithNewItem(state, 'jobs', jobData.job, false)
          if (newState.updated) {
            client.writeQuery({ query: JOBS_QUERY, data: newState.state })
          }
        }
      } catch (e) {}
    },
  })

  const [execConnectionQuery] = useLazyQuery(CONNECTION_QUERY, {
    onCompleted: (connectionData) => {
      try {
        // this will throw if there are no items in cache
        const state: any = cache.readQuery({ query: CONNECTIONS_QUERY })
        if (!state.connections.pageInfo.hasNextPage) {
          const newState = stateWithNewItem(
            state,
            'connections',
            connectionData.connection,
            false
          )
          if (newState.updated) {
            client.writeQuery({
              query: CONNECTIONS_QUERY,
              data: newState.state,
            })
          }
        }
      } catch (e) {}
    },
  })

  useEffect(() => {
    if (!subscribed) {
      setSubscribed(true)
      subscribeToMore({
        document: EVENTS_SUBSCRIPTION,
        updateQuery: (prev: any, { subscriptionData: { data } }: any) => {
          const newState = stateWithNewItem(
            prev,
            'events',
            data.eventAdded,
            true
          )
          if (newState.updated) {
            const { node }: IEventEdge = data.eventAdded
            if (node.job) {
              execJobQuery({
                variables: {
                  id: node.job.id,
                },
              })
              if (
                node.job.protocol === ProtocolType.CONNECTION &&
                node.job.protocolId
              ) {
                execConnectionQuery({
                  variables: {
                    id: node.job.protocolId,
                  },
                })
              }
            }
            addedEventIdsVar([...addedEventIdsVar(), node.id])
          }
          return newState.state
        },
      })
    }
  }, [subscribeToMore, subscribed, execJobQuery, execConnectionQuery])
  return (
    <>
      {data &&
        data.events.edges
          .filter((item: IEventEdge) => addedEventIds.includes(item.node.id))
          .map((item: IEventEdge) => (
            <Notification
              key={item.node.id}
              text={item.node.description}
              onClose={() => {
                const newItems = addedEventIds.filter((i) => i !== item.node.id)
                addedEventIdsVar(newItems)
              }}
            />
          ))}
    </>
  )
}

export default EventNotifications
