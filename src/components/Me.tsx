import React, { useState } from 'react'
import { Box, Button, TextArea } from 'grommet'
import { useMutation, gql } from '@apollo/client'
import styled from 'styled-components'
import { RotateRight } from 'grommet-icons'
import { device } from '../theme'
const invitationFragment = gql`
  fragment InvitationFragment on InvitationResponse {
    id
    endpoint
    label
    raw
    imageB64
  }
`

Me.fragment = invitationFragment

const INVITATION_MUTATION = gql`
  mutation Invitation {
    invite {
      ...InvitationFragment
    }
  }
  ${invitationFragment}
`

const RawInvitation = styled(TextArea)`
  font-weight: 400;
  min-height: 256px;
`

const Generate = styled(Button)`
  margin: 3rem 0 1rem 0;
  max-width: 500px;
  border: 1px solid;
  padding: 10px;
`

const Copy = styled(Generate)`
  margin: 1rem auto 0;
`

const Invitation = styled(Box)`
  margin: 0 auto;
  flex-direction: column;
  max-width: 256px;
  @media ${device.tablet} {
    flex-direction: row;
    max-width: none;
    margin: 0;
  }
`

function Me() {
  const [copyBtn, setCopyBtn] = useState('Copy to clipboard')
  const [doInvite, { data }] = useMutation(INVITATION_MUTATION, {
    onCompleted: () => setCopyBtn('Copy to clipboard'),
  })
  if (data == null) {
    doInvite()
  }

  const copyToClipBoard = async (copiedText: string) => {
    try {
      await navigator.clipboard.writeText(copiedText)
      setCopyBtn('Copied')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <Generate
        icon={<RotateRight />}
        label="Regenerate"
        alignSelf="center"
        onClick={() => doInvite()}
      ></Generate>
      {data && (
        <>
          <Invitation
            margin="large"
            animation={{
              type: 'fadeIn',
              delay: 0,
              duration: 2000,
              size: 'large',
            }}
          >
            <img
              alt="invitation QR code"
              src={`data:image/png;base64,${data.invite.imageB64}`}
            />
            <RawInvitation
              readOnly
              resize={false}
              fill
              value={data.invite.raw}
            />
          </Invitation>
          <Copy
            label={copyBtn}
            onClick={() => copyToClipBoard(data.invite.raw)}
          ></Copy>
        </>
      )}
    </>
  )
}

export default Me
