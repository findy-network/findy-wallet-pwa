const gqlHost = process.env.REACT_APP_GQL_HOST || 'localhost:8085'
const authHost = process.env.REACT_APP_AUTH_HOST || 'localhost:8088'
const httpScheme = process.env.REACT_APP_HTTP_SCHEME || 'http'
const wsScheme = process.env.REACT_APP_WS_SCHEME || 'ws'

const config = {
  wsUrl: `${wsScheme}://${gqlHost}/`,
  gqlUrl: `${httpScheme}://${gqlHost}`,
  authUrl: `${httpScheme}://${authHost}`,
}

export default config
