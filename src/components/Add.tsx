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
  const [connect] = useMutation(CONNECT_MUTATION)
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
            onClose={() => setOpen(false)}
            onEsc={() => setOpen(false)}
          >
            <Box
              direction="column"
              align="center"
              justify="between"
              gap="small"
              round
              pad="small"
              margin="medium"
            >
              <Heading level="2">Add connection</Heading>
              <TextInput
                placeholder="Copy paste invitation here"
                value={code}
              />
              <QrReader
                onRead={(res: string) => {
                  // console.log(res)
                  setCode(res)
                }}
              />
              <Button
                label="OK"
                onClick={() => {
                  setOpen(false)
                  if (code) {
                    connect({ variables: { input: { invitation: code } } })
                  }
                  setCode('')
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
