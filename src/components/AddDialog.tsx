import React, { useState } from 'react'
import styled from 'styled-components'
import { Box, Button, Heading, TextInput } from 'grommet'
import Dialog from './Dialog'
import QrReader from './QrReader'

import { useMutation, gql } from '@apollo/client'

const CONNECT_MUTATION = gql`
  mutation Connect($input: ConnectInput!) {
    connect(input: $input) {
      ok
    }
  }
`

const Smoke = styled.div`
  position: fixed;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  background: gray;
  opacity: 0.6;
`

interface IProps {
  initialCode: string
  onClose: () => void
}

function AddDialog({ onClose, initialCode }: IProps) {
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
        <Box round margin="medium">
          <Heading level="2">Add connection</Heading>
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
              gap="small"
              round
              pad="small"
              margin="medium"
            >
              {' '}
              <TextInput
                placeholder="Copy paste invitation here"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <QrReader
                onRead={(res: string) => {
                  // console.log(res)
                  setCode(res)
                }}
              />
            </Box>
          )}
          <Button
            label="OK"
            onClick={() => {
              if (code) {
                connect({ variables: { input: { invitation: code } } })
                setCode('')
              } else {
                close()
              }
            }}
          ></Button>
        </Box>
      </Dialog>
    </Smoke>
  )
}

export default AddDialog
