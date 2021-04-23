import React from 'react'
import { Box, Paragraph } from 'grommet'
import styled from 'styled-components'
import { chat, colors } from '../theme'
import Utils from './Utils'

import { ICredentialNode, ICredentialValue, IJobNode, JobStatus } from './Types'
import AcceptableJob from './AcceptableJob'
import { Checkmark } from 'grommet-icons'

type IProps = { credential: ICredentialNode; job: IJobNode }

const P = styled(Paragraph)`
  padding: 3px 17px 3px 0px;
  margin: 0;
  font-size: ${chat.fontSize};
  color: ${colors.smallText};
  overflow: hidden;
`

const Content = styled(Box)`
  padding: ${chat.contentPadding};
  margin: 0;
  display: inline-block;
  width: 100%;
`
const Line = styled(Paragraph)`
  text-align: center;
  border-bottom: 1px solid ${colors.chatBorder};
  line-height: 0.1em;
  width: 100%;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`

const Span = styled.span`
  color: ${colors.brand};
`
const ValueSpan = styled(Span)`
  color: ${colors.selected};
  padding: 0 0 0 0.5rem;
`

// todo add declined credential
function Credential({ credential, job }: IProps) {
  return (
    <AcceptableJob job={job} canAccept={true}>
      <Content>
        <P style={{ fontWeight: 'bold' }}>
          Credential Offer{' '}
          {job.status === JobStatus.COMPLETE && (
            <Checkmark color={colors.selected} size="16px" />
          )}
        </P>
        <Line></Line>
        <P>{Utils.parseSchemaName(credential.schemaId)}</P>
        <Box pad="0 0 10px 0">
          {credential.attributes.map((item: ICredentialValue) => {
            return (
              <div key={item.id}>
                <Box pad="0 20px" direction="row">
                  <Span>{item.name}:</Span>
                  <ValueSpan>{item.value}</ValueSpan>
                </Box>
              </div>
            )
          })}
        </Box>
        <Line></Line>
        {job.status === JobStatus.COMPLETE && (
          <Box>
            <P>
              Received this credential{' '}
              {Utils.toDateDotString(credential.issuedMs!)}
            </P>
          </Box>
        )}
      </Content>
    </AcceptableJob>
  )
}

export default Credential
