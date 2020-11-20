import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Box, Heading } from 'grommet'

import { useQuery, gql } from '@apollo/client'
import Waiting from './Waiting'

const nodeFragment = gql`
  fragment CredentialNodeFragment on Credential {
    id
    role
    schemaId
    credDefId
    attributes {
      name
      value
    }
    initiatedByUs
    createdMs
    approvedMs
    issuedMs
  }
`

Credential.fragments = {
  node: nodeFragment,
  edge: gql`
    fragment CredentialEdgeFragment on CredentialEdge {
      cursor
      node {
        ...CredentialNodeFragment
      }
    }
    ${nodeFragment}
  `,
}

export const CREDENTIAL_QUERY = gql`
  query GetCredential($id: ID!) {
    credential(id: $id) {
      ...CredentialNodeFragment
    }
  }
  ${Credential.fragments.node}
`

type TParams = { id: string }

function Credential({ match }: RouteComponentProps<TParams>) {
  const { loading, error, data } = useQuery(CREDENTIAL_QUERY, {
    variables: {
      id: match.params.id,
    },
  })
  const node = data?.credential
  return (
    <>
      {loading || error ? (
        <Waiting loading={loading} error={error} />
      ) : (
        <>
          <Heading level={2}>Credential {node.schemaId}</Heading>
          <Box>
            <Box>
              <div>ID</div>
              <div>{node.id}</div>
              <div>CredDefId</div>
              <div>{node.credDefId}</div>
            </Box>
          </Box>
        </>
      )}
    </>
  )
}

export default Credential
