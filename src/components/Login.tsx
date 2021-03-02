import React, { ReactNode } from 'react'
import { useQuery, gql } from '@apollo/client'

import Waiting from './Waiting'
import { Button } from 'grommet'
import WebauthnLogin from './WebauthnLogin'
import config from '../config'

const USER_QUERY = gql`
  query GetUser {
    user {
      name
    }
  }
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
        <div>
          <Button
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
        </div>
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
