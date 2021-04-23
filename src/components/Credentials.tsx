import React, { useState } from 'react'
import { Box, Button, Heading, Text, Image, Grid, Card } from 'grommet'

import { useQuery, gql } from '@apollo/client'

import { ICredentialEdge, ICredentialNode } from './Types'
import Waiting from './Waiting'
import Utils from './Utils'
import { credential as fragments, pageInfo } from './Fragments'
import styled from 'styled-components'
import { colors } from '../theme'
import CredentialInfo from './CredentialInfo'

export const CREDENTIALS_QUERY = gql`
  query GetCredentials($cursor: String) {
    credentials(first: 10, after: $cursor) {
      edges {
        ...CredentialEdgeFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${fragments.edge}
  ${pageInfo}
`

export const CONNECTION_CREDENTIALS_QUERY = gql`
  query GetConnectionCredentials($id: ID!, $cursor: String) {
    connection(id: $id) {
      credentials(first: 3, after: $cursor) {
        edges {
          ...CredentialEdgeFragment
        }
        pageInfo {
          ...PageInfoFragment
        }
      }
    }
  }
  ${fragments.edge}
  ${pageInfo}
`
const CredentialsBox = styled(Box)`
  position: relative;
  overflow: scroll;
`

// change color name
const Header = styled(Heading)`
  box-shadow: 0px 10px 12px -12px ${colors.shadow};
  padding: 1rem 0rem;
  font-weight: 400;
  color: ${colors.icon};
  margin: 0;
`

const BButton = styled(Button)`
  box-shadow: -2px 2px 6px 0px ${colors.shadow};
  padding: 5px;
  margin: 2px;
`

export const CartoonBox = styled(Box)`
  justify-content: center;
  align-items: center;
`

interface IProps {
  connectionId?: string
}

function Credentials({ connectionId }: IProps) {
  const { loading, error, data, fetchMore } = useQuery(
    connectionId ? CONNECTION_CREDENTIALS_QUERY : CREDENTIALS_QUERY,
    {
      ...(connectionId ? { variables: { id: connectionId } } : {}),
    }
  )
  const isLoading = loading || (!error && !data)
  const showWaiting = isLoading || error
  const showIntroduction = !loading && (error || !data)

  const credentials = data?.credentials || data?.connection?.credentials

  const [credentialOpen, setOpen] = useState(false)
  const close = () => {
    setOpen(false)
  }

  const [info, setInfo] = useState<ICredentialNode>()

/*
      <Header level={2} fill={true}>
        Credentials
      </Header>
*/

  return (
    <Box>
      {showWaiting && (
        <Box>
          <Waiting loading={loading} error={error} />
        </Box>
      )}
      {showIntroduction && (
        <div>
          <CartoonBox direction="row-responsive" align="start" gap="small">
            <Box align="start" width="medium" pad="medium">
              <Heading level={2}>Your wallet is empty</Heading>
              <Text size="medium">
                You can see your credentials here. 
                When you receive credentials, they are saved here. 
                These credentials can be used in the connections chat.
              </Text>
              <br/>
              <Text size="medium">
                Get credentials by creating a <i>connection</i> with an issuer
              </Text>
            </Box>
            <Box height="medium" width="small">
              <Image src="/img/wallet-empty-m1.svg" fit="contain" />
            </Box>
          </CartoonBox>
        </div>
      )}
      {!showWaiting && (
        <CredentialsBox margin="none">
          {credentials.edges.map(({ node }: ICredentialEdge, index: number) => (
            <BButton
              hoverIndicator={{ color: colors.hover }}
              focusIndicator={false}
              plain
              key={node.id}
              onClick={() => {
                setOpen(true)
                setInfo(node)
              }}
            >
              <Box direction="row" align="center" pad="medium">
                <Box direction="column" width="300px">
                  <Text size="small" weight="bold">
                    {Utils.parseSchemaName(node.schemaId)}
                  </Text>
                  <Text size="small" color={colors.smallText}>
                    {Utils.parseIssuer(node.credDefId)}
                  </Text>
                </Box>
                <Text size="xsmall" color={colors.smallText}>
                  {Utils.toDateString(node.createdMs)}
                </Text>
              </Box>
            </BButton>
          ))}
          {credentials.pageInfo.hasNextPage && (
            <Button
              label="Load more"
              onClick={() =>
                fetchMore({
                  variables: {
                    cursor: credentials.pageInfo.endCursor,
                  },
                })
              }
            ></Button>
          )}
        </CredentialsBox>
      )}
      {credentialOpen && <CredentialInfo onClose={close} credential={info} />}
    </Box>
  )
}

export default Credentials
