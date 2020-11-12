import React, { useState, useEffect } from 'react'

import { useReactiveVar } from '@apollo/client'

import { IEdge, IEventEdge, ProtocolType } from './Types'
import Notification from './Notification'
import client, { addedEventIdsVar, cache } from '../apollo'
import { EVENTS_QUERY } from './Home'
import Event from './Event'
import { useQuery, gql, DocumentNode } from '@apollo/client'
import { JOBS_QUERY } from './Jobs'
import { CONNECTIONS_QUERY } from './Connections'

const EVENTS_SUBSCRIPTION = gql`
  subscription OnEventAdded {
    eventAdded {
      ...EventEdgeFragment
    }
  }
  ${Event.fragments.edge}
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

const updateCacheWithNewItem = (
  newItem: IEdge,
  query: DocumentNode,
  last: boolean,
  itemName: string
) => {
  try {
    // this will throw if there are no items in cache
    const state: any = cache.readQuery({ query })
    const items = state[itemName]
    // Update only if the latest item is already fetched
    const doUpdate =
      (last && !items.pageInfo.hasPreviousPage) ||
      (!last && !items.pageInfo.hasNextPage)
    if (doUpdate) {
      const newState = stateWithNewItem(state, itemName, newItem, last)
      if (newState.updated) {
        client.writeQuery({ query, data: newState.state })
      }
    }
  } catch (e) {}
}

function EventNotifications() {
  const addedEventIds = useReactiveVar(addedEventIdsVar)
  const { data, subscribeToMore } = useQuery(EVENTS_QUERY, {
    fetchPolicy: 'cache-only',
  })
  const [subscribed, setSubscribed] = useState(false)

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
              updateCacheWithNewItem(node.job, JOBS_QUERY, false, 'jobs')
              const job = node.job.node
              if (job.protocol === ProtocolType.CONNECTION && job.connection) {
                updateCacheWithNewItem(
                  job.connection,
                  CONNECTIONS_QUERY,
                  false,
                  'connections'
                )
              }
            }
            addedEventIdsVar([...addedEventIdsVar(), node.id])
          }
          return newState.state
        },
      })
    }
  }, [subscribeToMore, subscribed])
  return (
    // TODO: hide previous notification when new one is displayed
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
