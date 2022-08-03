import React from 'react'
import PropTypes from 'prop-types'
import NavigationController from 'react-navigation-controller'
import styled from 'styled-components'
import { useSetRecoilState } from 'recoil'

import { useBuilder } from '/imports/ui/forms/survey-builder/context'
import { dataCache } from '/imports/ui/forms/survey-builder/data-cache'
import { BuilderViewMobile } from './mobile'
import { statusState } from '/imports/ui/forms/survey-builder/components/panels/toolbar'
import { BuilderViewDesktop } from './desktop'
/* placeholder gets imported without being used because when the module gets evaluated, it will
register itself to the TypeRegistry. This needs to be done before it is used by the data-cache so
that is why it's imported here. Do NOT import this from within data-cache otherwise you get cyclic
imports which will result in Placeholder rendering errors because some of its imports will be undefined */
import '/imports/ui/forms/survey-builder/components/old/types/placeholder'

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
