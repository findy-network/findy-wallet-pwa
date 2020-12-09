import React from 'react'
import { Switch, Route } from 'react-router-dom'
//import logo from './logo.svg'
import { Box, Grommet, grommet } from 'grommet'
import { deepMerge } from 'grommet/utils'

import theme from './theme'

import Navi from './components/Navi'
import Home from './components/Home'
import Event from './components/Event'
import Connections from './components/Connections'
import Connection from './components/Connection'
import Job from './components/Job'
import Credentials from './components/Credentials'
import Credential from './components/Credential'
import Message from './components/Message'
import Proof from './components/Proof'
import Me from './components/Me'
import Login from './components/Login'

const appTheme = deepMerge(grommet, theme)

function App() {
  return (
    <Grommet theme={appTheme} full={true}>
      <Box fill={true}>
        <Login>
          <Navi>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/events/:id" component={Event} />
              <Route exact path="/jobs/:id" component={Job} />
              <Route exact path="/connections" component={Connections} />
              <Route exact path="/connections/:id" component={Connection} />
              <Route exact path="/credentials" component={Credentials} />
              <Route exact path="/credentials/:id" component={Credential} />
              <Route exact path="/messages/:id" component={Message} />
              <Route exact path="/proofs/:id" component={Proof} />
              <Route exact path="/me" component={Me} />
            </Switch>
          </Navi>
        </Login>
      </Box>
    </Grommet>
  )
}

export default App
