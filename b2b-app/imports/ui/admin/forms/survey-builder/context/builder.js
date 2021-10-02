import React, { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'

import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'

const BuilderContext = createContext()

const Provider = ({ children }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'))
  const [dndMove, setDndMove] = useState(null)

  return (
    <BuilderContext.Provider
      value={{
        isMobile,
        dndMove,
        setDndMove,
      }}
    >
      {children}
    </BuilderContext.Provider>
  )
}

Provider.propTypes = { children: PropTypes.node }

const useBuilder = () => {
  const context = useContext(BuilderContext)
  if (!context) {
    throw new Error('useBuilder not inside a Builder Provider')
  }
  return context
}
export { Provider as default, useBuilder }
