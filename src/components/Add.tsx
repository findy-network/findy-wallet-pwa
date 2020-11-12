import React, { useState } from 'react'
import styled from 'styled-components'
import { Box, Button, Heading, TextInput } from 'grommet'
import { Add as AddIcon } from 'grommet-icons'
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

const AddButton = styled(Button)`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  border-radius: 50%;
  border: 3px solid gray;
  padding: 1rem;
  background-color: white;
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

function Add() {
  const [dialogOpen, setOpen] = useState(false)
  const [code, setCode] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const close = () => {
    setOpen(false)
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
    <>
      {!dialogOpen && (
        <AddButton
          icon={<AddIcon />}
          label=""
          plain
          onClick={() => setOpen(true)}
        />
      )}
      {dialogOpen && (
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
      )}
    </>
  )
}

export default Add
