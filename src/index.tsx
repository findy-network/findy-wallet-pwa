import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import * as serviceWorker from './serviceWorker'

import { ApolloProvider } from '@apollo/client'

import client from './apollo'

import './App.css'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)

// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()
