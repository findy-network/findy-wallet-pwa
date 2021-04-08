import React from 'react'
import styled from 'styled-components'
import { Box, Button, Heading, Text } from 'grommet'
import Dialog from './Dialog'
import { colors, Smoke } from '../theme'
import { Close } from 'grommet-icons'
import { ICredentialNode } from './Types'
import Utils from './Utils'
import { ICredentialValue } from './Types'

const CloseIcon = styled(Close)`
  stroke: ${colors.icon};
  font-size: 1.25rem;
  font-weight: 500;
`

const CloseButton = styled(Button)`
  margin: 0 0 0 auto;
  padding: 0px;
  &:hover ${CloseIcon} {
    stroke: ${colors.close};
  }
`

const Head = styled(Heading)`
  font-size: 1.25rem;
  font-weight: 500;
  margin: 0;
  overflow: hidden;
`
const Content = styled(Box)`
  background: ${colors.background};
`

const Row = styled(Box)`
  padding: 0 0 17px 0;
  width: 100%;
`

const Attribute = styled(Text)`
  color: ${colors.smallText};
`

const Value = styled(Text)``

interface IProps {
  credential: ICredentialNode | undefined
  onClose: () => void
}

function CredentialInfo({ onClose, credential }: IProps) {
  const close = () => {
    onClose()
  }
  return (
    <Smoke>
      <Dialog
        position="center"
        duration={0}
        modal={false}
        plain={false}
        onClose={close}
        onEsc={close}
      >
        <Content margin="small">
          <Row direction="row">
            <Head level="3">{credential!.schemaId}</Head>
            <CloseButton
              plain
              icon={<CloseIcon />}
              onClick={() => close()}
            ></CloseButton>
          </Row>
          <Box direction="column">
            <Text size="xsmall">
              {Utils.toTimeString(credential!.createdMs)}
            </Text>
            <Box pad="10px 0 0 0" direction="row">
              <Attribute>Issuer: </Attribute>
              <Value>&nbsp;{Utils.parseIssuer(credential!.credDefId)}</Value>
            </Box>
            <Box pad="5px 0 0 0" direction="row">
              <Attribute>Credential definition:</Attribute>
              <Value>&nbsp;{credential!.credDefId}</Value>
            </Box>
            {credential!.attributes.map(
              ({ name, value, id }: ICredentialValue) => (
                <Box key={id} pad="5px 0 0 0" direction="row">
                  <Attribute>{name}:</Attribute>
                  <Value>&nbsp;{value}</Value>
                </Box>
              )
            )}
          </Box>
        </Content>
      </Dialog>
    </Smoke>
  )
}

export default CredentialInfo
