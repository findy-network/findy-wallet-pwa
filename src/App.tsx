import { Route, Routes, Navigate } from 'react-router-dom'
import { Box, Grommet } from 'grommet'

import Navi from './components/Navi'
import Home from './components/Home'
import Connection from './components/Connection'
import Credentials from './components/Credentials'
import Login from './components/Login'
import URLConnect from './components/URLConnect'
import Me from './components/Me'
import { findyTheme } from './theme'

function App() {
  return (
    <Grommet theme={findyTheme} style={{ height: '100%' }}>
      <Box fill={true}>
        <Login>
          <Navi>
            <Routes>
              <Route path="/" element={<Navigate to="/connections" />} />
              <Route path="/connections" element={<Home />} />
              <Route path="/connections/:id" element={<Connection />} />
              <Route path="/credentials" element={<Credentials />} />
              <Route path="/connect/:invitation" element={<URLConnect />} />
              <Route path="/me" element={<Me />} />
            </Routes>
          </Navi>
        </Login>
      </Box>
    </Grommet>
  )
}

export default App
