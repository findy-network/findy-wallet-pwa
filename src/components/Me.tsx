import React, { useState } from 'react'
import { Box, Button, TextArea } from 'grommet'

import { useMutation, gql } from '@apollo/client'
import Notification from './Notification'

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

function Me() {
  const [doInvite, { data }] = useMutation(INVITATION_MUTATION)
  const [copySuccess, setCopyNotification] = useState(false)

  const copyToClipBoard = async (copiedText: string) => {
    try {
      await navigator.clipboard.writeText(copiedText)
      setCopyNotification(true)
    } catch (err) {
      setCopyNotification(false)
    }
  }

  return (
    <>
      <Button
        label="Create new invitation"
        primary
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
                value={data.invite.invitation}
                onFocus={(event) => {
                  event.target.select()
                }}
              />
            </Box>
            <Button
              label="Copy to clipboard"
              onClick={() => copyToClipBoard(data.invite.invitation)}
            ></Button>
          </Box>
        </>
      )}
      {copySuccess && (
        <Notification
          text={`Invitation copied to clipboard`}
          onClose={() => {
            setCopyNotification(false)
          }}
        />

      )}
    </>
  )
}

export default Me
