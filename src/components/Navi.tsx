import React, { ReactNode, useState } from 'react'
import styled, { css } from 'styled-components'
import { Link } from 'react-router-dom'

import {
  Box,
  Button as GrommetButton,
  Header,
  Heading,
  Sidebar as GrommetSidebar,
  Nav as GrommetNav,
  BoxProps,
  Layer,
} from 'grommet'
import {
  Scan as MeIcon,
  Home as HomeIcon,
  Menu as MenuIcon,
  Projects as ProjectsIcon,
  Certificate as CertificateIcon,
  Logout as LogoutIcon,
} from 'grommet-icons'

import EventNotifications from './EventNotifications'
import Add from './Add'

const Button = styled(GrommetButton)`
  padding: 12px;
`

const cssHideInWide = css`
  display: inline-block;
  @media screen and (min-width: 768px) {
    display: none;
  }
`
const cssShowInWide = css`
  display: none;
  @media screen and (min-width: 768px) {
    display: inline-block;
  }
`

const WideNav = styled(Box)`
  ${cssShowInWide}
  nav {
    justify-content: flex-end;
  }
`

const Nav = styled(GrommetNav)`
  a {
    color: inherit;
  }
`

const MenuButton = styled(GrommetButton)`
  ${cssHideInWide}
`

const Sidebar = GrommetSidebar

interface IProps {
  children: ReactNode
}

function Navi({ children }: IProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const nav = (direction: BoxProps['direction'] = 'row') => (
    <Nav gap="small" align="start" direction={direction}>
      <Link to="/">
        <Button
          icon={<HomeIcon />}
          hoverIndicator
          label="Home"
          plain
          onClick={() => setMenuOpen(false)}
        />
      </Link>
      <Link to="/me">
        <Button
          icon={<MeIcon />}
          hoverIndicator
          label="Me"
          plain
          onClick={() => setMenuOpen(false)}
        />
      </Link>
      <Link to="/connections">
        <Button
          icon={<ProjectsIcon />}
          hoverIndicator
          label="Connections"
          plain
          onClick={() => setMenuOpen(false)}
        />
      </Link>
      <Link to="/credentials">
        <Button
          icon={<CertificateIcon />}
          hoverIndicator
          label="Credentials"
          plain
          onClick={() => setMenuOpen(false)}
        />
      </Link>
      <Button
        icon={<LogoutIcon />}
        hoverIndicator
        label="Logout"
        plain
        onClick={() => {
          setMenuOpen(false)
          localStorage.clear()
          window.location.reload()
        }}
      />
    </Nav>
  )

  return (
    <>
      <Header pad="small" background="brand" justify="start">
        <MenuButton
          icon={<MenuIcon />}
          hoverIndicator
          onClick={() => setMenuOpen(!menuOpen)}
        />
        <Heading level={3} margin="none">
          <strong>Wallet</strong>
        </Heading>
        <WideNav fill>{nav('row')}</WideNav>
      </Header>

      <Box direction="row" flex overflow={{ horizontal: 'auto' }}>
        {menuOpen && (
          <Layer
            full="vertical"
            position="left"
            modal={true}
            plain={false}
            onEsc={() => setMenuOpen(false)}
            onClickOutside={() => setMenuOpen(false)}
            responsive={false}
          >
            <Sidebar background="brand">{nav('column')}</Sidebar>
          </Layer>
        )}
        <Box flex align="center" pad="medium">
          {children}
        </Box>
        <EventNotifications />
      </Box>
      <Add />
    </>
  )
}

export default Navi
