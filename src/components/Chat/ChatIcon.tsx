import React from 'react'
import { Box } from 'grommet'
import styled from 'styled-components'
import { device } from '../../theme'

const Icon = styled(Box)`
background-repeat: round;
width: 40px;
height: 40px;
border-radius: 50%;
@media ${device.tablet} {
  width: 50px;
  height: 50px;
}
`

const LeftIcon = styled(Icon)`
background-image: url(/img/robot-icon.svg);
margin: 6px 6px 0 0;
@media ${device.tablet} {
  margin: 6px 12px 0 0;
}
`

const RightIcon = styled(Icon)`
background-image: url(/img/person-icon.svg);
margin: 6px 0 0 6px;
@media ${device.tablet} {
  margin: 6px 0 0 12px;
}
`

interface IProps {
    right?: boolean
  }

function ChatIcon({right}: IProps) {
    return right ? (
        <RightIcon></RightIcon>
    ) : (
        <LeftIcon></LeftIcon>
    )
  }
  
  export default ChatIcon
