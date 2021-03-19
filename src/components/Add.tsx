import React, { useState } from 'react'
import AddDialog from './AddDialog'
import { GreyButton } from '../theme'
import styled from 'styled-components'

const AddButton = styled(GreyButton)`
  margin-top: 1rem;
`

function Add() {
  const [dialogOpen, setOpen] = useState(false)
  const close = () => {
    setOpen(false)
  }
  return (
    <>
      <AddButton
        label="Add connection"
        plain
        alignSelf="center"
        onClick={() => setOpen(true)}
      />
      {dialogOpen && <AddDialog onClose={close} initialCode="" />}
    </>
  )
}

export default Add
