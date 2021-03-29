import React from 'react'
import { Box, Paragraph } from 'grommet'
import styled from 'styled-components'
import { chat, colors } from '../theme'
import Utils from './Utils'

import { ICredentialNode, ICredentialValue, IJobNode } from './Types'
import AcceptableJob from './AcceptableJob'

type IProps = { credential: ICredentialNode; job: IJobNode }

const P = styled(Paragraph)`
  padding: 9px 17px 11px 0px;
  margin: 0;
  font-size: ${chat.fontSize};
  color: ${colors.smallText};
`

const Content = styled(Box)`
  padding: ${chat.contentPadding};
  margin: 0;
  display: inline-block;
`

function Credential({ credential, job }: IProps) {
  return (
    <AcceptableJob job={job} canAccept={true}>
      <Content>
        <P>
          Credential:{' '}
          <strong style={{ color: colors.chatText }}>
            {Utils.getSchemaName(credential.schemaId)}
          </strong>
        </P>
        {credential.attributes.map((item: ICredentialValue) => {
          return (
            <div key={item.id}>
              <Box pad="0 0 0 0" direction="row">
                <span style={{ color: colors.smallText }}>{item.name}:</span>
                <Box pad="0 0 0 0.5rem">
                  <strong>{item.value}</strong>
                </Box>
              </Box>
            </div>
          )
        })}
      </Content>
    </AcceptableJob>
  )
}

export default Credential
