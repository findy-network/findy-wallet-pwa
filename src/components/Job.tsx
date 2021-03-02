import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Box, Button, Heading } from 'grommet'

import { useQuery, useMutation, gql } from '@apollo/client'
import Waiting from './Waiting'
import Message from './Message'
import { credential as credentialFragments, pairwise as connFragments } from './Fragments'
import Proof from './Proof'
import { IJobNode, JobStatus, ProtocolType } from './Types'

const nodeFragment = gql`
  fragment JobNodeFragment on Job {
    id
    protocol
    initiatedByUs
    status
    result
    createdMs
    updatedMs
    output {
      connection {
        ...PairwiseEdgeFragment
      }
      message {
        ...MessageEdgeFragment
      }
      credential {
        ...CredentialEdgeFragment
      }
      proof {
        ...ProofEdgeFragment
      }
    }
  }
  ${connFragments.edge}
  ${Message.fragments.edge}
  ${credentialFragments.edge}
  ${Proof.fragments.edge}
`

Job.fragments = {
  node: nodeFragment,
  edge: gql`
    fragment JobEdgeFragment on JobEdge {
      node {
        ...JobNodeFragment
      }
      cursor
    }
    ${nodeFragment}
  `,
}

export const JOB_QUERY = gql`
  query GetJob($id: ID!) {
    job(id: $id) {
      ...JobNodeFragment
    }
  }
  ${Job.fragments.node}
`

const RESUME_JOB_MUTATION = gql`
  mutation ResumeJob($input: ResumeJobInput!) {
    resume(input: $input) {
      ok
    }
  }
`

type TParams = { id: string }

function Job({ match }: RouteComponentProps<TParams>) {
  const { loading, error, data } = useQuery(JOB_QUERY, {
    variables: {
      id: match.params.id,
    },
  })
  const [resumeJob] = useMutation(RESUME_JOB_MUTATION)

  const node: IJobNode = data?.job

  const doResume = (accept: boolean) =>
    resumeJob({ variables: { input: { id: node.id, accept } } })

  // Enable accept button if this is not proof OR the proof is provable!
  const enableAccept =
    node?.protocol !== ProtocolType.PROOF ||
    node.output.proof?.node.provable.provable
  return (
    <>
      {loading || error ? (
        <Waiting loading={loading} error={error} />
      ) : (
          <>
            <Heading level={2}>Job {node.id}</Heading>
            <Box>
              {node.protocol === ProtocolType.CREDENTIAL &&
                node.output.credential && (
                  <Box>
                    <Heading level={4}>Credential offer</Heading>
                    <Box> {node.output.credential?.node.schemaId}</Box>
                    <Box>
                      {node.output.credential?.node.attributes.map((item) => (
                        <div key={item.name}>
                          {item.name}: {item.value}
                        </div>
                      ))}
                    </Box>
                  </Box>
                )}
              {node.protocol === ProtocolType.PROOF && node.output.proof && (
                <Box>
                  <Heading level={4}>Proof request</Heading>
                  <Box>
                    {node.output.proof?.node.attributes.map((item) => (
                      <div key={item.name}>
                        <div>
                          {item.name} ({item.credDefId})
                      </div>
                      </div>
                    ))}
                  </Box>
                </Box>
              )}
              {node.status === JobStatus.PENDING && (
                <div>
                  <Button
                    onClick={() => doResume(false)}
                    label="Decline"
                  ></Button>
                  <Button
                    disabled={!enableAccept}
                    onClick={() => doResume(true)}
                    label="Accept"
                  ></Button>
                </div>
              )}
            </Box>
          </>
        )}
    </>
  )
}

export default Job
