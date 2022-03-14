import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body {
    /* inter-regular - latin */
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 400;
      src: local(''),
           url('/fonts/inter-v3-latin-regular.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
           url('/fonts/inter-v3-latin-regular.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
    }
    /* inter-500 - latin */
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 500;
      src: local(''),
           url('/fonts/inter-v3-latin-500.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
           url('/fonts/inter-v3-latin-500.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
    }
    /* inter-700 - latin */
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 700;
      src: local(''),
           url('/fonts/inter-v3-latin-700.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
           url('/fonts/inter-v3-latin-700.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
    }

    font-family: Inter, Helvetica, Sans-Serif;
    font-size: 18px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html, body {
    height: 100%;
    min-height: 100%;
  }

  #root {
    height: 100%;
  }

  ::-webkit-scrollbar {
    display: none;
  }

`

export default GlobalStyle
