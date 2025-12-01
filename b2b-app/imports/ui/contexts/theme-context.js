import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import StylesProvider from '@mui/styles/StylesProvider';
import { ThemeProvider as StylesThemeProvider } from '@mui/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components'

import DefaultTheme from '/imports/ui/themes/default.js'
import DarkTheme from '/imports/ui/themes/dark.js'

export const MyThemeContext = React.createContext('theme')

export const MyThemeProvider = (props) => {
  const { children } = props

  const [theme, setTheme] = useState('default')

  let theTheme
  switch (theme) {
    case 'dark':
      theTheme = DarkTheme
      break

    default:
      theTheme = DefaultTheme
      break
  }

  return (
    <StylesProvider injectFirst>
      <StylesThemeProvider theme={theTheme}>
        <MyThemeContext.Provider value={{ theme, setTheme }}>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theTheme}>
              <StyledThemeProvider theme={theTheme}>{children}</StyledThemeProvider>
            </ThemeProvider>
          </StyledEngineProvider>
        </MyThemeContext.Provider>
      </StylesThemeProvider>
    </StylesProvider>
  );
}

MyThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const ThemeConsumer = MyThemeContext.Consumer
