import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { useHistory } from 'react-router'

import Waiting from './Waiting'
import { Box, Heading, Text, Image } from 'grommet'
import styled from 'styled-components'

export const CONNECTIONS_QUERY = gql`
  query GetConnections {
    connections(first: 1) {
      edges {
        node {
          id
        }
      }
    }
  }
`

const CartoonBox = styled(Box)`
  justify-content: center;
  align-items: center;
`

function Home() {
  const history = useHistory()
  const onCompleted = (data: any) => {
    if (data && data.connections.edges.length > 0) {
      const { id } = data.connections.edges[0].node
      history.push(`/connections/${id}`)
    }
  }
  const { loading, error, data } = useQuery(CONNECTIONS_QUERY, {
    fetchPolicy: 'network-only', // Used for first execution
    nextFetchPolicy: 'cache-first', // Used for subsequent executions
    onCompleted,
  })
  const isLoading = loading || (!error && !data)
  const showWaiting = isLoading || error
  const showIntroduction =
    !loading &&
    (error || !data?.connections?.edges || data.connections.edges.length === 0)

  return (
    <>
      {showWaiting && (
        <Box>
          <Waiting loading={loading} error={error} />
        </Box>
      )}
      {showIntroduction && (
        <div>
          <CartoonBox direction="row-responsive" align="start" gap="small">
            <Box align="start" width="medium" pad="small">
              <Heading level={2}>Make new connection</Heading>
              <Text size="medium">
                You can see your connections here, but haven't made any
                connections yet.
              </Text>
              <br />
              <Text size="medium">
                Use <b>add connection</b> for connecting existing invitation
                from services or persons.
              </Text>
              <br />
              <Text size="medium">
                Create <b>new invitation</b> for inviting service or person to
                connect to you.
              </Text>
            </Box>
            <Box height="medium" width="small">
              <Image src="/img/phone-f1.svg" fit="contain" />
            </Box>
          </CartoonBox>
        </div>
      )}
    </>
  )
}

export default Home
