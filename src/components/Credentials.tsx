import { useState } from 'react'
import { Box, Button, Heading, Text, Image, Collapsible } from 'grommet'

import { useQuery, gql } from '@apollo/client'

import { ICredentialEdge, ICredentialNode, ICredentialValue } from './Types'
import Waiting from './Waiting'
import Utils from './Utils'
import { credential as fragments, pageInfo } from './Fragments'
import styled from 'styled-components'
import { colors, device } from '../theme'
import { Certificate, FormDown, FormUp } from 'grommet-icons'

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

const CartoonBox = styled(Box)`
  justify-content: center;
  align-items: center;
`

const CredentialWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: initial;
  align-items: start;
  height: max-content;
  margin: auto;
  padding: 1rem;
  @media screen and ${device.mobileS} {
    justify-content: center;
  }
  @media screen and ${device.tablet} {
    justify-content: initial;
  }
`

const CredentialCard = styled(Box)`
  border: 1px solid ${colors.chatBorder};
  border-radius: 12px;
  background: white;
  font-weight: 400;
  margin-top: 0.4rem;
  margin-bottom: 0.4rem;
  margin-left: 0.4rem;
  margin-right: 0.4rem;
  padding: 1rem 1rem 0.8rem 1.2rem;

  @media screen and ${device.mobileS} {
    flex: 0 1 100%;
    max-width: 22rem;
    padding: 1rem 1rem 0.8rem 1rem;
  }

  @media screen and ${device.mobileL} {
    flex: 0 1 32%;
    max-width: 22rem;
    min-width: 22rem;
    padding: 1rem 1rem 0.8rem 1.2rem;
`

const CredentialCardHeader = styled(Box)`
  margin-bottom: 1rem;
`

const CredentialCardFooter = styled(Box)`
  margin-top: 1rem;
  align-content: space-between;
  justify-content: space-between;
`

const CredentialRow = styled(Box)`
  justify-content: space-between;
  margin-top: 0.1rem;
  margin-left: 1.9rem;
  margin-right: 1rem;

  @media screen and ${device.mobileL} {
    margin-left: 2.2rem;
    margin-right: 2.2rem;
  }
`

const CredentialText = styled(Text)`
  font-size: 14px;

  @media screen and ${device.mobileL} {
    font-size: 16px;
  }
`
const CredentialCardIcon = styled(Certificate)`
  margin-right: 0.5rem;
  margin-top: 0rem;

  @media screen and ${device.mobileL} {
    margin-right: 0.7rem;
    margin-top: 0.1rem;
  }
`

const Container = styled(Box)`
  overflow-y: auto;
`

interface CredentialProps {
  node: ICredentialNode
}

const CredentialBox = ({ node }: CredentialProps) => {
  const [open, setOpen] = useState(false)
  const CollapseIcon = open ? FormUp : FormDown

  return (
    <CredentialCard>
      <CredentialCardHeader>
        <Box direction="row">
          <CredentialCardIcon color={colors.selected} />
          <Box direction="column">
            <Box direction="row" fill="horizontal" alignContent="between">
              <Text size="medium" color={colors.brand}>
                {Utils.parseSchemaName(node.schemaId)}
              </Text>
            </Box>
            <Box direction="row">
              <CredentialText color={colors.smallText}>
                {Utils.parseIssuer(node.credDefId)}
              </CredentialText>
              <CredentialText color={colors.smallText}>
                &nbsp;{Utils.toDateDotString(node.createdMs)}
              </CredentialText>
            </Box>
          </Box>
        </Box>
      </CredentialCardHeader>

      <Box>
        <Box>
          {node.attributes.map((item: ICredentialValue) => {
            return (
              <div key={item.id}>
                <CredentialRow direction="row">
                  <CredentialText color={colors.smallText}>
                    {item.name}
                  </CredentialText>
                  <CredentialText wordBreak="break-word" color={colors.brand}>
                    {item.value}
                  </CredentialText>
                </CredentialRow>
              </div>
            )
          })}

          <Collapsible key={node.id} open={open}>
            <Box margin={{ top: 'small' }} direction="column" color="dark-3">
              <CredentialRow direction="row-responsive">
                <CredentialText size="small" color={colors.smallText}>
                  Created
                </CredentialText>
                <CredentialText wordBreak="break-all" size="small">
                  {Utils.toTimeString(node.createdMs!)}
                </CredentialText>
              </CredentialRow>
              <CredentialRow direction="row-responsive">
                <CredentialText size="small" color={colors.smallText}>
                  Issued
                </CredentialText>
                <CredentialText wordBreak="break-all" size="small">
                  {Utils.toTimeString(node.issuedMs!)}
                </CredentialText>
              </CredentialRow>
              <CredentialRow direction="row-responsive">
                <CredentialText size="small" color={colors.smallText}>
                  Approved
                </CredentialText>
                <CredentialText wordBreak="break-all" size="small">
                  {Utils.toTimeString(node.approvedMs!)}
                </CredentialText>
              </CredentialRow>
              <CredentialRow pad={{ top: 'small' }} direction="column">
                <CredentialText size="small" color={colors.smallText}>
                  Schema ID
                </CredentialText>
                <CredentialText wordBreak="break-all" size="small">
                  {node.schemaId}
                </CredentialText>
              </CredentialRow>
              <CredentialRow pad={{ top: 'small' }} direction="column">
                <CredentialText size="small" color={colors.smallText}>
                  Credential definition ID
                </CredentialText>
                <CredentialText wordBreak="break-all" size="small">
                  {node.credDefId}
                </CredentialText>
              </CredentialRow>
              <CredentialRow pad={{ top: 'small' }} direction="column">
                <CredentialText size="small" color={colors.smallText}>
                  Credential ID
                </CredentialText>
                <CredentialText wordBreak="break-all" size="small">
                  {node.id}
                </CredentialText>
              </CredentialRow>
            </Box>
          </Collapsible>

          <CredentialCardFooter direction="row">
            <Box></Box>
            <Box align="end">
              <Button
                key={node.id}
                hoverIndicator="light-4"
                plain={true}
                icon={<CollapseIcon color={colors.selected} />}
                onClick={() => setOpen(!open)}
              />
            </Box>
          </CredentialCardFooter>
        </Box>
      </Box>
    </CredentialCard>
  )
}

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

  return (
    <Container>
      {showWaiting && (
        <Box>
          <Waiting loading={loading} error={error} />
        </Box>
      )}
      {showIntroduction && (
        <div>
          <CartoonBox direction="row-responsive" align="start" gap="small">
            <Box align="start" width="medium" pad="small">
              <Heading level={2}>Your wallet is empty</Heading>
              <Text size="medium">
                You can see your credentials here. When you receive credentials,
                they are saved here. These credentials can be used in the
                connections chat.
              </Text>
              <br />
              <Text size="medium">
                Get credentials by creating <b>connections</b> with services
              </Text>
            </Box>
            <Box height="medium" width="small">
              <Image src="/img/wallet-empty-m1.svg" fit="contain" />
            </Box>
          </CartoonBox>
        </div>
      )}
      {!showWaiting && (
        <Box>
          <CredentialWrapper>
            {credentials.edges.map(
              ({ node }: ICredentialEdge, index: number) => (
                <CredentialBox key={node.id} node={node} />
              )
            )}
          </CredentialWrapper>
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
        </Box>
      )}
    </Container>
  )
}

export default Credentials
