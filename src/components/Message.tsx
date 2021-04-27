import React from 'react'
import { Paragraph, Box } from 'grommet'
import styled from 'styled-components'
import { device, chat, colors } from '../theme'

import { IMessageNode } from './Types'

const Content = styled(Box)`
  width: 100%;
`

const P = styled(Paragraph)`
  padding: ${chat.mediaPad};
  margin: 0;
  display: inline-block;
  font-size: ${chat.fontSize};
  color: ${colors.chatText};
  @media ${device.tablet} {
    padding: ${chat.contentPadding};
  }
  white-space: pre-wrap;
`

type IProps = { message: IMessageNode }

function Message({ message }: IProps) {
  return (
    <Content>
      <P>{message.message}</P>
    </Content>
  )
}

export default Message
