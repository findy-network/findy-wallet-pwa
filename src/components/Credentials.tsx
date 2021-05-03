import { useState } from 'react'
import { Box, Button, Heading, Text, Image,  Collapsible } from 'grommet'

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
  border: 1px solid #efefef;
  border-radius: 12px;
  background: white;
  font-weight: 400;
  margin-top: 0.4rem;
  margin-bottom: 0.4rem;
  margin-left: 0.4rem;
  margin-right: 0.4rem;

  flex: 0 1 100%;
  @media screen and ${device.mobileS} {
    flex: 0 1 100%;
    max-width: 22rem;
  }

  @media screen and ${device.laptop} {
    flex: 0 1 32%;
    max-width: 22rem;
    min-width: 22rem;
  }
`

const CredentialRow = styled(Box)`
  justify-content: space-between;
  margin-left: 2.2rem;
  margin-right: 2.2rem;
  margin-top: 0.2rem;
`


interface CredentialProps {
  node: ICredentialNode
}

const CredentialBox = ({ node } : CredentialProps) => {
  const [open, setOpen] = useState(false)
  const CollapseIcon = open ? FormUp : FormDown;

  /*
    for(let i = 0; i < node.attributes.length; i += 1) {
      console.log(node.attributes[i].name + " " + node.attributes[i].value);
    }
    console.log(node);
  */

  return (
     <CredentialCard pad="small" elevation="small">
      <Box direction="row" margin={{ bottom: 'xsmall' }} >
        <Box pad={{right: "small"}}>
          <Certificate color={colors.brand} />
        </Box>
        <Box direction="row" fill="horizontal" alignContent="between">
          <Text size="medium" color={colors.brand}>
            {Utils.parseSchemaName(node.schemaId)}
          </Text>
        </Box>
      </Box>
      <Box direction="row" margin={{ left: 'medium'}} pad={{ bottom: 'small' }} >
          <Text size="small" margin={{left: "small"}} color={colors.smallText}>
            {Utils.parseIssuer(node.credDefId)}
          </Text>
          <Text size="small" color={colors.smallText}>
            &nbsp;{Utils.toDateString(node.createdMs)}
          </Text>
      </Box>

      <Box>
        <Box 
          border={{ side: 'top', size: 'xsmall' }} 
          pad={{ top: 'small' }} >

          {node.attributes.map((item: ICredentialValue) => {
            return (
              <div key={item.id}>
                <CredentialRow 
                  direction="row">
                  <Text size="small" color={colors.smallText}>
                    {item.name}
                  </Text>
                  <Text wordBreak="break-word" size="small" color={colors.brand}>
                    {item.value}
                  </Text>
                </CredentialRow>
              </div>
            )
          })}

          <Collapsible key={node.id} open={open}>
            <Box margin={{top: 'small'}} direction="column" color="dark-3">
              <CredentialRow 
                direction="row-responsive">
                <Text size="small" color={colors.smallText}>
                  Created
                </Text>
                <Text wordBreak="break-all" size="small">
                  {node.createdMs}
                </Text>
              </CredentialRow>
              <CredentialRow 
                direction="row-responsive">
                <Text size="small" color={colors.smallText}>
                  Issued
                </Text>
                <Text wordBreak="break-all" size="small">
                  {node.issuedMs}
                </Text>
              </CredentialRow>
              <CredentialRow 
                direction="row-responsive">
                <Text size="small" color={colors.smallText}>
                  Approved
                </Text>
                <Text wordBreak="break-all" size="small">
                  {node.approvedMs}
                </Text>
              </CredentialRow>
              <CredentialRow 
                direction="column">
                <Text size="small" color={colors.smallText}>
                  Schema ID
                </Text>
                <Text wordBreak="break-all" size="small">
                  {node.schemaId}
                </Text>
              </CredentialRow>
              <CredentialRow 
                direction="column">
                <Text size="small" color={colors.smallText}>
                  Credential definition ID
                </Text>
                <Text wordBreak="break-all" size="small">
                  {node.credDefId}
                </Text>
              </CredentialRow>
              <CredentialRow 
                direction="column">
                <Text size="small" color={colors.smallText}>
                  Credential ID
                </Text>
                <Text wordBreak="break-all" size="small">
                  {node.id}
                </Text>
              </CredentialRow>
            </Box>
          </Collapsible>

          <Box 
            margin={{ top: 'small' }}
            alignContent="between"
            justify="between" 
            direction="row">
            <Box alignSelf="center" direction="row">
            </Box>
            <Box align="end" >
              <Button
                key={node.id}
                hoverIndicator="light-4"
                plain={true}
                icon={<CollapseIcon color={colors.selected} />}
                onClick={() => setOpen(!open)} 
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </CredentialCard>
  );
}


interface IProps {
  connectionId?: string,
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
        <Box>
          <CredentialWrapper>
            {credentials.edges.map(({ node }: ICredentialEdge, index: number) => (
              <CredentialBox key={node.id} node={node} />
            ))}
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
    </Box>
  )
}

export default Credentials
