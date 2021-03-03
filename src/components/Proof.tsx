import React from 'react'
import { Box } from 'grommet'

import { IProofAttribute, IProofValue, IProofNode, IJobNode } from './Types'
import AcceptableJob from './AcceptableJob'

type IProps = { proof: IProofNode; job: IJobNode }

function Proof({ proof, job }: IProps) {
  return (
    <AcceptableJob job={job} canAccept={proof.provable.provable}>
      <strong>Proof {proof.id}</strong>
      <Box>
        {proof.provable.provable && <span>This proof is provable!</span>}
        {proof.attributes.map((item: IProofAttribute) => {
          const value = proof.values.find(
            (val: IProofValue) => val.attributeId === item.id
          )
          return (
            <div key={item.id}>
              <div>
                <strong>Attribute:</strong>
                <span>{item.name}</span>
              </div>
              <div>
                <span>Cred def ID:</span>
                <span>{item.credDefId}</span>
              </div>
              <div>
                <span>Value:</span>
                <span>{value?.value}</span>
              </div>
            </div>
          )
        })}
      </Box>
    </AcceptableJob>
  )
}

export default Proof
