import React from 'react'
import { Box, Button, Heading } from 'grommet'

import { useQuery, gql } from '@apollo/client'

import { IJobEdge } from './Types'
import { Link } from 'react-router-dom'
import Waiting from './Waiting'
import Job from './Job'

import { fetchPolicyVar } from '../apollo'

const JOBS_QUERY = gql`
  query GetJobs($cursor: String) {
    jobs(first: 10, after: $cursor) {
      edges {
        node {
          ...JobDataFragment
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
  ${Job.fragments.data}
`

function Jobs() {
  const { loading, error, data, fetchMore } = useQuery(JOBS_QUERY, {
    fetchPolicy: fetchPolicyVar(),
  })

  return (
    <div>
      <Heading level={3}>Jobs</Heading>
      {loading || error ? (
        <Waiting loading={loading} error={error} />
      ) : (
        <Box margin="small">
          {data.jobs.edges.map(({ node }: IJobEdge) => (
            <Link key={node.id} to={`/jobs/${node.id}`}>
              <Box
                background="light-1"
                direction="row"
                align="center"
                pad="medium"
                border="bottom"
                height={{ min: '8rem' }}
              >
                {node.protocol}: {node.status}
              </Box>
            </Link>
          ))}
          {data.jobs.pageInfo.hasNextPage && (
            <Button
              label="Load more"
              onClick={() =>
                fetchMore({
                  variables: {
                    cursor: data.jobs.pageInfo.endCursor,
                  },
                })
              }
            ></Button>
          )}
        </Box>
      )}
    </div>
  )
}

export default Jobs
