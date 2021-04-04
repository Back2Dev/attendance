import moment from 'moment'
import { Meteor } from 'meteor/meteor'
import { sentenceCase } from 'change-case'
import CONSTANTS from '/imports/api/constants'

const format = (data) => {
  if (!data) return ''
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
        width: 200,
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

const sq = ({ data, signatures }) => {
  const {
    seller,
    title,
    mortgage,
    deposit,
    property,
    tax,
    leases,
    water,
    improvements,
    planning,
    outgoings,
    services,
    notices,
    chattelfitting,
  } = data

  let images = {}

  signatures.forEach((sig) => {
    images[sig.userId] = `${Meteor.settings.public.S3_PUBLIC_URL}${sig.url}`
  })

  return {
    pageSize: 'A4',
    content: [
      // eslint-disable-next-line quotes
      {
        columns: [
          { width: 5, stack: [{ svg: CONSTANTS.SE_LOGO_SVG }] },
          {
            text: "Back2bikes Seller's Questionnaire",
            style: 'header',
            margin: [0, 20],
          },
        ],
      },

      {
        text:
          'At this stage of your purchase, it’s very important that you provide us with as much information as possible. This data will help us prepare the documents you need for settlement. If any of these details are incomplete, incorrect, or out of date, this could delay your settlement and end up costing you time and money.',
        margin: [0, 10],
      },
      // eslint-disable-next-line quotes
      { text: "1. Seller's details", style: 'subheader' },
      format(seller),
      { text: '2. Property', style: 'subheader' },
      { text: '3. Certificate of title', style: 'subheader' },
      format(title),
      { text: '4. Mortgages', style: 'subheader' },
      format(mortgage),
      { text: '5. Deposit release', style: 'subheader' },
      format(deposit),
      { text: '6. Property information', style: 'subheader' },
      format(property),
      { text: '7. Tax', style: 'subheader' },
      format(tax),
      { text: '8. Leases', style: 'subheader' },
      format(leases),
      { text: '9. Sewerage and water', style: 'subheader' },
      format(water),
      { text: '10. Improvements and buildings', style: 'subheader' },
      format(improvements),
      { text: '11. Planning', style: 'subheader' },
      format(planning),
      { text: '12. Outgoings', style: 'subheader' },
      format(outgoings),
      { text: '13. Services', style: 'subheader' },
      format(services),
      { text: '14. Notices and orders', style: 'subheader' },
      format(notices),
      { text: '15. Chattels, fittings and fixtures', style: 'subheader' },
      format(chattelfitting),
      { text: '16. Customer signature', style: 'subheader' },
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

export default sq
