import React from 'react'
import { Paragraph, Box } from 'grommet'
import styled from 'styled-components'
import { device, chat, colors } from '../theme'

import { IMessageNode } from './Types'
import Linkify from 'react-linkify'

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

const componentDecorator = (href: any, text: any, key: any) => (
  <a href={href} key={key} target="_blank" rel="noopener noreferrer">
    {text}
  </a>
)

type IProps = { message: IMessageNode; index: number }

function Message({ message, index }: IProps) {
  return (
    <Content id={`message-${index}`}>
      <Linkify componentDecorator={componentDecorator}>
        <P>{message.message}</P>
      </Linkify>
    </Content>
  )
}

export default Message
