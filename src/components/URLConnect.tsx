import { useParams, useNavigate } from 'react-router-dom'
import { Box, Heading } from 'grommet'
import { useQuery, gql } from '@apollo/client'

import Waiting from './Waiting'
import Me from './Me'
import AddDialog from './AddDialog'
import { Smoke } from '../theme'

export const ENDPOINT_QUERY = gql`
  query GetEndpoint($payload: String!) {
    endpoint(payload: $payload) {
      ...InvitationFragment
    }
  }
  ${Me.fragment}
`

function URLConnect() {
  const params = useParams()
  const navigate = useNavigate()
  const { loading, error, data } = useQuery(ENDPOINT_QUERY, {
    variables: {
      payload: params.invitation,
    },
  })
  return (
    <>
      {loading || error ? (
        <Waiting loading={loading} error={error} />
      ) : (
        <Box>
          <Smoke />
          <Heading level={2}>Adding connection {data.endpoint.label}</Heading>
          <AddDialog
            initialCode={data.endpoint.raw}
            onClose={() => navigate('/')}
            label={data.endpoint.label}
          />
        </Box>
      )}
    </>
  )
}

export default URLConnect
