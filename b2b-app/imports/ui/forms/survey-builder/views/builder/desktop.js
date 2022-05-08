import React from 'react'

import { Parts } from '/imports/ui/forms/survey-builder/components/panels/parts/parts'
import { Inspector } from '/imports/ui/forms/survey-builder/components/panels/inspector'
import { Toolbar } from '/imports/ui/forms/survey-builder/components/panels/toolbar/toolbar'
import { Canvas } from '/imports/ui/forms/survey-builder/components/panels/canvas'
import { DesktopLayout } from '/imports/ui/forms/survey-builder/components/layouts/desktop/desktop'

const BuilderViewDesktop = () => {
  return (
    <DesktopLayout
      toolbar={<Toolbar />}
      left={<Parts />}
      center={<Canvas />}
      right={<Inspector />}
    />
  )
}

export { BuilderViewDesktop }
