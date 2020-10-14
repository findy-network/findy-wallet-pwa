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
} from 'grommet'
import {
  Home as HomeIcon,
  Menu as MenuIcon,
  Projects as ProjectsIcon,
  Certificate as CertificateIcon,
  Logout as LogoutIcon,
} from 'grommet-icons'

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

const Sidebar = styled(GrommetSidebar)`
  ${cssHideInWide}
`

interface IProps {
  children: ReactNode
}

function Navi({ children }: IProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const nav = (direction: BoxProps['direction'] = 'row') => (
    <Nav gap="small" align="start" direction={direction}>
      <Link to="/">
        <Button icon={<HomeIcon />} hoverIndicator label="Home" plain />
      </Link>
      <Link to="/connections">
        <Button
          icon={<ProjectsIcon />}
          hoverIndicator
          label="Connections"
          plain
        />
      </Link>
      <Link to="/credentials">
        <Button
          icon={<CertificateIcon />}
          hoverIndicator
          label="Credentials"
          plain
        />
      </Link>
      <Button
        icon={<LogoutIcon />}
        hoverIndicator
        label="Logout"
        plain
        onClick={() => {
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
      <Box direction="row" fill>
        {menuOpen && <Sidebar background="brand">{nav('column')}</Sidebar>}
        <Box pad="medium">{children}</Box>
      </Box>
    </>
  )
}

export default Navi
