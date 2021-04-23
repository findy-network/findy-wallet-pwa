import React from 'react'
import { IJobNode, ProtocolType } from './Types'
import Message from './Message'
import Proof from './Proof'
import Credential from './Credential'
import JobBox from './Chat/JobBox'

type IProps = { job: IJobNode }

function Job({ job }: IProps) {
  switch (job.protocol) {
    case ProtocolType.BASIC_MESSAGE: {
      return job.output.message ? (
        <JobBox
          time={job.updatedMs}
          sentByMe={job.output.message?.node.sentByMe}
        >
          <Message message={job.output.message?.node} />
        </JobBox>
      ) : (
        <div />
      )
    }
    case ProtocolType.PROOF: {
      return job.output.proof ? (
        <JobBox time={job.updatedMs}>
          <Proof proof={job.output.proof?.node} job={job} />
        </JobBox>
      ) : (
        <div />
      )
    }
    case ProtocolType.CREDENTIAL: {
      return job.output.credential ? (
        <JobBox time={job.updatedMs}>
          <Credential credential={job.output.credential?.node} job={job} />
        </JobBox>
      ) : (
        <div />
      )
    }
  }
  return <></>
}

export default Job
