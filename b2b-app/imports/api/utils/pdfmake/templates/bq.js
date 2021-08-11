import moment from 'moment'
import { Meteor } from 'meteor/meteor'
import { sentenceCase } from 'change-case'
import CONSTANTS from '/imports/api/constants'

/* eslint-disable quotes */
const format = (data) => {
  if (!data) {
    return { width: 'auto', text: 'Section not completed', margin: [0, 5] }
  }

  const formatted = Object.keys(data).map((_data) => {
    return {
      columns: [
        {
          width: 'auto',
          text: `${sentenceCase(_data)}:`,
        },
        {
          width: 'auto',
          text: ['0', '1'].includes(data[_data])
            ? data[_data] === '1'
              ? 'Yes'
              : 'No '
            : data[_data],
        },
      ],
      margin: [0, 5],
    }
  })
  return formatted
}

const AddSignatures = (signatures) => {
  return signatures.map((signer) => {
    return [
      {
        image: signer.userId,
        margin: [0, 5],
        width: 100,
      },
      {
        text: `Customer name: ${signer.name} `,
        margin: [0, 5],
      },
      {
        text: `Date signed: ${moment().format('DD/MM/YYYY')} `,
        margin: [0, 5],
      },
      {},
    ]
  })
}

const bq = ({ data, signatures }) => {
  const { buyer, grants, property, title, trust, finance } = data
  let images = {}

  signatures.forEach((sig) => {
    images[sig.userId] = `${Meteor.settings.public.S3_PUBLIC_URL}${sig.url}`
  })

  return {
    pageSize: 'A4',
    content: [
      {
        columns: [
          { width: 5, stack: [{ svg: CONSTANTS.SE_LOGO_SVG }] },
          { text: "Back2bikes Buyer's Questionnaire", style: 'header', margin: [0, 20] },
        ],
      },

      {
        text:
          'At this stage of your purchase, it’s very important that you provide us with as much information as possible. This data will help us prepare the documents you need for settlement. If any of these details are incomplete, incorrect, or out of date, this could delay your settlement and end up costing you time and money.',
        margin: [0, 10],
      },
      { text: "1. Buyer's details", style: 'subheader' },
      format(buyer),
      { text: '2. Key information on the property you are buying', style: 'subheader' },
      format(property),
      format(grants),
      { text: '3. Title/transfer', style: 'subheader' },
      format(title),
      { text: '4. Trust', style: 'subheader' },
      format(trust),
      { text: '5. Finance', style: 'subheader' },
      format(finance),
      { text: '6. Customer signatures', style: 'subheader' },
      AddSignatures(signatures),
    ],
    images: images,
    styles: {
      header: {
        fontSize: 22,
        bold: true,
        alignment: 'center',
      },
      subheader: {
        bold: true,
        margin: [0, 5],
      },
    },
    defaultStyle: {
      columnGap: 5,
    },
  }
}

export default bq
