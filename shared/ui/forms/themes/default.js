import { createTheme, responsiveFontSizes } from '@mui/material/styles'

let theme = createTheme({
  typography: {
    htmlFontSize: 18,
    fontSize: 16,
    lineHeight: 20,
    fontFamily: ['GothamRoundedLight', 'Arial', 'sans-serif'].join(','),

    body1: {},
    body2: {
      marginBottom: 16,
    },

    h1: {
      fontFamily: '"GothamRoundedMedium", "Arial", sans-serif',
      fontSize: 48,
      lineHeight: 1.1,
      marginBottom: 30,
    },
    h2: {
      fontFamily: '"GothamRoundedMedium", "Arial", sans-serif',
      fontSize: 38,
      lineHeight: 1.1,
      marginBottom: 20,
    },
    h3: {
      fontFamily: '"GothamRoundedLight", "Arial", sans-serif',
      fontSize: 34,
      lineHeight: 1.1,
      marginBottom: 20,
    },
    h4: {
      fontFamily: '"GothamRoundedLight", "Arial", sans-serif',
      fontSize: 18,
      lineHeight: 1.1,
      marginBottom: 20,
    },
    h5: {
      fontFamily: '"GothamRoundedLight", "Arial", sans-serif',
      fontSize: 16,
      marginBottom: 16,
    },
    h6: {
      fontFamily: '"GothamRoundedLight", "Arial", sans-serif',
      fontSize: 16,
      marginBottom: 16,
    },
    subtitle2: {
      fontFamily: '"GothamRoundedMedium", "Arial", sans-serif',
      fontSize: 16,
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
      main: '#0a3370',
    },
    white: { main: '#ffffff' },
    blue: { main: '#4794fc' },
    navy: { main: '#0a3370' },
    sky: {
      light: '#bae1fc',
      main: '#addbfc',
      dark: '#9dc9e8',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    peach: {
      light: '#fcd6bd',
      main: '#ffcfad',
      dark: '#edc1a3',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    cta: {
      light: '#fcd6bd',
      main: '#ffcfad',
      dark: '#edc1a3',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '0.85em',
          fontFamily: 'GothamRoundedMedium',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          wordWrap: 'break-word',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          lineHeight: 1,
        },
        // containedPeach: {
        //   backgroundColor: '#ffcfad',
        //   color: '#0a3370',
        //   '&:hover': {
        //     backgroundColor: '#b29079',
        //   },
        // },
        // outlinedPeach: {
        //   borderColor: '#ffcfad',
        //   color: '#ffcfad',
        //   '&:hover': {
        //     borderColor: '#b29079',
        //   },
        // },
      },
      variants: [
        // {
        //   props: { variant: 'contained-peach' },
        //   style: {
        //     color: '#0a3370',
        //     backgroundColor: '#ffcfad',
        //     boxShadow:
        //       '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
        //     '&:hover': {
        //       backgroundColor: '#b29079',
        //     },
        //   },
        // },
      ],
    },
    MuiTab: {
      styleOverrides: {
        textColorPrimary: {
          color: '#0a3370',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        standardSuccess: {
          backgroundColor: '#addbfc',
          color: '#0a3370',
          '& .MuiAlert-icon': {
            color: '#4794fc',
          },
        },
      },
    },
  },
})

theme = responsiveFontSizes(theme)

export default theme
