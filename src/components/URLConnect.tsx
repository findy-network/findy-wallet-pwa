import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Box, Heading } from 'grommet'
import { useHistory } from 'react-router'

import { useQuery, gql } from '@apollo/client'
import Waiting from './Waiting'
import Me from './Me'
import AddDialog from './AddDialog'

export const ENDPOINT_QUERY = gql`
  query GetEndpoint($payload: String!) {
    endpoint(payload: $payload) {
      ...InvitationFragment
    }
  }
  ${Me.fragment}
`

type TParams = { invitation: string }

function URLConnect({ match }: RouteComponentProps<TParams>) {
  const { loading, error, data } = useQuery(ENDPOINT_QUERY, {
    variables: {
      payload: match.params.invitation,
    },
  })
  const history = useHistory()
  return (
    <>
      {loading || error ? (
        <Waiting loading={loading} error={error} />
      ) : (
        <Box>
          <Heading level={2}>Adding connection {data.endpoint.label}</Heading>
          <AddDialog
            initialCode={data.endpoint.raw}
            onClose={() => history.push('/')}
          />
        </Box>
      )}
    </>
  )
}

export default URLConnect
