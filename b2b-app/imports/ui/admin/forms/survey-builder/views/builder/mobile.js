import React from 'react'
import PropTypes from 'prop-types'
import NavigationController from 'react-navigation-controller'
import debug from 'debug'

import { Parts } from '../../components/panels/parts'
import { Canvas } from '../../components/panels/canvas'
import { Inspector } from '../../components/panels/inspector'
import { EditView } from '../edit'
import { Navbar, MobileLayout, Drawer } from '../../components/layouts/mobile'
import { useDrawer, useSelectedPartValue } from '$sb/recoil/hooks'

const log = debug('builder:builder-view')
const { Transition } = NavigationController

const BuilderViewMobile = ({ navigationController }) => {
  const selectedPart = useSelectedPartValue()
  const drawer = useDrawer()

  const onEdit = () => {
    navigationController.pushView(<EditView />, {
      transition: Transition.type.COVER_LEFT,
    })
  }

  return (
    <MobileLayout
      navLeft={<div />}
      navRight={
        <Navbar.Button onClick={onEdit} align="right">
          edit
        </Navbar.Button>
      }
      navigationController={navigationController}
    >
      <Drawer open={drawer === 'parts'}>
        <Parts />
      </Drawer>
      <Canvas />
      <Drawer open={selectedPart !== null && drawer === 'inspector'}>
        <Inspector />
      </Drawer>
    </MobileLayout>
  )
}

BuilderViewMobile.propTypes = {
  navigationController: PropTypes.object,
}

export { BuilderViewMobile }
