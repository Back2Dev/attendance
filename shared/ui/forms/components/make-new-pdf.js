import GenerateNewPDF from '/imports/api/utils/pdfmake/generate-new-pdf'

const makeNewPDF = async (
  surveyData,
  survey,
  signatures,
  setDocument,
  pdfmakeTemplate
) => {
  const data = await GenerateNewPDF({
    data: surveyData,
    type: survey.slug,
    signatures: signatures,
    survey,
    pdfmakeTemplate,
  })
  //data.getBuff doesn't support async/await
  const waitBuff = () =>
    new Promise((resolve) => {
      data.getBuffer((buffer) => {
        setDocument(buffer)
        resolve(buffer)
      })
    })
  return await waitBuff()
}

export default makeNewPDF
