import React from 'react'
import JobBox from './Chat/JobBox'
import styled from 'styled-components'
import { device, chat, colors } from '../theme'
import { Paragraph } from 'grommet'

type IProps = { description: string }

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

function Event({ description }: IProps) {
  switch (description) {
    case 'Received basic message': {
      return null
    }
    default: {
      return description ? (
        <JobBox>
          <P>{description}</P>
        </JobBox>
      ) : (
        <div />
      )
    }
  }
}

export default Event
