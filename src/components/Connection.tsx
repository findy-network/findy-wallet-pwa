import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Box, Heading } from 'grommet'

import { useQuery, gql } from '@apollo/client'
import Waiting from './Waiting'
import {
  pairwise as fragments,
  pageInfo,
  event as eventFragments,
} from './Fragments'
import { IEventEdge, ProtocolType } from './Types'
import Job from './Job'

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

type TParams = { id: string }

function Connection({ match }: RouteComponentProps<TParams>) {
  const { loading, error, data } = useQuery(CONNECTION_QUERY, {
    variables: {
      id: match.params.id,
    },
  })
  const node = data?.connection
  const jobIds: Array<string> = []

  // TODO: figure out how we should render
  // jobs that receive multiple events
  const events = node?.events.edges.map((item: IEventEdge) => {
    if (item.node.job) {
      if (jobIds.includes(item.node.job.node.id)) {
        return { ...item, node: { ...item.node, job: null } }
      }
      jobIds.push(item.node.job.node.id)
    }
    return item
  })
  return (
    <>
      {loading || error ? (
        <Waiting loading={loading} error={error} />
      ) : (
        <Box>
          <Heading level={2}>Connection {node.theirLabel}</Heading>
          <Box>
            {events.map(({ node }: IEventEdge) => (
              <div key={node.id}>
                {node.job && node.job?.node.protocol !== ProtocolType.NONE ? (
                  <div>
                    <Job job={node.job.node} />
                  </div>
                ) : (
                  `Event: ${node.description}`
                )}
              </div>
            ))}
          </Box>
        </Box>
      )}
    </>
  )
}

export default Connection
