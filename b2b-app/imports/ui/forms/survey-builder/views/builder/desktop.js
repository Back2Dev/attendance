import React, { useContext } from 'react'
import { Parts } from '/imports/ui/forms/survey-builder/components/panels/parts/parts'
import { Inspector } from '/imports/ui/forms/survey-builder/components/panels/inspector'
import { Toolbar } from '/imports/ui/forms/survey-builder/components/panels/toolbar/toolbar'
import { Canvas } from '/imports/ui/forms/survey-builder/components/panels/canvas'
import { DesktopLayout } from '/imports/ui/forms/survey-builder/components/layouts/desktop/desktop'
import { PreviewPanel } from '/imports/ui/forms/framework/preview-panel'
import { EditorContext } from '/imports/ui/forms/framework/framework'

const BuilderViewDesktop = () => {
  const formContext = useContext(EditorContext)

  return (
    <DesktopLayout
      toolbar={<Toolbar />}
      left={<Parts />}
      center={formContext.checked ? <PreviewPanel /> : <Canvas />}
      right={<Inspector />}
    />
  )
}

export { BuilderViewDesktop }
