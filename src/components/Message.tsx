import React from 'react'
import { Paragraph } from 'grommet'
import styled from 'styled-components'
import { device, chat, colors } from '../theme'

import { IMessageNode } from './Types'

const P = styled(Paragraph)`
  padding: ${chat.mediaPad};
  margin: 0;
  display: inline-block;
  font-size: ${chat.fontSize};
  color: ${colors.chatText};
  @media ${device.tablet} {
    padding: ${chat.contentPad};
  }
`

type IProps = { message: IMessageNode }

function Message({ message }: IProps) {
  return <P>{message.message}</P>
}

export default Message
