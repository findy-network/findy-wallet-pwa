import React from 'react'
import { Switch, Route } from 'react-router-dom'
//import logo from './logo.svg'
import { Box, Grommet, grommet } from 'grommet'

import Navi from './components/Navi'
import Home from './components/Home'
import Event from './components/Event'
import Connections from './components/Connections'
import Connection from './components/Connection'
import Credentials from './components/Credentials'
import Me from './components/Me'
import Login from './components/Login'

function App() {
  return (
    <Grommet theme={grommet} full={true}>
      <Box fill={true}>
        <Login>
          <Navi>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/events/:id" component={Event} />
              <Route exact path="/connections" component={Connections} />
              <Route exact path="/connections/:id" component={Connection} />
              <Route exact path="/credentials" component={Credentials} />
              <Route exact path="/me" component={Me} />
            </Switch>
          </Navi>
        </Login>
      </Box>
    </Grommet>
  )
}

export default App
