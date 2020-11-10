import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Heading } from 'grommet'

import { useQuery, useMutation, gql } from '@apollo/client'
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
      job {
        id
        protocol
        protocolId
        initiatedByUs
        connection {
          id
        }
        status
        result
        createdMs
        updatedMs
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
const MARK_READ_MUTATION = gql`
  mutation MarkRead($input: MarkReadInput!) {
    markEventRead(input: $input) {
      ...EventDataFragment
    }
  }
  ${Event.fragments.data}
`

type TParams = { id: string }

function Event({ match }: RouteComponentProps<TParams>) {
  const [markingDone, setMarkingDone] = useState(false)
  const { loading, error, data } = useQuery(EVENT_QUERY, {
    variables: {
      id: match.params.id,
    },
  })
  const [markRead] = useMutation(MARK_READ_MUTATION)
  useEffect(() => {
    if (!markingDone && !error && !loading) {
      if (!data.event.read) {
        markRead({ variables: { input: { id: data.event.id } } })
      }

      setMarkingDone(true)
    }
  }, [loading, error, data, markingDone, markRead])

  return (
    <>
      {loading || error ? (
        <Waiting loading={loading} error={error} />
      ) : (
        <>
          <Heading level={2}>{data.event.description}</Heading>
          <div>{data.event.read ? 'READ' : 'NOT READ'}</div>
        </>
      )}
    </>
  )
}

export default Event
