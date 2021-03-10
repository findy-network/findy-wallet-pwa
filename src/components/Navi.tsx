import React, { ReactNode, useState, CSSProperties } from 'react'
import styled from 'styled-components'
import { Menu as MenuIco } from '@material-ui/icons'

import {
  Anchor,
  Box,
  Button as GrommetButton,
  Header,
  Image,
  Sidebar as GrommetSidebar,
  Nav,
  BoxProps,
  Collapsible
} from 'grommet'

import Add from './Add'
import Connections from './Connections';

const MenuIcon = styled(MenuIco)`
  vertical-align: middle;
`

const BrandBox = styled(Box)`
  width: 154px;
  padding: 1rem 2rem;
  text-decoration: none;
`

const MenuButton = styled(GrommetButton)`
  display: inline-block;
  margin-right: .5rem;
  margin-top: .25rem;
  padding: .25rem .75rem;
  line-height: 1;
  border-radius: .2rem;
  box-shadow: black;
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
  background: #2C2C31;
  @media screen and (min-width: 768px) {
    display: none;
  }
`

const ConnectionBox = styled(Box)`
  margin: 1rem 0rem .5rem;
  @media screen and (min-width: 768px) {
    margin: 5rem 0rem .5rem;
  }
`

const headerStyle: CSSProperties = {
  boxShadow: "0 .125rem .25rem rgba(0,0,0,.075)",
  textDecoration: "none",
  position: "sticky",
  top: (0),
  zIndex: (1020),
  background: "#FFFFFF",
  padding: ".5rem 0rem"
};

interface IProps {
  children: ReactNode
}

function Navi({ children }: IProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const nav = (direction: BoxProps['direction'] = 'row') => (
    <Nav gap="small" align="start" direction={direction}>
      <ConnectionBox margin="5rem 0rem .5rem">
        <Connections ></Connections>
      </ConnectionBox>
      <Add></Add>
    </Nav>
  )

  return (
    <>
      <Header justify="start" style={headerStyle}>
        <Anchor href="/">
          <BrandBox>
            <Image fit="cover" src="/img/logo.svg"/>
          </BrandBox>
        </Anchor>
        <Box style={{marginLeft:"auto"}}>
          <MenuButton
            icon={<MenuIcon style={{fontSize: "24px", color: "#0000008C"}} />}
            onClick={() => setMenuOpen(!menuOpen)}
          />
        </Box>
      </Header>
      <Collapsible open={menuOpen}>
        <DropBox animation={{"type": "slideDown", "duration": 800, "size": "xlarge"}}>{nav('column')}</DropBox>
      </Collapsible>
      <Box direction="row" fill>
        <Sidebar background="brand">{nav('column')}</Sidebar>
        <Box style={{position: "relative"}} pad="medium">{children}</Box>
      </Box>
    </>
  )
}

export default Navi
