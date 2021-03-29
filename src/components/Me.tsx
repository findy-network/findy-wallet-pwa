import React from 'react'
import { Box, Button, TextArea } from 'grommet'
import { useMutation, gql } from '@apollo/client'
import styled from 'styled-components'

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
`

const Generate = styled(Button)`
  margin: 3rem 0 0 0;
  max-width: 500px;
  border: 1px solid;
`

function Me() {
  const [doInvite, { data }] = useMutation(INVITATION_MUTATION)

  return (
    <>
      <Generate
        alignSelf="center"
        label="Generate new invitation"
        onClick={() => doInvite()}
      ></Generate>
      {data && (
        <Box margin="large" direction="row">
          <img
            alt="invitation QR code"
            src={`data:image/png;base64,${data.invite.imageB64}`}
          />
          <RawInvitation readOnly resize={false} fill value={data.invite.raw} />
        </Box>
      )}
    </>
  )
}

export default Me
