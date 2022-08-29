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
  margin-bottom: 1rem;
  align-self: center;
`

const Invitation = styled(Box)`
  margin: 0 auto;
  flex-direction: column;
  max-width: 256px;
  justify-content: center;
  @media ${device.tablet} {
    flex-direction: row;
    max-width: none;
    margin: 0;
  }
`

const Container = styled.div`
  display: flex;
  justify-items: center;
  flex-direction: column;
  overflow-y: auto;
  hr {
    margin: 1rem 0;
  }
`

const CenterContainer = styled.div`
  display: flex;
  justify-items: center;
  flex-direction: column;
`

function Me() {
  const initialCopy = 'Copy to clipboard'
  const [copyBtn, setCopyBtn] = useState(initialCopy)
  const [copyUrlBtn, setCopyUrlBtn] = useState(initialCopy)
  const [doInvite, { data }] = useMutation(INVITATION_MUTATION, {
    onCompleted: () => {
      setCopyBtn(initialCopy)
      setCopyUrlBtn(initialCopy)
    },
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

  const copyUrlToClipBoard = async (copiedText: string) => {
    try {
      await navigator.clipboard.writeText(copiedText)
      setCopyUrlBtn('Copied')
    } catch (err) {
      console.log(err)
    }
  }

  const webWalletURL = data && data.invite ? `${window.location.origin}/connect/${btoa(data.invite.raw)}` : ""

  return (
    <Container>
      <Generate
        icon={<RotateRight />}
        label="Regenerate"
        alignSelf="center"
        onClick={() => doInvite()}
      ></Generate>
      {data && (
        <CenterContainer>
          <hr />
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
          <hr />
          <Invitation>
            <a href={webWalletURL}>Web Wallet URL</a>
          </Invitation>
          <Copy
              label={copyUrlBtn}
              onClick={() => copyUrlToClipBoard(webWalletURL)}
            ></Copy>
        </CenterContainer>
      )}
    </Container>
  )
}

export default Me
