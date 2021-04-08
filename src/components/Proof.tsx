import React from 'react'
import { Box, Paragraph } from 'grommet'
import styled from 'styled-components'
import { chat, colors } from '../theme'

import { IProofAttribute, IProofValue, IProofNode, IJobNode } from './Types'
import AcceptableJob from './AcceptableJob'

type IProps = { proof: IProofNode; job: IJobNode }

const P = styled(Paragraph)`
  padding: 9px 17px 11px 0px;
  margin: 0;
  font-size: ${chat.fontSize};
  color: ${colors.smallText};
  overflow: hidden;
`

const Content = styled(Box)`
  padding: 9px 17px 11px 17px;
  margin: 0;
  display: inline-block;
`

const Strong = styled.strong`
  color: ${colors.chatText};
`

const Span = styled.strong`
  color: ${colors.smallText};
`

function Proof({ proof, job }: IProps) {
  return (
    <AcceptableJob job={job} canAccept={proof.provable.provable}>
      <Content>
        <P>
          Proof: <Strong>{proof.id}</Strong>
        </P>
        {proof.provable.provable && <span>This proof is provable!</span>}
        {proof.attributes.map((item: IProofAttribute) => {
          const value = proof.values.find(
            (val: IProofValue) => val.attributeId === item.id
          )
          return (
            <div key={item.id}>
              <div>
                <span>{item.name} </span>
                <Span>{item.credDefId}</Span>
              </div>
              <div>
                <span>Value:</span>
                <strong>{value?.value}</strong>
              </div>
            </div>
          )
        })}
      </Content>
    </AcceptableJob>
  )
}

export default Proof
