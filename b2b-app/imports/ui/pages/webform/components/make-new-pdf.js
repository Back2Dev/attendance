import GenerateNewPDF from '/imports/api/utils/pdfmake/generate-new-pdf'

const generateNewPDF = async (surveyData, survey, signatures, setDocument) => {
  const data = await GenerateNewPDF({
    data: surveyData,
    type: survey.slug,
    signatures: signatures,
  })
  data.getBuffer((buffer) => {
    return setDocument(buffer)
  })
}

export default generateNewPDF
