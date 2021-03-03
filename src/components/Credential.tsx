import React from 'react'
import { Box } from 'grommet'

import { ICredentialNode, ICredentialValue, IJobNode } from './Types'
import AcceptableJob from './AcceptableJob'

type IProps = { credential: ICredentialNode; job: IJobNode }

function Credential({ credential, job }: IProps) {
  return (
    <AcceptableJob job={job} canAccept={true}>
      <strong>Credential {credential.id}</strong>
      <Box>
        {credential.attributes.map((item: ICredentialValue) => {
          return (
            <div key={item.id}>
              <div>
                <strong>Attribute:</strong>
                <span>{item.name}</span>
              </div>
              <div>
                <span>Value:</span>
                <span>{item.value}</span>
              </div>
            </div>
          )
        })}
      </Box>
    </AcceptableJob>
  )
}

export default Credential
