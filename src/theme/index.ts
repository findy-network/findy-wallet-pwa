import { Button } from 'grommet'
import styled from 'styled-components'

export const colors = {
  brand: '#2C2C31',
  selected: '#006EE6',
  inactive: 'rgba(255, 255, 255, 0.5)',
  active: '#FFFFFF',
  text: '#2C2C31',
  darkBtnText: '#FFFFFF',
  focus: '#2C2C31',
  darkBtnBackground: '#ffffff26',
  icon: '#0000008C',
  smallText: '#0000008C',
  shadow: 'rgba(0, 0, 0, 0.075)',
  background: '#FFFFFF',
  chatText: '#2f323b',
  chatBorder: '#dbdbdb',
  chatSent: '#e5e6ea',
  close: '#000',
  hover: '#f7f7f5',
  smoke: '#000',
  eventDot: '#FF0000',
}

const size = {
  mobileS: '320px',
  mobileM: '375px',
  mobileL: '425px',
  tablet: '768px',
  laptop: '1024px',
  laptopL: '1440px',
  desktop: '2560px',
}

export const Smoke = styled.div`
  position: fixed;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  background: ${colors.smoke};
  opacity: 0.6;
  z-index: 1;
`

export const device = {
  mobileS: `(min-width: ${size.mobileS})`,
  mobileM: `(min-width: ${size.mobileM})`,
  mobileL: `(min-width: ${size.mobileL})`,
  tablet: `(min-width: ${size.tablet})`,
  laptop: `(min-width: ${size.laptop})`,
  laptopL: `(min-width: ${size.laptopL})`,
  desktop: `(min-width: ${size.desktop})`,
  desktopL: `(min-width: ${size.desktop})`,
}

export const GreyButton = styled(Button)`
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 40px;
  color: ${colors.darkBtnText};
  background-color: ${colors.darkBtnBackground};
  padding: 0.5rem 3rem 0.5rem 3rem;
  text-align: center;
  min-width: 205px;
`
export const chat = {
  fontSize: '16px',
  buttonFontSize: '14px',
  mediaPad: '9px 17px 11px 17px',
  contentPad: '14px 21px',
  contentPadding: '9px 17px 11px 17px',
  inputHeight: '4rem',
  inputRadius: '0',
  inputMargin: '10px 0',
}

export const findyTheme = {
  button: {
    default: {},
    hover: {
      color: colors.darkBtnText,
      background: {
        color: 'brand',
      },
    },
    border: {
      width: '0px',
    },
  },
  global: {
    focus: {
      shadow: {
        size: '0px',
      },
    },
    colors,
    input: {
      font: {
        weight: 400,
      },
    },
    
  },
  heading: {
      weight: 500,
  },
}
