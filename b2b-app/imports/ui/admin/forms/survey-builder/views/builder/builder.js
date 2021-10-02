import React from 'react'
import PropTypes from 'prop-types'
import NavigationController from 'react-navigation-controller'
import debug from 'debug'

import Parts from '../../parts'
import Canvas from '../../canvas'
import Inspector from '../../inspector'
import EditView from '../edit'
import { Navbar, View } from '../../view'

const log = debug('builder:builder-view')
const { Transition } = NavigationController

const BuilderView = ({ navigationController }) => {
  const onEdit = () => {
    navigationController.pushView(<EditView />, {
      transition: Transition.type.COVER_LEFT,
    })
  }

  return (
    <View
      navLeft={<div />}
      navRight={
        <Navbar.Button onClick={onEdit} align="right">
          edit
        </Navbar.Button>
      }
      navigationController={navigationController}
    >
      <Parts />
      <Canvas />
      <Inspector />
    </View>
  )
}

BuilderView.propTypes = {
  navigationController: PropTypes.object,
}

export default BuilderView
