import React from 'react'
import { Box, Button, Heading } from 'grommet'

import { useQuery, gql } from '@apollo/client'

import { IJobEdge } from './Types'
import { Link } from 'react-router-dom'
import Waiting from './Waiting'
import Job from './Job'
import Utils from './Utils'

export const JOBS_QUERY = gql`
  query GetJobs($cursor: String) {
    jobs(first: 2, after: $cursor) {
      edges {
        ...JobEdgeFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${Job.fragments.edge}
  ${Utils.fragments.pageInfo}
`

export const CONNECTION_JOBS_QUERY = gql`
  query GetConnectionJobs($id: ID!, $cursor: String) {
    connection(id: $id) {
      jobs(first: 3, after: $cursor) {
        edges {
          ...JobEdgeFragment
        }
        pageInfo {
          ...PageInfoFragment
        }
      }
    }
  }
  ${Job.fragments.edge}
  ${Utils.fragments.pageInfo}
`

interface IProps {
  connectionId?: string
}

function Jobs({ connectionId }: IProps) {
  const { loading, error, data, fetchMore } = useQuery(
    connectionId ? CONNECTION_JOBS_QUERY : JOBS_QUERY,
    {
      ...(connectionId ? { variables: { id: connectionId } } : {}),
    }
  )
  const isLoading = loading || (!error && !data)
  const showWaiting = isLoading || error

  const jobs = data?.jobs || data?.connection?.jobs

  return (
    <div>
      {showWaiting ? (
        <Waiting loading={loading} error={error} />
      ) : (
        <>
          {jobs.edges.length > 0 && <Heading level={3}>Jobs</Heading>}
          <Box margin="small">
            {jobs.edges.map(({ node }: IJobEdge) => (
              <Link key={node.id} to={`/jobs/${node.id}`}>
                <Box
                  background="light-1"
                  direction="column"
                  align="center"
                  pad="medium"
                  border="bottom"
                  height={{ min: '8rem' }}
                >
                  <div>Created {Utils.toTimeString(node.createdMs)}</div>
                  <div>
                    {node.protocol}: {node.status}
                  </div>
                </Box>
              </Link>
            ))}
            {jobs.pageInfo.hasNextPage && (
              <Button
                label="Load more"
                onClick={() =>
                  fetchMore({
                    variables: {
                      cursor: jobs.pageInfo.endCursor,
                    },
                  })
                }
              ></Button>
            )}
          </Box>
        </>
      )}
    </div>
  )
}

export default Jobs
