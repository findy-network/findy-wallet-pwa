import React, { useState } from 'react'
import { Anchor, Button, Box, TextInput, Text } from 'grommet'
import config from '../config'
import styled from 'styled-components'
import { RotateRight } from 'grommet-icons'
import { Base64 } from 'js-base64';

import { Line } from '../theme'
import { colors } from '../theme'

// Base64 to ArrayBuffer
const bufferDecode = (value: string) => {
  return Base64.toUint8Array(value)
}

// ArrayBuffer to URLBase64
const bufferEncode = (value: ArrayBuffer) => {
  return Base64.btoa(String.fromCharCode.apply(null, new Uint8Array(value) as any))
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
    attestationObject?: ArrayBuffer
    clientDataJSON?: ArrayBuffer
    authenticatorData?: ArrayBuffer
    signature?: ArrayBuffer
    userHandle?: ArrayBuffer
  }
}

const doFetch = async (
  url: string,
  body: object | undefined = undefined
): Promise<any> => {
  return fetch(url, {
    credentials: 'include',
    ...(body
      ? {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      : {}),
  })
}

const Login = styled(Box)`
  margin: auto;
`

const Btn = styled(Button)`
  padding: 15px;
  width: 60%;
  text-align: center;
  background: ${colors.selected};
  color: ${colors.darkBtnText};
  box-shadow: 0px 8px 15px rgba(0, 110, 230, 0.2);
`

const ModeAnchor = styled(Anchor)`
  color: ${colors.selected};
`

function WebauthnLogin() {
  const [register, setRegister] = useState(false)
  const [waiting, setWaiting] = useState(false)
  const [email, setEmail] = useState('')
  const [operationResult, setOperationResult] = useState('')
  const userVerificationDiscouraged = 'discouraged'
  const doRegister = async () => {
    setOperationResult('')
    const setError = () => {
      setWaiting(false)
      setOperationResult(`Unable to register this device for email ${email}`)
      setEmail('')
    }

    setWaiting(true)
    const response = await doFetch(`${config.authUrl}/register/begin/${email}`)
    if (response.status !== 200) {
      setError()
      return
    }
    const { publicKey } = await response.json()
    const authenticatorSelection = publicKey.authenticatorSelection || {}
    const credential: ICredential = (await navigator.credentials.create({
      publicKey: {
        ...publicKey,
        challenge: bufferDecode(publicKey.challenge),
        authenticatorSelection: {
          ...authenticatorSelection,
          userVerification:
            authenticatorSelection.userVerification ||
            userVerificationDiscouraged,
        },
        user: {
          ...publicKey.user,
          id: bufferDecode(publicKey.user.id),
        },
        ...(publicKey.excludeCredentials
          ? {
              excludeCredentials: publicKey.excludeCredentials.map(
                (item: ICredentialDescriptor) => ({
                  ...item,
                  id: bufferDecode(item.id),
                })
              ),
            }
          : {}),
      },
    })) as ICredential
    const {
      id,
      type,
      rawId,
      response: { attestationObject, clientDataJSON },
    } = credential
    setWaiting(true)
    const result = await doFetch(`${config.authUrl}/register/finish/${email}`, {
      id,
      rawId: bufferEncode(rawId),
      type,
      response: {
        attestationObject: bufferEncode(attestationObject!),
        clientDataJSON: bufferEncode(clientDataJSON!),
      },
    })
    if (result.status !== 200) {
      setError()
      return
    } else {
      setWaiting(false)
      setOperationResult(`Registration succeeded. You can now login.`)
      setRegister(false)
    }
  }

  const doLogin = async () => {
    setOperationResult('')
    const setError = () => {
      setWaiting(false)
      setOperationResult(`Unable to login with this device for email ${email}`)
      setEmail('')
    }

    setWaiting(true)
    const response = await doFetch(`${config.authUrl}/login/begin/${email}`)
    if (response.status !== 200) {
      setError()
      return
    }
    const { publicKey } = await response.json()
    const credential: ICredential = (await navigator.credentials.get({
      publicKey: {
        ...publicKey,
        challenge: bufferDecode(publicKey.challenge),
        userVerification:
          publicKey.userVerification || userVerificationDiscouraged,
        allowCredentials: publicKey.allowCredentials.map(
          (item: ICredentialDescriptor) => ({
            ...item,
            id: bufferDecode(item.id),
          })
        ),
      },
    })) as ICredential
    const {
      id,
      type,
      rawId,
      response: { authenticatorData, clientDataJSON, signature, userHandle },
    } = credential
    setWaiting(true)
    const result = await doFetch(`${config.authUrl}/login/finish/${email}`, {
      id,
      rawId: bufferEncode(rawId),
      type,
      response: {
        authenticatorData: bufferEncode(authenticatorData!),
        clientDataJSON: bufferEncode(clientDataJSON!),
        signature: bufferEncode(signature!),
        userHandle: bufferEncode(userHandle!),
      },
    })
    if (result.status !== 200) {
      setError()
      return
    } else {
      setWaiting(false)
      const token = await result.json()
      localStorage.setItem('token', token.token)
      window.location.reload()
    }
  }

  const tryDoRegister = async () => {
    try {
      await doRegister()
    } catch (err) {
      // Sometimes iOS safari fails with
      // "Unhandled Promise Rejection: NotAllowedError: This request has been cancelled by the user."
      console.log(err)
      setOperationResult("Register failed for unknown reason. Please retry.")
      setWaiting(false)
    }
  }

  const tryDoLogin = async () => {
    try {
      await doLogin()
    } catch (err) {
      // Sometimes iOS safari fails with
      // "Unhandled Promise Rejection: NotAllowedError: This request has been cancelled by the user."
      console.log(err)
      setOperationResult("Login failed for unknown reason. Please retry.")
      setWaiting(false)
    }
  }

  const toggleRegister = (registerValue: boolean) => {
    setRegister(registerValue)
    setOperationResult('')
  }
  return (
    <Login width="medium" margin="medium">
      <TextInput
        id="user-input"
        autoComplete="on"
        name="email"
        placeholder="email"
        maxLength={256}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Box direction="column" margin="12px 0 0 0" align="center">
        {register ? (
          <>
            <Btn
              id="register-btn"
              disabled={email.length === 0 || waiting}
              label="Register"
              onClick={tryDoRegister}
            ></Btn>
            <Text size="small" margin="12px 0 0 0">
              Existing user?{' '}
              <ModeAnchor
                id="login-link"
                disabled={waiting}
                onClick={() => toggleRegister(false)}
              >
                Login
              </ModeAnchor>
            </Text>
          </>
        ) : (
          <>
            <Btn
              id="login-btn"
              disabled={email.length === 0 || waiting}
              label="Login"
              onClick={tryDoLogin}
            ></Btn>
            <Text size="small" margin="12px 0 0 0">
              New user?{' '}
              <ModeAnchor
                id="register-link"
                disabled={waiting}
                onClick={() => toggleRegister(true)}
              >
                Register
              </ModeAnchor>
            </Text>
          </>
        )}
        {operationResult !== '' && (
          <Text textAlign="center">
            <Line></Line>
            {operationResult}
          </Text>
        )}
        {waiting && (
          <Box width="24px" animation="rotateRight">
            <RotateRight />
          </Box>
        )}
      </Box>
    </Login>
  )
}

export default WebauthnLogin
