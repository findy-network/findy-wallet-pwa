import React, { useState, useEffect } from 'react'

import { DataProxy } from '@apollo/client'

import {
  IEdge,
  IEventEdge,
  IJobEdge,
  JobResult,
  JobStatus,
  ProtocolType,
} from './Types'
import client, { addedEventIdsVar, cache } from '../apollo'
import { useQuery, gql } from '@apollo/client'
import { CONNECTIONS_QUERY } from './Connections'
import {
  MESSAGES_QUERY,
  PROOFS_QUERY,
  CONNECTION_JOBS_QUERY,
  JOBS_QUERY,
  EVENTS_QUERY,
  CONNECTION_EVENTS_QUERY,
} from './Queries'
import { CREDENTIALS_QUERY, CONNECTION_CREDENTIALS_QUERY } from './Credentials'
import { event as eventFragments } from './Fragments'

const EVENTS_SUBSCRIPTION = gql`
  subscription OnEventAdded {
    eventAdded {
      ...FullEventEdgeFragment
    }
  }
  ${eventFragments.fullEdge}
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
  query: DataProxy.Query<any, any>,
  last: boolean,
  parentName: string, // TODO: refactor nested items handling
  itemName: string
) => {
  const updateState = (prevState: any) => {
    const newState = stateWithNewItem(prevState, itemName, newItem, last)
    if (newState.updated) {
      if (!parentName) {
        client.writeQuery({ ...query, data: newState.state })
      } else {
        const wState = { [parentName]: newState.state }
        client.writeQuery({ ...query, data: wState })
      }
    }
  }
  try {
    // this will throw if there are no items in cache
    const state: any = parentName
      ? cache.readQuery(query)[parentName]
      : cache.readQuery(query)
    const items = state[itemName]
    // Update only if the latest item is already fetched
    if (!items.pageInfo.hasNextPage) {
      updateState(state)
    }
  } catch (e) {
    updateState({})
  }
}

const updateProtocolItem = (connectionID: string, jobEdge: IJobEdge) => {
  const job = jobEdge.node

  // Update cached data for single connection jobs
  updateCacheWithNewItem(
    jobEdge,
    { query: CONNECTION_JOBS_QUERY, variables: { id: connectionID } },
    false,
    'connection',
    'jobs'
  )

  if (job.protocol === ProtocolType.CONNECTION && job.output.connection) {
    // Update cached data for all connections
    updateCacheWithNewItem(
      job.output.connection,
      { query: CONNECTIONS_QUERY },
      false,
      '',
      'connections'
    )
  } else if (
    job.protocol === ProtocolType.BASIC_MESSAGE &&
    job.output.message
  ) {
    // Update cached data for single connection messages
    updateCacheWithNewItem(
      job.output.message,
      { query: MESSAGES_QUERY, variables: { id: connectionID } },
      false,
      'connection',
      'messages'
    )
  } else if (
    job.protocol === ProtocolType.CREDENTIAL &&
    job.output.credential &&
    job.status === JobStatus.COMPLETE &&
    job.result === JobResult.SUCCESS
  ) {
    // Update cached data for all credentials
    updateCacheWithNewItem(
      job.output.credential,
      { query: CREDENTIALS_QUERY },
      false,
      '',
      'credentials'
    )
    // Update cached data for single connection credentials
    updateCacheWithNewItem(
      job.output.credential,
      {
        query: CONNECTION_CREDENTIALS_QUERY,
        variables: { id: connectionID },
      },
      false,
      'connection',
      'credentials'
    )
  } else if (
    job.protocol === ProtocolType.PROOF &&
    job.output.proof &&
    job.status === JobStatus.COMPLETE &&
    job.result === JobResult.SUCCESS
  ) {
    // Update cached data for single connection proofs
    updateCacheWithNewItem(
      job.output.proof,
      { query: PROOFS_QUERY, variables: { id: connectionID } },
      false,
      'connection',
      'proofs'
    )
  }
}

function EventNotifications() {
  /* const addedEventIds = useReactiveVar(addedEventIdsVar)*/
  const { /*data,*/ subscribeToMore } = useQuery(EVENTS_QUERY, {
    fetchPolicy: 'cache-only',
  })
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    if (!subscribed) {
      setSubscribed(true)
      subscribeToMore({
        document: EVENTS_SUBSCRIPTION,
        updateQuery: (prev: any, { subscriptionData: { data } }: any) => {
          console.debug('EVENT', data?.eventAdded?.node?.description)
          // This function updates cache when new events are received from the server.
          // The user does not need to refresh e.g. connection view but views
          // are automatically updated with established connection data.
          const newState = stateWithNewItem(
            prev,
            'events',
            data.eventAdded,
            true
          )
          if (newState.updated) {
            const { node }: IEventEdge = data.eventAdded
            const { connection } = data.eventAdded.node
            // Update cached data for single connection events
            if (connection) {
              updateCacheWithNewItem(
                data.eventAdded,
                {
                  query: CONNECTION_EVENTS_QUERY,
                  variables: { id: connection.id },
                },
                true,
                'connection',
                'events'
              )
            }
            if (node.job) {
              // Update cached data for all jobs
              updateCacheWithNewItem(
                node.job,
                { query: JOBS_QUERY },
                false,
                '',
                'jobs'
              )
              if (node.connection) {
                updateProtocolItem(node.connection.id, node.job)
              }
            }
            addedEventIdsVar([...addedEventIdsVar(), node.id])
          }
          return newState.state // new state for all events
        },
      })
    }
  }, [subscribeToMore, subscribed])
  return <>{/* TODO: show notification of new event? */}</>
}

export default EventNotifications
