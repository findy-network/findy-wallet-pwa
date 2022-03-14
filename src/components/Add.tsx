import React, { useState } from 'react'
import AddDialog from './AddDialog'
import { GreyButton } from '../theme'
import styled from 'styled-components'

const AddButton = styled(GreyButton)`
  margin-top: 1rem;
`

interface AddProps {
  onClick: () => void
  onClose: () => void
}

function Add({ onClick, onClose }: AddProps) {
  const [dialogOpen, setOpen] = useState(false)
  const close = () => {
    setOpen(false)
    onClose()
  }
  return (
    <>
      <AddButton
        label="Add connection"
        plain
        alignSelf="center"
        onClick={() => {
          onClick()
          setOpen(true)
        }}
      />
      {dialogOpen && <AddDialog onClose={close} initialCode="" />}
    </>
  )
}

export default Add
