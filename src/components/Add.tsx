import React, { useState } from 'react'
import styled from 'styled-components'
import { Button } from 'grommet'
import AddDialog from './AddDialog'

const AddButton = styled(Button)`
  font-size: .9rem;
  font-weight:500;
  border-radius: 40px;
  color: #fff;
  padding: 1rem;
  background-color: #FFFFFF26;
  padding: .5rem 3rem .5rem 3rem;
  text-align: center;
  margin-bottom: 1rem;
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
          label="New connection"
          plain
          alignSelf="center"
          onClick={() => setOpen(true)}
        />
      )}
      {dialogOpen && <AddDialog onClose={close} initialCode="" />}
    </>
  )
}

export default Add
