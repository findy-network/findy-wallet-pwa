import React, { useState } from 'react'
import styled from 'styled-components'
import { Button } from 'grommet'
import { Add as AddIcon } from 'grommet-icons'
import AddDialog from './AddDialog'

const AddButton = styled(Button)`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  border-radius: 50%;
  border: 3px solid gray;
  padding: 1rem;
  background-color: white;
`

function Add() {
  const [dialogOpen, setOpen] = useState(false)
  const close = () => {
    setOpen(false)
  }
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
      {dialogOpen && <AddDialog onClose={close} initialCode="" />}
    </>
  )
}

export default Add
