import React, { useState } from 'react'

import Waiting from './Waiting'
import { Anchor, Button, Box, TextInput, Text } from 'grommet'

// Base64 to ArrayBuffer
const bufferDecode = (value: string) => {
  return Uint8Array.from(atob(value), (c) => c.charCodeAt(0))
}

// ArrayBuffer to URLBase64
const bufferEncode = (value: ArrayBuffer) => {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(value) as any))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

interface ICredentialDescriptor {
  id: string
  type: string
}

interface ICredential extends ICredentialDescriptor {
  rawId: ArrayBuffer
  response: {
    attestationObject: ArrayBuffer
    clientDataJSON: ArrayBuffer
  }
}

function WebauthnLogin() {
  const [register, setRegister] = useState(false)
  const [email, setEmail] = useState('')
  const doRegister = async () => {
    const response = await fetch(
      `http://localhost:8888/register/begin/${email}`
    )
    const { publicKey } = await response.json()
    const excludeCredentials = publicKey.excludeCredentials
      ? {
          excludeCredentials: publicKey.excludeCredentials.map(
            (item: ICredentialDescriptor) => ({
              ...item,
              id: bufferDecode(item.id),
            })
          ),
        }
      : {}
    const credential: ICredential = (await navigator.credentials.create({
      publicKey: {
        ...publicKey,
        challenge: bufferDecode(publicKey.challenge),
        user: {
          ...publicKey.user,
          id: bufferDecode(publicKey.user.id),
        },
        ...excludeCredentials,
      },
    })) as ICredential
    const {
      id,
      type,
      rawId,
      response: { attestationObject, clientDataJSON },
    } = credential
    const result = await fetch(
      `http://localhost:8888/register/finish/${email}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          rawId: bufferEncode(rawId),
          type,
          response: {
            attestationObject: bufferEncode(attestationObject),
            clientDataJSON: bufferEncode(clientDataJSON),
          },
        }),
      }
    )
    console.log(await result.json())
  }
  //const doLogin = async () =>
  return (
    <Box width="medium" margin="medium">
      <TextInput
        name="email"
        placeholder="email"
        maxLength={256}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Box direction="column" margin="small" align="center">
        {register ? (
          <>
            <Button
              disabled={email.length === 0}
              label="Register"
              onClick={doRegister}
            ></Button>
            <Text size="small">
              Existing user?{' '}
              <Anchor onClick={() => setRegister(false)}>Login</Anchor>
            </Text>
          </>
        ) : (
          <>
            <Button disabled={email.length === 0} label="Login"></Button>
            <Text size="small" onClick={() => setRegister(true)}>
              New user?{' '}
              <Anchor onClick={() => setRegister(true)}>Register</Anchor>
            </Text>
          </>
        )}
      </Box>
    </Box>
  )
}

export default WebauthnLogin
