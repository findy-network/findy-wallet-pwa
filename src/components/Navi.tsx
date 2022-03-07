import React, { ReactNode, useState, useContext, createContext } from 'react'
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
import { UserContext } from './Login'

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
    overflow: scroll;
    display: block;
    flex: 0 0 auto;
    width: 16.6666666667%;
  }
`

const DropBox = styled(Box)`
  position: absolute;
  z-index: 100;
  display: inline-block;
  width: 100%;
  background: ${colors.brand};
  @media ${device.tablet} {
    position: fixed;
    display: none;
    height: 100%;
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

const Username = styled(Box)`
  display: inline-block;
  color: ${colors.selected};
  padding: 1rem;
  margin-right: 1rem;
  @media ${device.tablet} {
    color: ${colors.darkBtnText};
    padding: 0.2rem 1.2rem;
    margin: 0rem 0.4rem;
  }
`

const ConnectionName = styled(Box)`
  font-size: 14px;
  display: block;
  @media ${device.tablet} {
    display: none;
  }
`

interface IProps {
  children: ReactNode
}

export const ConnectionContext = createContext<any>({})

function Navi({ children }: IProps) {
  const { username } = useContext(UserContext)
  const [menuOpen, setMenuOpen] = useState(false)
  const [connectionsOpen, setConnectionsOpen] = useState(false)
  const [connection, setConnection] = useState('')
  const connectionNav = (direction: BoxProps['direction'] = 'row') => (
    <Nav animation="fadeIn" gap="small" align="start" direction={direction}>
      <Add></Add>
      <Invite to="/me">
        <GreyButton
          label="New invitation"
          plain
          onClick={() => setMenuOpen(false)}
        />
      </Invite>
      {connectionsOpen && (
        <ConnectionBox>
          <Connections
            hideMenu={setMenuOpen}
            conOpen={setConnectionsOpen}
          ></Connections>
        </ConnectionBox>
      )}
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
        Chat
      </MenuLink>
      <MenuLink
        to="/credentials"
        activeClassName="active"
        onClick={() => {
          setMenuOpen(false)
          setConnection('')
          setConnectionsOpen(false)
        }}
      >
        Wallet
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
      <Username round="large" background="brand">
        {username}
      </Username>
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
            <Image fit="contain" src="/img/logo.svg" />
          </BrandBox>
        </Link>
        <ConnectionName>{connectionsOpen && connection}</ConnectionName>
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
      <Box direction="row" fill overflow="hidden">
        <EventNotifications closeMenu={() => setMenuOpen(false)} />
        <Sidebar background="brand">{connectionNav('column')}</Sidebar>
        <ConnectionContext.Provider
          value={{ setConnection, setConnectionsOpen }}
        >
          <Content pad="medium">{children}</Content>
        </ConnectionContext.Provider>
      </Box>
    </>
  )
}

export default Navi
