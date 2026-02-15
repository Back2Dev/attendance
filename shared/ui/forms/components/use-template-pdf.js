import generatePDF from '/imports/api/utils/pdf-generate.js'
import { flatten, mapFields } from '/imports/api/util'

const debug = require('debug')('app:pdf')

const usePDFTemplate = async (
  surveyData,
  survey,
  fieldTypes = {},
  signatures,
  template,
  setDocument
) => {
  const { pdfFields, slug } = survey
  const fill = pdfFields ? mapFields(flatten(surveyData), pdfFields) : flatten(surveyData)
  if (fill['auth-authority']) {
    const field = fill['auth-authority']
    fill[field] = true
    fieldTypes[field] = 'checkbox'
    delete fill['auth-authority']
  } else {
    if (slug === 'caf') {
      fill.specific = true
      fieldTypes.specific = 'checkbox'
    }
  }
  debug({ fill })
  Object.keys(fill).forEach((key) => {
    if (!fieldTypes[key]) {
      fieldTypes[key] = 'string'
    }
  })
  if (template) {
    let { status, pdf } = await generatePDF({
      data: fill,
      type: survey.slug,
      fieldTypes: fieldTypes,
      signatures: signatures,
      template: template?.data.Body,
    })
    if (status === 'success') {
      setDocument(pdf)
      return pdf
    }
  }
}

export default usePDFTemplate
