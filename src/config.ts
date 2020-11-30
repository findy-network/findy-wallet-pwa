const gqlHost = process.env.REACT_APP_GQL_HOST || 'localhost:8085'
const authHost = process.env.REACT_APP_AUTH_HOST || 'localhost:8088'
const protocol = process.env.REACT_APP_PROTOCOL || 'http'

const config = {
  gqlHost,
  gqlUrl: `${protocol}://${gqlHost}`,
  authUrl: `${protocol}://${authHost}`,
}

export default config
