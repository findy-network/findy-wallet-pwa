import React, { useState } from 'react'
import styled from 'styled-components'
import { Box, Button, Heading, Paragraph, TextInput } from 'grommet'
import Dialog from './Dialog'
import QrReader from './QrReader'
import { colors } from '../theme'
import { Close } from 'grommet-icons'

import { useMutation, gql } from '@apollo/client'

const CONNECT_MUTATION = gql`
  mutation Connect($input: ConnectInput!) {
    connect(input: $input) {
      ok
    }
  }
`

const ConfirmButton = styled(Button)`
  background: ${colors.selected};
  color: ${colors.darkBtnText};
  border-radius: 0.3rem;
  font-size: 15.3px;
  padding: 8.5px 17px;
  width: 100%;
  margin-top: 1rem;
`
const Line = styled(Paragraph)`
  text-align: center;
  border-bottom: 1px solid ${colors.chatBorder};
  line-height: 0.1em;
  width: 100%;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
`

const Span = styled.span`
  background: ${colors.background};
  padding: 0 10px;
  color: ${colors.smallText};
  font-size: 0.9rem;
  margin-right: 0%;
  font-weight: 500;
`

const Input = styled(TextInput)`
  width: 100%;
  position: relative;
  height: 60px;
  font: 400 17px Inter;
  border-radius: 0;
  border: 1px solid ${colors.chatBorder};
  opacity: 0.5;
`

const CloseIcon = styled(Close)`
  stroke: ${colors.icon};
  font-size: 1.25rem;
  font-weight: 500;
`

const CloseButton = styled(Button)`
  margin: 0 0 0 auto;
  padding: 0;
  &:hover ${CloseIcon} {
    stroke: ${colors.close};
  }
`

const Head = styled(Heading)`
  font-size: 1.25rem;
  font-weight: 500;
  margin: 0;
`

const Content = styled(Box)`
  background: ${colors.background};
`

const Row = styled(Box)`
  padding: 0 0 17px 0;
  width: 100%;
`

interface IProps {
  label?: string
  initialCode: string
  onClose: () => void
}

function AddDialog({ onClose, initialCode, label }: IProps) {
  const [code, setCode] = useState(initialCode)
  const [errorMessage, setErrorMessage] = useState('')
  const close = () => {
    onClose()
    setErrorMessage('')
  }
  const [connect] = useMutation(CONNECT_MUTATION, {
    onCompleted: close,
    onError: () => {
      setErrorMessage(
        'Unable to send connection request,\n is the invitation in correct format?'
      )
    },
  })

  const onConfirm = (param?: string) => {
    const newCode = param || code
    if (newCode) {
      connect({ variables: { input: { invitation: newCode } } })
      setCode('')
    } else {
      close()
    }
  }
  return (
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
          <Head level="3">Add connection {label || ''}</Head>
          <CloseButton
            plain
            icon={<CloseIcon />}
            onClick={() => close()}
          ></CloseButton>
        </Row>
        {errorMessage ? (
          <Box pad="small">
            {errorMessage.split('\n').map((item) => (
              <div key={item}>{item}</div>
            ))}
          </Box>
        ) : (
          <Box
            direction="column"
            align="center"
            justify="between"
            pad="none"
            margin="none"
          >
            {' '}
            <Input
              placeholder="Enter invitation code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            {label ? <div /> : (
              <>
                <Line>
                  <Span>OR</Span>
                </Line>
                <QrReader
                  onRead={(res: string) => {
                    setCode(res)
                    onConfirm(res)
                  }}
                />
              </>)
            }
            <ConfirmButton
              label="Confirm"
              onClick={() => onConfirm()}
            ></ConfirmButton>
          </Box>
        )}
      </Content>
    </Dialog>
  )
}

export default AddDialog
