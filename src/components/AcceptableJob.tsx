import React, { ReactNode } from 'react'
import { Button } from 'grommet'

import { useMutation } from '@apollo/client'
import { IJobNode, JobStatus } from './Types'
import { RESUME_JOB_MUTATION } from './Queries'

type IProps = {
  job: IJobNode
  canAccept: boolean
  children: ReactNode
}

function AcceptableJob({ job, children, canAccept }: IProps) {
  const [resumeJob] = useMutation(RESUME_JOB_MUTATION)

  const doResume = (accept: boolean) =>
    resumeJob({ variables: { input: { id: job.id, accept } } })

  return (
    <div>
      {children}
      {job.status === JobStatus.PENDING && (
        <div>
          <Button onClick={() => doResume(false)} label="Decline"></Button>
          <Button
            disabled={!canAccept}
            onClick={() => doResume(true)}
            label="Accept"
          ></Button>
        </div>
      )}
    </div>
  )
}

export default AcceptableJob
