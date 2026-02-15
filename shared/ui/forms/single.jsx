import React from 'react'
import { Meteor } from 'meteor/meteor'
import WebformContext from './form-context'
import WebForm from './core'
import forms from './forms'
import './index.css'
import dbg from 'debug'
const debug = dbg('app:form-single')

const formProps = {
  task: { doctype: 'custom' },
  job: {
    docs: [{ type: 'custom', formData: {} }],
  },
  notes: [],
  signatures: [],
  reject: (args) => console.log('reject', args),
  update: (args) => console.log('update', args),
  goBack: (args) => console.log('goBack', args),
}

const FormPage = (props) => {
  const formId = props.match.params.token
  const slug = formId
  const [message, setMessage] = React.useState('')
  const [survey, setSurvey] = React.useState(null)
  const [pdfmakeTemplate, setPdfmakeTemplate] = React.useState('')
  debug({ formId, survey })

  React.useEffect(() => {
    if (forms[slug]) setSurvey(forms[slug])
    else {
      Meteor.callAsync('fetch.survey', slug)
        .then((response) => {
          debug({ response })
          if (response.status !== 'success') setMessage(response.message)
          setSurvey(response.survey)
          setPdfmakeTemplate(response.pdfmakeTemplate)
        })
        .catch((err) => {
          console.error('Error fetching survey', err)
        })
    }
  }, [slug])
  if (message) return <div>{message}</div>
  if (!survey) return <div>Loading</div>

  return (
    <WebformContext.Provider value={{ ...props, survey }}>
      <WebForm
        survey={survey}
        data={survey}
        pdfmakeTemplate={pdfmakeTemplate}
        {...formProps}
      ></WebForm>
    </WebformContext.Provider>
  )
}

export default FormPage
