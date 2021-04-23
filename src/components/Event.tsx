import React from 'react'
import JobBox from './Chat/JobBox'
import styled from 'styled-components'
import { device, chat, colors } from '../theme'
import { Paragraph } from 'grommet'
import { IEventNode } from './Types'

type IProps = { node: IEventNode }

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

function Event({ node }: IProps) {
  switch (node.description) {
    case 'Received basic message': {
      return null
    }
    case 'Received credential': {
      return null
    }
    /*case 'Received credential': {
      return (
      <JobBox>
        <P>{node.description}</P>
        <P>{node.job?.node.status}</P>
      </JobBox>)
    }*/
    case 'Approved credential': {
      return null
    }
    /*case 'Approved credential': {
      return (
      <JobBox>
        <P>{node.description}</P>
        <P>{node.job?.node.status}</P>
      </JobBox>)
    }*/
    default: {
      return node.description ? (
        <JobBox>
          <P>{node.description}</P>
        </JobBox>
      ) : (
        <div />
      )
    }
  }
}

export default Event
