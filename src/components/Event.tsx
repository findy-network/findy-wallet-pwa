import React from 'react'
import JobBox from './Chat/JobBox'
import styled from 'styled-components'
import { device, chat, colors } from '../theme'
import { Paragraph, Box } from 'grommet'
import { IEventNode } from './Types'

type IProps = { node: IEventNode }

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
`

function Event({ node }: IProps) {
  switch (node.description) {
    case 'Received basic message': {
      return null
    }
    case 'Received credential': {
      return null
    }
    case 'Approved credential': {
      return null
    }
    case 'Approved proof': {
      return null
    }
    case 'Proved credential': {
      return null
    }
    default: {
      return node.description ? (
        <JobBox time={node.createdMs}>
          <Content>
            <P>{node.description}</P>
          </Content>
        </JobBox>
      ) : (
        <div />
      )
    }
  }
}

export default Event
