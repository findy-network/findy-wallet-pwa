import React, { useState } from 'react'
import styled from 'styled-components'
import { Box, Button, Heading, TextInput } from 'grommet'
import { Add as AddIcon } from 'grommet-icons'
import Dialog from './Dialog'

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
              <TextInput placeholder="Copy paste invitation here"></TextInput>
              <Button label="OK" onClick={() => setOpen(false)}></Button>
            </Box>
          </Dialog>
        </Smoke>
      )}
    </>
  )
}

export default Add
