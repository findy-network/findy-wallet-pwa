import React, { ReactNode, useEffect } from 'react'
import { Layer as Lay, LayerPositionType, ThemeContext } from 'grommet'
import styled from 'styled-components'
import { device, colors } from '../theme'

const Layer = styled(Lay)`
  background: ${colors.background};
  padding: 9px;
  z-index: 1020;
  width: 90%;
  @media ${device.tablet} {
    width: 30%;
  }
`

interface IProps {
  children: ReactNode
  modal?: boolean
  position: LayerPositionType
  duration: number
  plain: boolean
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
    if (duration) {
      const timer = setTimeout(() => {
        onClose()
      }, duration * 1000)
      return () => clearTimeout(timer)
    }
  })
  return (
    <ThemeContext.Extend
      value={{
        layer: {
          zIndex: '200',
        },
      }}
    >
      <Layer
        position={position || 'top'}
        modal={modal}
        margin="none"
        responsive={false}
        onClickOutside={onClose}
        {...rest}
      >
        {children}
      </Layer>
    </ThemeContext.Extend>
  )
}

export default Dialog
