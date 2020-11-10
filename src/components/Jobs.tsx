import React from 'react'
import { Box, Button, Heading } from 'grommet'

import { useQuery, gql } from '@apollo/client'

import { IJobEdge } from './Types'
import { Link } from 'react-router-dom'
import Waiting from './Waiting'
import Job from './Job'

import { fetchPolicyVar } from '../apollo'

export const JOBS_QUERY = gql`
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

const toTimeString = (str: string) => {
  const d = new Date(parseInt(str, 10))
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
}

function Jobs() {
  console.log(fetchPolicyVar())
  const { loading, error, data, fetchMore } = useQuery(JOBS_QUERY, {
    fetchPolicy: fetchPolicyVar(),
  })

  return (
    <div>
      {loading || error ? (
        <Waiting loading={loading} error={error} />
      ) : (
        <>
          {data.jobs.edges.length > 0 && <Heading level={3}>Jobs</Heading>}
          <Box margin="small">
            {data.jobs.edges.map(({ node }: IJobEdge) => (
              <Link key={node.id} to={`/jobs/${node.id}`}>
                <Box
                  background="light-1"
                  direction="column"
                  align="center"
                  pad="medium"
                  border="bottom"
                  height={{ min: '8rem' }}
                >
                  <div>Created {toTimeString(node.createdMs)}</div>
                  <div>
                    {node.protocol}: {node.status}
                  </div>
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
        </>
      )}
    </div>
  )
}

export default Jobs
