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
      <Button
        label="Generate new invitation"
        onClick={() => doInvite()}
      ></Button>
      {data && (
        <>
          <Box fill="vertical" gap="small" margin="small" direction="column">
            <img
              alt="invitation QR code"
              src={`data:image/png;base64,${data.invite.imageB64}`}
            />
            <Box margin="small" height="medium" responsive={false}>
              <TextArea
                readOnly
                resize={false}
                fill
                style={{ height: '400px' }}
                value={data.invite.invitation}
                onFocus={(event) => {
                  event.target.select()
                }}
              />
            </Box>
          </Box>
        </>
      )}
    </>
  )
}

export default Me
