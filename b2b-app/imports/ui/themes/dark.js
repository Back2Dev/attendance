import { createTheme } from '@material-ui/core/styles'

import defaultTheme from './default'
// console.log('default', defaultTheme)

export default createTheme({
  ...defaultTheme,
  palette: {
    type: 'dark',
    primary: {
      light: '#7986cb',
      main: '#9aa9ff',
      dark: '#303f9f',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff4081',
      main: '#f50057',
      dark: '#c51162',
      contrastText: '#fff',
    },
    text: {
      primary: '#fff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
      hint: 'rgba(255, 255, 255, 0.5)',
      icon: 'rgba(255, 255, 255, 0.5)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
    background: {
      paper: '#424242',
      default: '#303030',
    },
  },
  appBar: {
    color: '#00acc1',
  },
})
