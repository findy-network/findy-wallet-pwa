import React from 'react'
import { Box } from 'grommet'

import { IMessageNode } from './Types'
import Utils from './Utils'

type IProps = { message: IMessageNode }

function Message({ message }: IProps) {
  return (
    <Box>
      <strong>
        {Utils.toTimeString(message.createdMs)}{' '}
        {message.sentByMe ? 'message by me' : 'message from them'}:
      </strong>
      <span>{message.message}</span>
    </Box>
  )
}

export default Message
