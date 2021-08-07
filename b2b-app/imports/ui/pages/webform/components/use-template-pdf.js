import generatePDF from '/imports/api/utils/pdf-generate.js'

const usePDFTemplate = async (
  surveyData,
  survey,
  fieldTypes,
  signatures,
  template,
  setDocument
) => {
  let fill = Object.keys(surveyData)
    .map((data) => {
      if (data !== 'customers') {
        return surveyData[data]
      }
      return {}
    })
    .reduce((arr, val) => ({ ...arr, ...val }), {})

  let pdfBytes = await generatePDF({
    data: fill,
    type: survey.slug,
    fieldTypes: fieldTypes,
    signatures: signatures,
    template: template.data.Body,
  })
  return setDocument(pdfBytes)
}

export default usePDFTemplate
