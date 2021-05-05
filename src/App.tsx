import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { Box, Grommet } from 'grommet'

import Navi from './components/Navi'
import Home from './components/Home'
import Connection from './components/Connection'
import Credentials from './components/Credentials'
import Login from './components/Login'
import URLConnect from './components/URLConnect'
import Me from './components/Me'
import { findyTheme } from "./theme"

function App() {
  return (
    <Grommet theme={findyTheme} full={true}>
      <Box fill={true}>
        <Login>
          <Navi>
            <Switch>
              <Route exact path="/">
                <Redirect to="/connections" />
              </Route>
              <Route exact path="/connections" component={Home} />
              <Route exact path="/connections/:id" component={Connection} />
              <Route exact path="/credentials" component={Credentials} />
              <Route exact path="/connect/:invitation" component={URLConnect} />
              <Route exact path="/me" component={Me} />
            </Switch>
          </Navi>
        </Login>
      </Box>
    </Grommet>
  )
}

export default App
