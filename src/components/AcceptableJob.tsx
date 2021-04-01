import React, { ReactNode, useState } from 'react'
import { Button, Box } from 'grommet'
import styled from 'styled-components'
import { chat, colors } from '../theme'

import { useMutation } from '@apollo/client'
import { IJobNode, JobStatus } from './Types'
import { RESUME_JOB_MUTATION } from './Queries'

const Btn = styled(Button)`
  border: 1px solid;
  margin: 0.2rem;
  font-size: ${chat.buttonFontSize};
  color: ${colors.chatText};
`

type IProps = {
  job: IJobNode
  canAccept: boolean
  children: ReactNode
}

function AcceptableJob({ job, children, canAccept }: IProps) {
  const [resumeJob] = useMutation(RESUME_JOB_MUTATION)

  const doResume = (accept: boolean) => (
    disableAccept(true),
    disableDecline(true),
    resumeJob({ variables: { input: { id: job.id, accept } } })
  )

  const [accept, disableAccept] = useState(!canAccept)
  const [decline, disableDecline] = useState(false)

  return (
    <div>
      {children}
      {job.status === JobStatus.PENDING && (
        <Box direction="row" pad="1rem">
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
    </div>
  )
}

export default AcceptableJob
