import React, { ReactNode } from 'react'
import { useQuery, gql } from '@apollo/client'
import Waiting from './Waiting'
import { Box, Heading, Text, Image } from 'grommet'
import WebauthnLogin from './WebauthnLogin'
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
  padding: 20px;
`

const CartoonBox = styled(Box)`
  @media ${device.tablet} {
    margin-bottom: 2rem;
  }
  width: 80%;
  margin: auto;
  justify-content: center;
  align-items: center;
  margin-bottom: 0rem;
`

const ImageBox = styled(Box)`
  @media ${device.tablet} {
    display: flex;
  }
  display: none;
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
          <CartoonBox direction="row-responsive" align="start" gap="small">
            <Box align="start" width="medium" pad="small">
              <Heading level={2}>Welcome to Findy Web Wallet</Heading>
              <Text size="medium">
                You can use your wallet to make connections with services and
                persons to receive and share verifiable data.
              </Text>
              <br />
              <Text size="medium">
                Start your journey by registering your device with email
                address. You don't need passwords - you can use your fingerprint
                or hardware key.
              </Text>
            </Box>
            <ImageBox height="medium" width="small">
              <Image src="/img/computer-m1.svg" fit="contain" />
            </ImageBox>
          </CartoonBox>

          <LoginBox elevation="medium">
            <Image
              style={{ width: '35%', margin: '20px auto' }}
              src="/img/logo.svg"
            />
            {window.PublicKeyCredential ? (
              <WebauthnLogin />
            ) : (
              <div>
                <CartoonBox
                  direction="row-responsive"
                  align="start"
                  gap="small"
                >
                  <Box align="start" width="medium" pad="small">
                    <Heading level={2}>Welcome to Findy Web Wallet</Heading>
                    <Text size="medium">
                      Web wallet login not supported in this browser!
                    </Text>
                  </Box>
                  <ImageBox height="medium" width="small">
                    <Image src="/img/sad-computer-m2.svg" fit="contain" />
                  </ImageBox>
                </CartoonBox>
              </div>
            )}
          </LoginBox>
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
