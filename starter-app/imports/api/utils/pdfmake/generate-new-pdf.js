const pdfmake = require('pdfmake')
import sq from './templates/sq'
import bq from './templates/bq'

const GenerateNewPDF = async ({ data, type, signatures, signed }) => {
  pdfmake.fonts = {
    Roboto: {
      normal:
        'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
      bold:
        'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
      italics:
        'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
      bolditalics:
        'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf',
    },
  }
  let docDefinition

  if (type === 'sq') {
    docDefinition = sq({ data, signatures, signed })
  } else if (type === 'bq') {
    docDefinition = bq({ data, signatures, signed })
  }
  let pdf = pdfmake.createPdf(docDefinition)
  return pdf
}

export default GenerateNewPDF
