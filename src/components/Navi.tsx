import React, { ReactNode, useState } from 'react'
import styled from 'styled-components'
import { Menu as MenuIco } from 'grommet-icons'

import { Link } from 'react-router-dom'

import {
  Box,
  Button,
  Header as Head,
  Image,
  Sidebar as GrommetSidebar,
  Nav,
  BoxProps,
  Collapsible,
} from 'grommet'

import Add from './Add'
import Connections from './Connections'

import { colors } from '../theme'

const MenuIcon = styled(MenuIco)`
  vertical-align: middle;
  font-size: 24px;
  color: ${colors.menuIcon};
`

const BrandBox = styled(Box)`
  width: 154px;
  height: 57.31px;
  padding: 1rem 2rem;
`

const MenuBox = styled(Box)`
  margin-left: auto;
`

const MenuButton = styled(Button)`
  display: inline-block;
  margin-right: 0.5rem;
  margin-top: 0.25rem;
  margin-left: auto;
  padding: 0.25rem 0.75rem;
  line-height: 1;
  border-radius: 0.2rem;
  box-shadow: ${colors.shadow};
  @media screen and (min-width: 768px) {
    display: none;
  }
`

const Sidebar = styled(GrommetSidebar)`
  padding: 0px;
  display: none;
  @media screen and (min-width: 768px) {
    display: block;
    flex: 0 0 auto;
    width: 16.6666666667%;
  }
`

const DropBox = styled(Box)`
  position: fixed;
  z-index: 100;
  display: inline-block;
  width: 100%;
  background: ${colors.brand};
  @media screen and (min-width: 768px) {
    display: none;
  }
`

const ConnectionBox = styled(Box)`
  margin: 1rem 0rem 0.5rem;
  @media screen and (min-width: 768px) {
    margin: 5rem 0rem 0.5rem;
  }
`

const OptionsBox = styled(Box)`
  margin-left: auto;
`

const OptionBtn = styled(Button)`
  color: ${colors.darkBtnText};
  padding: 1rem;
  margin-right: 1rem;
  @media screen and (min-width: 768px) {
    color: ${colors.text};
    padding: 0.2rem 1.2rem;
    margin: 0rem 0.4rem;
  }
`

const WideOption = styled(Box)`
  display: none;
  @media screen and (min-width: 768px) {
    display: block;
  }
`

const Content = styled(Box)`
  position: relative;
`

const Header = styled(Head)`
  box-shadow: 0 0.125rem 0.25rem ${colors.shadow};
  text-decoration: none;
  position: sticky;
  top: 0;
  zindex: 1020;
  background: ${colors.background};
  padding: 0.5rem 0rem;
`

interface IProps {
  children: ReactNode
}

function Navi({ children }: IProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const nav = (direction: BoxProps['direction'] = 'row') => (
    <Nav gap="small" align="start" direction={direction}>
      <ConnectionBox margin="5rem 0rem 0.5rem">
        <Connections hideMenu={setMenuOpen}></Connections>
      </ConnectionBox>
      <Add></Add>
    </Nav>
  )

  const options = (direction: BoxProps['direction'] = 'row') => (
    <OptionsBox direction={direction}>
      <Link to="/me">
        <OptionBtn label="Connect" onClick={() => setMenuOpen(!menuOpen)} />
      </Link>
      <Link to="/credentials">
        <OptionBtn label="Credentials" onClick={() => setMenuOpen(!menuOpen)} />
      </Link>
      <OptionBtn
        label="Logout"
        onClick={() => {
          localStorage.clear()
          window.location.reload()
        }}
      />
    </OptionsBox>
  )

  return (
    <>
      <Header justify="start">
        <Link to="/">
          <BrandBox>
            <Image fit="cover" src="/img/logo.svg" />
          </BrandBox>
        </Link>
        <MenuBox>
          <MenuButton
            icon={<MenuIcon />}
            onClick={() => setMenuOpen(!menuOpen)}
          />
        </MenuBox>
        <WideOption>{options()}</WideOption>
      </Header>
      <Collapsible open={menuOpen}>
        <DropBox
          animation={{ type: 'slideDown', duration: 800, size: 'xlarge' }}
        >
          {options('column')}
          {nav('column')}
        </DropBox>
      </Collapsible>
      <Box direction="row" fill>
        <Sidebar background="brand">{nav('column')}</Sidebar>
        <Content pad="medium">{children}</Content>
      </Box>
    </>
  )
}

export default Navi
