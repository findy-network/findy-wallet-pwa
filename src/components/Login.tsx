import React, { ReactNode } from 'react'
import { useQuery, gql } from '@apollo/client'

import Waiting from './Waiting'
import { Button } from 'grommet'

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
            label="Login"
            onClick={() =>
              fetch('http://localhost:8085/token').then(async (data) => {
                localStorage.setItem('token', await data.text())
                window.location.reload()
              })
            }
          />
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
