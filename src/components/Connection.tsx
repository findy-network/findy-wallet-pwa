import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Box, Heading, Tab, Tabs } from 'grommet'

import { useQuery, gql } from '@apollo/client'
import Waiting from './Waiting'
import Messages from './Messages'
import Credentials from './Credentials'
import Proofs from './Proofs'
import Jobs from './Jobs'
import Events from './Events'
import { fragments } from './ConnectionFragments'

Connection.fragments = fragments

export const CONNECTION_QUERY = gql`
  query GetConnection($id: ID!) {
    connection(id: $id) {
      ...PairwiseNodeFragment
    }
  }
  ${Connection.fragments.node}
`

type TParams = { id: string }

function Connection({ match }: RouteComponentProps<TParams>) {
  const { loading, error, data } = useQuery(CONNECTION_QUERY, {
    variables: {
      id: match.params.id,
    },
  })
  const node = data?.connection
  return (
    <>
      {loading || error ? (
        <Waiting loading={loading} error={error} />
      ) : (
        <Box>
          <Heading level={2}>{node.theirLabel}</Heading>
          <Box>
            <Tabs justify="start" alignControls="start">
              <Tab title="Jobs">
                <Box fill pad="large" align="center">
                  <Jobs connectionId={node.id} />
                </Box>
              </Tab>
              <Tab title="Events">
                <Box fill pad="large" align="center">
                  <Events connectionId={node.id} />
                </Box>
              </Tab>
              <Tab title="Credentials">
                <Box fill pad="large" align="center">
                  <Credentials connectionId={node.id} />
                </Box>
              </Tab>
              <Tab title="Proofs">
                <Box fill pad="large" align="center">
                  <Proofs connectionId={node.id} />
                </Box>
              </Tab>
              <Tab title="Messages">
                <Box fill pad="large" align="center">
                  <Messages connectionId={node.id} />
                </Box>
              </Tab>
            </Tabs>
          </Box>
        </Box>
      )}
    </>
  )
}

export default Connection
