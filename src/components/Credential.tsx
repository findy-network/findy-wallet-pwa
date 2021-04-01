import React from 'react'
import { Box, Paragraph } from 'grommet'
import styled from 'styled-components'
import { chat, colors } from '../theme'
import Utils from './Utils'

import { ICredentialNode, ICredentialValue, IJobNode } from './Types'
import AcceptableJob from './AcceptableJob'

type IProps = { credential: ICredentialNode; job: IJobNode }

const P = styled(Paragraph)`
  padding: 9px 17px 11px 0px;
  margin: 0;
  font-size: ${chat.fontSize};
  color: ${colors.smallText};
  overflow: hidden;
`

const Content = styled(Box)`
  padding: ${chat.contentPadding};
  margin: 0;
  display: inline-block;
`
const Strong = styled.strong`
  color: ${colors.chatText};
  overflow-x: scroll;
`

const Span = styled.strong`
  color: ${colors.smallText};
`

function Credential({ credential, job }: IProps) {
  return (
    <AcceptableJob job={job} canAccept={true}>
      <Content>
        <P>
          Credential Offer:{' '}
          <Strong>{Utils.parseSchemaName(credential.schemaId)}</Strong>
        </P>
        {credential.attributes.map((item: ICredentialValue) => {
          return (
            <div key={item.id}>
              <Box pad="0 0 0 0" direction="row">
                <Span>{item.name}:</Span>
                <Box pad="0 0 0 0.5rem">
                  <strong>{item.value}</strong>
                </Box>
              </Box>
            </div>
          )
        })}
      </Content>
    </AcceptableJob>
  )
}

export default Credential
