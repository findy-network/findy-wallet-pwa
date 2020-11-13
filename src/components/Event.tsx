import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Heading } from 'grommet'

import { useQuery, useMutation, gql } from '@apollo/client'
import Waiting from './Waiting'
import Job from './Job'

const nodeFragment = gql`
  fragment EventNodeFragment on Event {
    id
    read
    description
    createdMs
    connection {
      id
      theirLabel
    }
  }
`

const fullNodeFragment = gql`
  fragment FullEventNodeFragment on Event {
    ...EventNodeFragment
    job {
      ...JobEdgeFragment
    }
  }
  ${nodeFragment}
  ${Job.fragments.edge}
`

Event.fragments = {
  node: nodeFragment,
  fullNode: fullNodeFragment,
  edge: gql`
    fragment EventEdgeFragment on EventEdge {
      cursor
      node {
        ...EventNodeFragment
      }
    }
    ${nodeFragment}
  `,
  fullEdge: gql`
    fragment FullEventEdgeFragment on EventEdge {
      cursor
      node {
        ...FullEventNodeFragment
      }
    }
    ${fullNodeFragment}
  `,
}

const EVENT_QUERY = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
      ...EventNodeFragment
    }
  }
  ${Event.fragments.node}
`
const MARK_READ_MUTATION = gql`
  mutation MarkRead($input: MarkReadInput!) {
    markEventRead(input: $input) {
      ...EventNodeFragment
    }
  }
  ${Event.fragments.node}
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
  const node = data?.event

  useEffect(() => {
    if (!markingDone && !error && !loading) {
      if (!node.read) {
        markRead({ variables: { input: { id: node.id } } })
      }

      setMarkingDone(true)
    }
  }, [loading, error, node, markingDone, markRead])

  return (
    <>
      {loading || error ? (
        <Waiting loading={loading} error={error} />
      ) : (
        <>
          <Heading level={2}>{node.description}</Heading>
          <div>{node.read ? 'READ' : 'NOT READ'}</div>
        </>
      )}
    </>
  )
}

export default Event
