import React, { ReactNode, useEffect } from 'react'
import { Layer, LayerPositionType } from 'grommet'

interface IProps {
  children: ReactNode
  modal?: boolean
  position: LayerPositionType
  duration: number
  onClose: () => void
  onEsc: () => void
}

function Dialog({
  children,
  duration,
  modal,
  position,
  onClose,
  ...rest
}: IProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)
    return () => clearTimeout(timer)
  })
  return (
    <Layer
      position={position || 'top'}
      modal={modal}
      margin="none"
      responsive
      plain={modal ? false : true}
      {...rest}
    >
      {children}
    </Layer>
  )
}

export default Dialog
