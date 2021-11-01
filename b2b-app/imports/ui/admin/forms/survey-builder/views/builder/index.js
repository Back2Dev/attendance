import React from 'react'
import PropTypes from 'prop-types'
import NavigationController from 'react-navigation-controller'
import styled from 'styled-components'
import { useSetRecoilState } from 'recoil'

import { useBuilder } from '$sb/context'
import { dataCache } from '$sb/data-cache'
import { BuilderViewMobile } from './mobile'
import { statusState } from '$sb/components/panels/toolbar'
import { BuilderViewDesktop } from './desktop'

const NavController = styled(NavigationController)({
  position: 'relative',
  minHeight: '100vh',
  overflow: 'hidden',
  '.ReactNavigationControllerView': {
    position: 'absolute',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
  },
})

const BuilderView = ({ json }) => {
  const { isMobile } = useBuilder()
  const setStatus = useSetRecoilState(statusState)
  try {
    dataCache.set(json)
  } catch (e) {
    setStatus(`Unable to load data: ${e.message}`)
    dataCache.set(null)
  }

  if (isMobile) {
    return <NavController views={[<BuilderViewMobile key="builder-view-mobile" />]} />
  }

  return <BuilderViewDesktop />
}

BuilderView.propTypes = {
  json: PropTypes.object,
}

export { BuilderView }
