import React from 'react'
import { EditorContext } from './framework'
import WebformRun from '/imports/ui/pages/webform/webform-run'
import WebformContext from '/imports/ui/pages/webform/context'

export const PreviewPanel = () => {
  const formContext = React.useContext(EditorContext)
  const surveyText = formContext.editors[1].editorValue
  const formData = {}
  const methods = { update: () => {} }
  const task = {}
  const goForwardStage = () => {}
  let survey

  try {
    survey = JSON.parse(surveyText)
  } catch (e) {
    survey = null
  }
  if (!survey) return <div>No survey yet</div>

  return (
    <WebformContext.Provider value={{ formData, currentRole: 'MEM' }}>
      <WebformRun
        currentRole="MEM"
        formData={formData}
        methods={methods}
        survey={survey}
        task={task}
        goForwardStage={goForwardStage}
      ></WebformRun>
    </WebformContext.Provider>
  )
}
