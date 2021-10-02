import React from 'react'
import PropTypes from 'prop-types'
import { Box } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import debug from 'debug'
import NavigationController from 'react-navigation-controller'
import Navbar from './navbar'

const { Transition } = NavigationController
const log = debug('builder:view')

const View = ({
  navLeft,
  navigationController,
  navMiddle,
  navRight,
  backTitle,
  children,
}) => {
  const theme = useTheme()

  let onBack = null
  if (!navLeft) {
    onBack = () => {
      navigationController.popView({ transition: Transition.type.REVEAL_RIGHT })
    }
  }

  return (
    <Box
      position="absolute"
      top={0}
      bottom={0}
      right={0}
      left={0}
      bgcolor={theme.palette.grey['100']}
    >
      <Navbar
        left={navLeft}
        onBack={onBack}
        middle={navMiddle}
        right={navRight}
        backTitle={backTitle}
      />
      <Box height="calc(100vh - 46px)" overflow="auto">
        {children}
      </Box>
    </Box>
  )
}

View.propTypes = {
  /** left element in navbar */
  navLeft: PropTypes.node,
  /** gets auto injected when rendering views in a NavigationController component */
  navigationController: PropTypes.object,
  /** middle element in navbar */
  navMiddle: PropTypes.node,
  /** right element in navbar */
  navRight: PropTypes.node,
  /** title text for back button */
  backTitle: PropTypes.string,
  children: PropTypes.node,
}

export default View
