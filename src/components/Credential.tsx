import React from 'react'
import { Box } from 'grommet'
import styled from 'styled-components'
import { colors, Line, BoldHeading, ChatParagraph, ChatContent } from '../theme'
import Utils from './Utils'

import { ICredentialNode, ICredentialValue, IJobNode, JobStatus } from './Types'
import AcceptableJob from './AcceptableJob'
import { Checkmark } from 'grommet-icons'

type IProps = { credential: ICredentialNode; job: IJobNode }

const Span = styled.span`
  color: ${colors.brand};
`

const ValueSpan = styled(Span)`
  color: ${colors.selected};
  padding: 0 0 0 0.5rem;
`

function Credential({ credential, job }: IProps) {
  return (
    <AcceptableJob job={job}>
      <ChatContent>
        <BoldHeading>
          Credential Offer{' '}
          {job.status === JobStatus.COMPLETE && (
            <Checkmark color={colors.selected} size="16px" />
          )}
        </BoldHeading>
        <ChatParagraph>
          {Utils.parseSchemaName(credential.schemaId)}
        </ChatParagraph>
        <Line></Line>
        <Box pad="0 0 3px 0">
          {credential.attributes.map((item: ICredentialValue) => {
            return (
              <div key={item.id}>
                <Box direction="row">
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
            <ChatParagraph>
              Received this credential{' '}
              {Utils.toDateDotString(credential.issuedMs!)}
            </ChatParagraph>
          </Box>
        )}
      </ChatContent>
    </AcceptableJob>
  )
}

export default Credential
