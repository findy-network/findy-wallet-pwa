import React, { ReactNode, useState } from 'react'
import { Button, Box, Paragraph } from 'grommet'
import styled from 'styled-components'
import { chat, colors } from '../theme'

import { useMutation } from '@apollo/client'
import { IJobNode, JobStatus } from './Types'
import { RESUME_JOB_MUTATION } from './Queries'
import { RotateRight } from 'grommet-icons'

const Btn = styled(Button)`
  border: 1px solid;
  margin: 0.2rem;
  font-size: ${chat.buttonFontSize};
  color: ${colors.chatText};
`
const P = styled(Paragraph)`
  padding: 1px 10px 1px 10px;
  margin: 0;
  font-size: ${chat.fontSize};
  color: ${colors.smallText};
  overflow: hidden;
`

type IProps = {
  job: IJobNode
  canAccept: boolean
  children: ReactNode
}

function AcceptableJob({ job, children, canAccept }: IProps) {
  const [resumeJob] = useMutation(RESUME_JOB_MUTATION)

  function doResume(accept: boolean) {
    resumeJob({ variables: { input: { id: job.id, accept } } })
    disableAccept(true)
    disableDecline(true)
  }

  const [accept, disableAccept] = useState(!canAccept)
  const [decline, disableDecline] = useState(false)

  return (
    <div>
      {children}
      {job.status === JobStatus.PENDING && (
        <Box direction="row" pad="0 1rem 1rem">
          <Btn
            disabled={decline}
            onClick={() => doResume(false)}
            label="Decline"
          ></Btn>
          <Btn
            disabled={accept}
            onClick={() => doResume(true)}
            label="Accept"
          ></Btn>
        </Box>
      )}
      {job.status === JobStatus.WAITING && (
        <Box pad="0 0 1rem 1rem" direction="row">
          <Box animation="rotateRight">
            <RotateRight />
          </Box>
          <P>Processing</P>
        </Box>
      )}
    </div>
  )
}

export default AcceptableJob
