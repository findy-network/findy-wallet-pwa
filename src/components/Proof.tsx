import React from 'react'
import { Box } from 'grommet'
import styled from 'styled-components'
import { colors, BoldHeading, ChatParagraph, Line, ChatContent } from '../theme'
import { Checkmark } from 'grommet-icons'
import {
  IProofAttribute,
  IProofValue,
  IProofNode,
  IJobNode,
  JobStatus,
} from './Types'
import AcceptableJob from './AcceptableJob'
import Utils from './Utils'

type IProps = { proof: IProofNode; job: IJobNode }

const Span = styled.span`
  color: ${colors.brand};
`

const HelpSpan = styled(Span)`
  color: ${colors.selected};
  margin-top: 30px;
`

const RedHelpSpan = styled(HelpSpan)`
  color: ${colors.notOK};
`

function Proof({ proof, job }: IProps) {
  return (
    <AcceptableJob job={job} canAccept={proof.provable.provable}>
      <ChatContent>
        <BoldHeading>
          Proof Request{' '}
          {job.status === JobStatus.COMPLETE && (
            <Checkmark color={colors.selected} size="16px" />
          )}
        </BoldHeading>

        <Line></Line>
        <ChatParagraph>Prove following information:</ChatParagraph>
        {proof.attributes.map((item: IProofAttribute) => {
          const value = proof.values.find(
            (val: IProofValue) => val.attributeId === item.id
          )
          return (
            <Box key={item.id}>
              <Span>- {item.name} </Span>
              {job.status === JobStatus.COMPLETE && (
                <ChatParagraph>
                  proofed value: <HelpSpan>{value?.value}</HelpSpan>
                </ChatParagraph>
              )}
            </Box>
          )
        })}
        {proof.provable.provable && job.status === JobStatus.PENDING && (
          <HelpSpan>This proof is provable!</HelpSpan>
        )}
        {!proof.provable.provable && job.status === JobStatus.PENDING && (
          <RedHelpSpan>
            This proof is not provable!<br></br> Get credentials with needed
            attributes.
          </RedHelpSpan>
        )}
        <Line></Line>
        {job.status === JobStatus.COMPLETE && (
          <Box>
            <ChatParagraph>
              Proved attributes {Utils.toDateDotString(proof.approvedMs!)}
            </ChatParagraph>
          </Box>
        )}
      </ChatContent>
    </AcceptableJob>
  )
}

export default Proof
