import React, { ReactNode, useState } from 'react'
import styled from 'styled-components'
import { Menu as MenuIco } from 'grommet-icons'
import EventNotifications from './EventNotifications'

import { Link, NavLink, NavLinkProps } from 'react-router-dom'

import {
  Box,
  Button,
  Header as Head,
  Image,
  Sidebar as GrommetSidebar,
  Nav,
  BoxProps,
  Collapsible,
  Anchor,
  AnchorProps,
} from 'grommet'

import Add from './Add'
import Connections from './Connections'

import { colors, device, GreyButton } from '../theme'

export const AnchorLink: React.FC<AnchorLinkProps> = (props) => {
  return (
    <Anchor
      as={({ colorProp, hasIcon, hasLabel, focus, ...p }) => <NavLink {...p} />}
      {...props}
    />
  )
}

export type AnchorLinkProps = NavLinkProps &
  AnchorProps &
  Omit<JSX.IntrinsicElements['a'], 'color'>

const MenuIcon = styled(MenuIco)`
  vertical-align: middle;
  font-size: 24px;
  color: ${colors.icon};
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
  @media ${device.tablet} {
    display: none;
  }
`

const MenuLink = styled(AnchorLink)`
  &.${(props) => props.activeClassName} {
    color: ${colors.active};
  }
  display: inline-block;
  color: ${colors.inactive};
  padding: 1rem;
  margin-right: 1rem;
  &:hover {
    text-decoration: none;
    color: ${colors.active};
  }
  @media ${device.tablet} {
    &.${(props) => props.activeClassName} {
      color: ${colors.selected};
    }
    color: ${colors.brand};
    padding: 0.2rem 1.2rem;
    margin: 0rem 0.4rem;
    &:hover {
      text-decoration: none;
      color: ${colors.selected};
    }
  }
`

const Sidebar = styled(GrommetSidebar)`
  padding: 0px;
  display: none;
  @media ${device.tablet} {
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
  height: 100%;
  background: ${colors.brand};
  @media ${device.tablet} {
    display: none;
  }
`

const ConnectionBox = styled(Box)`
  margin: 0.5rem 0rem 0.5rem;
`

const OptionsBox = styled(Box)`
  margin-left: auto;
`

const WideOption = styled(Box)`
  display: none;
  @media ${device.tablet} {
    display: block;
  }
`

const Content = styled(Box)`
  position: flex;
  width: 100%;
  height: 100%;
  padding: 0 0.8rem;
`
const Header = styled(Head)`
  box-shadow: 0 0.125rem 0.25rem ${colors.shadow};
  text-decoration: none;
  position: sticky;
  top: 0;
  background: ${colors.background};
  padding: 0.5rem 0rem;
`

const Invite = styled(Link)`
  align-self: center;
  min-width: 205px;
`

interface IProps {
  children: ReactNode
}

function Navi({ children }: IProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [connectionsOpen, setConnectionsOpen] = useState(true)
  const connectionNav = (direction: BoxProps['direction'] = 'row') => (
    <Nav gap="small" align="start" direction={direction}>
      <Add></Add>
      <Invite to="/me">
        <GreyButton
          label="New invitation"
          plain
          onClick={() => setMenuOpen(false)}
        />
      </Invite>
      <ConnectionBox>
        <Connections hideMenu={setMenuOpen}></Connections>
      </ConnectionBox>
    </Nav>
  )

  const options = (direction: BoxProps['direction'] = 'row') => (
    <OptionsBox direction={direction}>
      <MenuLink
        to="/connections"
        activeClassName="active"
        onClick={() => {
          setMenuOpen(false)
          setConnectionsOpen(true)
        }}
      >
        Connections
      </MenuLink>
      <MenuLink
        to="/credentials"
        activeClassName="active"
        onClick={() => {
          setMenuOpen(false)
          setConnectionsOpen(false)
        }}
      >
        Credentials
      </MenuLink>
      <MenuLink
        to="/logout"
        exact
        activeClassName="active"
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
        <Link to="/connections">
          <BrandBox
            onClick={() => {
              setMenuOpen(false)
              setConnectionsOpen(true)
            }}
          >
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
          {connectionNav('column')}
        </DropBox>
      </Collapsible>
      <Box direction="row" fill>
        <EventNotifications />
        <Sidebar background="brand">
          {connectionsOpen && connectionNav('column')}
        </Sidebar>
        <Content pad="medium">{children}</Content>
      </Box>
    </>
  )
}

export default Navi
