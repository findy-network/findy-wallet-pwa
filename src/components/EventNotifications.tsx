import React, { useState, useEffect } from 'react'

import { useReactiveVar } from '@apollo/client'

import { IEventEdge } from './Types'
import Notification from './Notification'
import { addedEventIdsVar } from '../apollo'
import { EVENTS_QUERY } from './Home'
import Event from './Event'
import { useQuery, gql } from '@apollo/client'
import { fetchPolicyVar } from '../apollo'

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
          fetchPolicyVar('cache-first')

          const state = prev?.events ? prev : { events: { edges: [] } }
          if (!data) return state
          const newEvent = data.eventAdded
          const exists = state.events.edges.find(
            (item: IEventEdge) => item.node.id === newEvent.node.id
          )
          if (!exists) {
            const newState = {
              ...state,
              events: {
                ...state.events,
                edges: [...state.events.edges, newEvent],
                pageInfo: {
                  ...state.events.pageInfo,
                  endCursor: newEvent.cursor,
                },
              },
            }
            fetchPolicyVar('cache-and-network') // change default policy to network to get latest in view refresh
            addedEventIdsVar([...addedEventIdsVar(), newEvent.node.id])
            return newState
          }
          return prev
        },
      })
    }
  }, [subscribeToMore, subscribed])
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
