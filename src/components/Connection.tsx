import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Box, Heading } from 'grommet'

import { useQuery, gql } from '@apollo/client'
import Waiting from './Waiting'

Connection.fragments = {
  data: gql`
    fragment PairwiseDataFragment on Pairwise {
      id
      ourDid
      theirDid
      theirEndpoint
      theirLabel
      createdMs
      approvedMs
      initiatedByUs
    }
  `,
}

const CONNECTION_QUERY = gql`
  query GetConnection($id: ID!) {
    connection(id: $id) {
      ...PairwiseDataFragment
    }
  }
  ${Connection.fragments.data}
`

type TParams = { id: string }

function Connection({ match }: RouteComponentProps<TParams>) {
  const { loading, error, data } = useQuery(CONNECTION_QUERY, {
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
          <Heading level={2}>Connection {data.connection.theirLabel}</Heading>
          <Box>
            <Box>
              <div>ID</div>
              <div>{data.connection.id}</div>
              <div>My DID</div>
              <div>{data.connection.ourDid}</div>
            </Box>
          </Box>
        </>
      )}
    </>
  )
}

export default Connection
