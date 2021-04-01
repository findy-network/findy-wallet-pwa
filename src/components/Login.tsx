import React, { ReactNode } from 'react'
import { useQuery, gql } from '@apollo/client'

import Waiting from './Waiting'
import { Button, Box } from 'grommet'
import WebauthnLogin from './WebauthnLogin'
import config from '../config'
import styled from 'styled-components'
import { device } from '../theme'

const USER_QUERY = gql`
  query GetUser {
    user {
      name
    }
  }
`
const LoginBox = styled(Box)`
  @media ${device.tablet} {
    width: 30%;
  }
  width: 80%;
  margin: auto;
  padding: 10px;
`

const PlaygroundButton = styled(Button)`
  margin: 1rem;
`
interface IProps {
  children: ReactNode
}

function Login({ children }: IProps) {
  const { error, loading } = useQuery(USER_QUERY, { errorPolicy: 'all' })
  const unauthenticated = error?.graphQLErrors.find(
    (item) => item.extensions && item.extensions.code === 'UNAUTHENTICATED'
  )

  return (
    <>
      {unauthenticated ? (
        <LoginBox elevation="medium">
          <PlaygroundButton
            label="Playground login"
            onClick={() =>
              fetch(`${config.gqlUrl}/token`).then(async (data) => {
                localStorage.setItem('token', await data.text())
                window.location.reload()
              })
            }
          />
          {window.PublicKeyCredential ? (
            <WebauthnLogin />
          ) : (
            <div>Wallet login not supported in this browser :(</div>
          )}
        </LoginBox>
      ) : (
        <>
          {loading || error ? (
            <Waiting loading={loading} error={error} />
          ) : (
            children
          )}
        </>
      )}
    </>
  )
}

export default Login
