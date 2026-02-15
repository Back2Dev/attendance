import React from 'react'
// EKit
import ManagementSurveyV4 from './ekit-q1-q10-q11-v4'
import KPSmartForm from './ekit-q10a-v3'

// Wrapper component for custom forms

const TheForm = ({ form, onSubmit, ...rest }) => {
  // Fetch the form  data
  // const formData = React.useEffect(() => {}, { strength: 'I am strong' })
  switch (form) {
    // This one wasn't completed - not sure what the intention was
    case 'ekit-q1-v4':
      return <ManagementSurveyV4 onSubmit={onSubmit} surveyType="q1" {...rest} />
      break
    case 'ekit-q10-v4':
      return <ManagementSurveyV4 onSubmit={onSubmit} surveyType="q10" {...rest} />
      break
    case 'ekit-q11-v4':
      return <ManagementSurveyV4 onSubmit={onSubmit} surveyType="q11" {...rest} />
      break
    case 'ekit-q10a-v3':
      return <KPSmartForm onSubmit={onSubmit} type="KP" {...rest} />
      break
    case 'ekit-q5-v3':
      return <KPSmartForm onSubmit={onSubmit} type="KOI" {...rest} />
      break
    case 'ekit-management-survey-v4':
      return <ManagementSurveyV4 onSubmit={onSubmit} {...rest} />
      break

    default:
      return <div>Could not find custom form for [{form}]</div>
  }
}

// THIS IS NOT USED (YET) - custom questions are the go!

const CustomSurvey = ({ children, formData, form, ...rest }) => {
  return <TheForm form={form} formData={formData} {...rest}></TheForm>
}

export default CustomSurvey
