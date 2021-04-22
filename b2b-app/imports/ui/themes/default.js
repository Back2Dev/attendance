import { createMuiTheme } from '@material-ui/core/styles'
import createBreakpoints from '@material-ui/core/styles/createBreakpoints'

const breakpoints = createBreakpoints({})

export default createMuiTheme({
  typography: {
    htmlFontSize: 16,
    fontSize: 14,
    fontFamily: ['GothamRoundedLight', 'Arial', 'sans-serif'].join(','),
    h1: {
      fontFamily: '"GothamRoundedMedium", "Arial", sans-serif',
      fontSize: 30,
    },
    h2: {
      fontFamily: '"GothamRoundedMedium", "Arial", sans-serif',
      fontSize: 26,
    },
    h3: {
      fontFamily: '"GothamRoundedMedium", "Arial", sans-serif',
      fontSize: 24,
    },
    h4: {
      fontFamily: '"GothamRoundedMedium", "Arial", sans-serif',
      fontSize: 22,
    },
    h5: {
      fontFamily: '"GothamRoundedMedium", "Arial", sans-serif',
      fontSize: 20,
    },
    h6: {
      fontFamily: '"GothamRoundedMedium", "Arial", sans-serif',
      fontSize: 18,
    },
    button: {
      textTransform: 'none',
      fontFamily: '"GothamRoundedMedium", "Arial", sans-serif',
    },
  },
  palette: {
    primary: {
      main: '#4794fc',
    },
    secondary: {
      main: '#ea4435',
    },
    primary1Color: '#00acc1',
  },
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: '0.85em',
        fontFamily: 'GothamRoundedMedium',
      },
    },
    MuiContainer: {
      root: {
        [breakpoints.down('sm')]: {
          paddingLeft: '8px',
          paddingRight: '8px',
        },
      },
    },
  },
})
