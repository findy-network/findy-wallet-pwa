import React, { ReactNode, useState, useContext } from 'react'
import styled from 'styled-components'
import { Menu as MenuIco } from 'grommet-icons'
import { Link, NavLink } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'
import { useLocation } from 'react-router-dom'

import EventNotifications from './EventNotifications'

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
} from 'grommet'

import Add from './Add'
import Connections from './Connections'

import { colors, device, GreyButton, Smoke } from '../theme'
import { UserContext } from './Login'

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

interface DropBoxProps {
  showDialog: boolean
}

const DropBox = styled(Box)<DropBoxProps>`
  position: absolute;
  z-index: ${(props) => (props.showDialog ? 0 : 100)};
  display: inline-block;
  width: 100%;
  min-height: 100%;
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

  .menu-item {
    text-decoration: none;
    display: inline-block;
    padding: 1rem;
    margin-right: 1rem;
    span {
      color: ${colors.background};
      &:hover {
        text-decoration: none;
      }
    }
  }
  @media ${device.tablet} {
    .menu-item {
      padding: 0.2rem 1.2rem;
      margin: 0rem 0.4rem;
      span {
        color: ${colors.brand};
        &:hover {
          text-decoration: none;
        }
      }
    }
  }

  .active {
    span {
      color: ${colors.active};
    }
  }
  @media ${device.tablet} {
    .active {
      span {
        color: ${colors.selected};
      }
    }
  }
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

export const GET_ACTIVE_CONNECTION = gql`
  query getActiveConnection {
    activeConnectionName @client
  }
`

function Navi({ children }: IProps) {
  const { username } = useContext(UserContext)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  let location = useLocation()
  const connectionNav = (direction: BoxProps['direction'] = 'row') => (
    <Nav animation="fadeIn" gap="small" align="start" direction={direction}>
      <Add
        onClick={() => setShowDialog(true)}
        onClose={() => setShowDialog(false)}
      ></Add>
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
      <NavLink
        to="/credentials"
        onClick={() => {
          setMenuOpen(false)
        }}
        className={({ isActive }) =>
          isActive ? 'menu-item active' : 'menu-item'
        }
      >
        <Anchor as="span" id="wallet-link">
          Wallet
        </Anchor>
      </NavLink>
      <NavLink
        to="/logout"
        className={({ isActive }) =>
          isActive ? 'menu-item active' : 'menu-item'
        }
        onClick={() => {
          localStorage.clear()
          window.location.reload()
        }}
      >
        <Anchor as="span">Logout</Anchor>
      </NavLink>
      <Username round="large" background="brand">
        {username}
      </Username>
    </OptionsBox>
  )

  const { data: activeConnection } = useQuery(GET_ACTIVE_CONNECTION)

  return (
    <>
      <Header justify="start">
        <Link to="/connections">
          <BrandBox
            onClick={() => {
              setMenuOpen(false)
            }}
          >
            <Image fit="contain" src="/img/logo.svg" />
          </BrandBox>
        </Link>
        {location.pathname.startsWith('/connections') && (
          <ConnectionName>
            {activeConnection?.activeConnectionName}
          </ConnectionName>
        )}
        <MenuBox>
          <MenuButton
            icon={<MenuIcon />}
            onClick={() => setMenuOpen(!menuOpen)}
          />
        </MenuBox>
        <WideOption>{options()}</WideOption>
      </Header>
      {showDialog && <Smoke />}
      <Collapsible open={menuOpen}>
        <DropBox
          showDialog={showDialog}
          animation={{ type: 'slideDown', duration: 800, size: 'xlarge' }}
        >
          {options('column')}
          {connectionNav('column')}
        </DropBox>
      </Collapsible>
      <Box direction="row" fill overflow="hidden">
        <EventNotifications closeMenu={() => setMenuOpen(false)} />
        <Sidebar background="brand">{connectionNav('column')}</Sidebar>
        <Content pad="medium">{children}</Content>
      </Box>
    </>
  )
}

export default Navi
