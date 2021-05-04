import React, { ReactNode } from 'react'
import { Box, Paragraph } from 'grommet'
import styled from 'styled-components'
import { device, chat, colors } from '../../theme'
import ChatIcon from './ChatIcon'
import Utils from '../Utils'

const StyleBox = styled(Box)`
  display: inline-block;
  max-width: 70%;
  margin: 8px auto 12px 0px;
  border: 1px solid ${colors.chatBorder};
  font-size: ${chat.fontSize};
  @media ${device.tablet} {
    max-width: 90%;
  }
`

const ReceivedBox = styled(StyleBox)`
  border-radius: 0 24px 24px 24px;
`
const SentBox = styled(StyleBox)`
  background: ${colors.chatSent};
  border-radius: 24px 0 24px 24px;
  margin-left: auto;
  margin-right: 0;
`

const Time = styled(Paragraph)`
  font-size: ${chat.timeFont};
  color: ${colors.smallText};
  margin: 0px 10px 4px 27px;
  @media ${device.tablet} {
    margin: 0px 10px 4px 31px;
  }
  float: right;
`


interface IProps {
  children: ReactNode
  sentByMe?: boolean
  time: string
}

function JobBox({ children, sentByMe, time }: IProps) {
  return sentByMe ? (
    <Box direction="row">
      <SentBox>{children}<Time>{Utils.toDateMsgString(time)}</Time></SentBox>
      <ChatIcon right={true}></ChatIcon>
    </Box>
  ) : (
    <Box direction="row">
      <ChatIcon></ChatIcon>
      <ReceivedBox>{children}<Time>{Utils.toDateMsgString(time)}</Time></ReceivedBox>
    </Box>
  )
}

export default JobBox
