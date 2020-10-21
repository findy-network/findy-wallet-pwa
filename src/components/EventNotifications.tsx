import React from 'react'

import { useReactiveVar } from '@apollo/client'

import { IEventEdge } from './Types'
import Notification from './Notification'
import { addedEventIdsVar } from '../apollo'

interface IProps {
  events: IEventEdge[]
}

function EventNotifications({ events }: IProps) {
  const addedEventIds = useReactiveVar(addedEventIdsVar)
  return (
    <>
      {events
        .filter((item) => addedEventIds.includes(item.node.id))
        .map((item) => (
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
