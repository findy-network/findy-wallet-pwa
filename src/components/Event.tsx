import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Heading } from 'grommet'

import { useQuery, gql } from '@apollo/client'
import Waiting from './Waiting'

Event.fragments = {
  data: gql`
    fragment EventDataFragment on Event {
      id
      read
      description
      createdMs
      connection {
        id
        theirLabel
      }
    }
  `,
}

const EVENT_QUERY = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
      ...EventDataFragment
    }
  }
  ${Event.fragments.data}
`

type TParams = { id: string }

function Event({ match }: RouteComponentProps<TParams>) {
  const { loading, error, data } = useQuery(EVENT_QUERY, {
    variables: {
      id: match.params.id,
    },
  })
  return (
    <>
      {loading || error ? (
        <Waiting loading={loading} error={error} />
      ) : (
        <>
          <Heading level={2}>{data.event.description}</Heading>
        </>
      )}
    </>
  )
}

export default Event
