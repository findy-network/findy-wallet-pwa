import React from 'react'
import { IJobNode, ProtocolType } from './Types'
import Message from './Message'
import Proof from './Proof'
import Credential from './Credential'

type IProps = { job: IJobNode }

function Job({ job }: IProps) {
  switch (job.protocol) {
    case ProtocolType.BASIC_MESSAGE: {
      return job.output.message ? (
        <Message message={job.output.message?.node} />
      ) : (
        <div />
      )
    }
    case ProtocolType.PROOF: {
      return job.output.proof ? (
        <Proof proof={job.output.proof?.node} job={job} />
      ) : (
        <div />
      )
    }
    case ProtocolType.CREDENTIAL: {
      return job.output.credential ? (
        <Credential credential={job.output.credential?.node} job={job} />
      ) : (
        <div />
      )
    }
  }
  return <></>
}

export default Job
