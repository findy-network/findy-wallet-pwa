import React from 'react'
import { Box, Button, Heading, TextArea } from 'grommet'

import { useMutation, gql } from '@apollo/client'

const INVITATION_MUTATION = gql`
  mutation Invitation {
    invite {
      invitation
      imageB64
    }
  }
`

function Me() {
  const [doInvite, { data }] = useMutation(INVITATION_MUTATION)

  return (
    <>
      <Heading level={2}>Me</Heading>

      <Button
        label="Generate new invitation"
        onClick={() => doInvite()}
      ></Button>
      {data && (
        <Box margin="large" direction="row">
          <img
            alt="invitation QR code"
            src={`data:image/png;base64,${data.invite.imageB64}`}
          />
          <TextArea
            readOnly
            resize={false}
            fill
            value={data.invite.invitation}
          />
        </Box>
      )}
    </>
  )
}

export default Me
