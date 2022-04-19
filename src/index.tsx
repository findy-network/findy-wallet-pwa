import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import { ApolloProvider } from '@apollo/client'
import client from './apollo'
import GlobalStyle from './theme/globalStyle'
import * as serviceWorker from './serviceWorker'

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(
  <React.StrictMode>
    <GlobalStyle />
    <BrowserRouter>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>
)

// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()
