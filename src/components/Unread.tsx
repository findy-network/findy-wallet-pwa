import React from 'react'
import styled from 'styled-components'

interface IProps {
  show: boolean
}

const Circle = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  height: 1rem;
  width: 1rem;
  background-color: red;
  border-radius: 50%;
`

const Unread = ({ show }: IProps) => <>{show && <Circle />}</>

export default Unread
