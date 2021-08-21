import React from 'react'

import getSchemas, { evaluate } from '/imports/api/surveys/survey-schema-ui-schema'

const debug = require('debug')('app:webforms-progress')

const Progress = ({ schema }) => {
  return (
    <div>
      <h1>ui-schema</h1>
      <pre>{JSON.stringify(schema, null, 2)}</pre>
    </div>
  )
}

const WebformPage = ({
  formData,
  id,
  listing,
  methods,
  profile,
  survey,
  notes,
  task,
  currentRole,
  reject,
  setDocumentList,
  documentList,
  goForwardStage,
}) => {
  const save = (models) => {
    Object.keys(models).forEach((stepid, ix) => {
      const model = models[stepid]
      // })
      // models.forEach((model, ix) => {
      // const stepid = key
      if (!formData[stepid]) formData[stepid] = {}
      Object.keys(model).forEach((key) => (formData[stepid][key] = model[key]))
    })
    methods.update(formData)
  }

  // Build the schema
  const schema = getSchemas(survey, formData)
  return <Progress schema={schema} save={save} />
}

export default WebformPage
