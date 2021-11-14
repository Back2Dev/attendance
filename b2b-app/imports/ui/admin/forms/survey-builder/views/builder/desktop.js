import React from 'react'

import { Parts } from '$sb/components/panels/parts/parts'
import { Inspector } from '$sb/components/panels/inspector'
import { Toolbar } from '$sb/components/panels/toolbar/toolbar'
import { Canvas } from '$sb/components/panels/canvas'
import { DesktopLayout } from '$sb/components/layouts/desktop/desktop'

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
