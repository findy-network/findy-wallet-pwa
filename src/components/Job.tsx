import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Box, Heading } from 'grommet'

import { useQuery, gql } from '@apollo/client'
import Waiting from './Waiting'
import Connection from './Connection'

const nodeFragment = gql`
  fragment JobNodeFragment on Job {
    id
    protocol
    initiatedByUs
    status
    result
    createdMs
    updatedMs
    output {
      connection {
        ...PairwiseEdgeFragment
      }
    }
  }
  ${Connection.fragments.edge}
`

Job.fragments = {
  node: nodeFragment,
  edge: gql`
    fragment JobEdgeFragment on JobEdge {
      node {
        ...JobNodeFragment
      }
      cursor
    }
    ${nodeFragment}
  `,
}

export const JOB_QUERY = gql`
  query GetJob($id: ID!) {
    job(id: $id) {
      ...JobNodeFragment
    }
  }
  ${Job.fragments.node}
`

type TParams = { id: string }

function Job({ match }: RouteComponentProps<TParams>) {
  const { loading, error, data } = useQuery(JOB_QUERY, {
    variables: {
      id: match.params.id,
    },
  })
  const node = data?.job
  return (
    <>
      {loading || error ? (
        <Waiting loading={loading} error={error} />
      ) : (
        <>
          <Heading level={2}>Job {node.id}</Heading>
          <Box></Box>
        </>
      )}
    </>
  )
}

export default Job
