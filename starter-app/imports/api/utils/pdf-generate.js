import { PDFDocument } from 'pdf-lib'
import { Meteor } from 'meteor/meteor'
import moment from 'moment'

const debug = require('debug')('app:generate-pdf')

export const generatePDF = async ({ data, signatures, type, template, fieldTypes }) => {
  try {
    if (!template)
      return Error(`Missing template for ${type}. Please check if it exists in s3.`)
    const pdfDoc = await PDFDocument.load(template)
    const form = pdfDoc.getForm()
    // // Uncomment to check field names
    // const fd = form.getFields()
    // fd.forEach((f) => {
    //   console.log(f)
    //   console.log(f.getName())
    // })

    if (signatures.length) {
      try {
        let pngImageBytes
        let pngImage

        for (let i = 0; i < signatures.length; i++) {
          pngImageBytes = await fetch(
            Meteor.settings.public.S3_PUBLIC_URL + signatures[i].url
          ).then((res) => {
            return res.arrayBuffer()
          })
          pngImage = await pdfDoc.embedPng(pngImageBytes)
          form.getTextField(`${signatures[i].role}`).setImage(pngImage)
          form
            .getTextField(`${signatures[i].role}-date`)
            .setText(`${moment(signatures[0].date_signed).format('DD/MM/YYYY')}`)
        }
      } catch (e) {
        console.error(e)
      }
    }

    // Edge case for authority from caf
    if (data.authority) {
      const field = data.authority
      data[field] = true
      fieldTypes[field] = 'checkbox'
    }

    Object.keys(data).map((field) => {
      if (form.getFieldMaybe(field)) {
        switch (fieldTypes[field]) {
          case 'string':
            form.getTextField(field).setText(data[field])
            break
          case 'checkbox':
            if (data[field]) {
              form.getCheckBox(field).check()
            }
            break
          default:
            return console.error('not a proper field type:', field)
        }
      } else {
        console.error(`Missing field ${field} from form`)
      }
    })

    form.flatten()
    const pdf = await pdfDoc.save()
    return pdf
  } catch (e) {
    console.error(`could not generate pdf data: ${e.message}`)
  }
}

export const signPDF = async ({ signatures, pdf }) => {
  try {
    const pdfDoc = await PDFDocument.load(pdf)
    const form = pdfDoc.getForm()
    let pngImageBytes
    let pngImage
    for (let i = 0; i < signatures.length; i++) {
      pngImageBytes = await fetch(
        Meteor.settings.public.ENV_S3_PUBLIC_URL + signatures[i].url
      ).then((res) => {
        return res.arrayBuffer()
      })
      pngImage = await pdfDoc.embedPng(pngImageBytes)
      form.getTextField(`${signatures[i].role}-sign-${i + 1}`).setImage(pngImage)
    }
    return await pdfDoc.save()
  } catch (e) {
    console.error(e)
    return e
  }
}

export default generatePDF
