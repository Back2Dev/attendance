import PdfMaker from '/imports/ui/utils/pdf-maker.js'
import moment from 'moment'
import numeral from 'numeral'
import CONSTANTS from '/imports/api/constants'

const capitalize = function (str) {
  if (!str) return
  return str
    .toLowerCase()
    .split(' ')
    .map((x) => x[0].toUpperCase() + x.slice(1))
    .join(' ')
}

/**
 *
 * @param {Object} param0
 * @param {Object[]} param0.serviceItems
 */
const createJobCard = ({
  serviceType,
  serviceItems,
  bikeDetails,
  contactData,
  assessor,
  jobNo,
}) => {
  const totalCost = serviceItems.reduce((a, b) => {
    return a + b.price
  }, 0)

  const serviceItemNames = serviceItems.map((item) => {
    const itemPrice = item.price / 100 // price in dolar 
    return [
      {
        text: item.name,
        alignment: 'left',
        colSpan: 2,
      },
      {},
      {
        text: `$${numeral(itemPrice).format('0.00')}`,
        alignment: 'right',
      },
      {
        image: item.code ? item.code : 'O',
        width: 60,
        height: 21,
        alignment: 'center',
      },
    ]
  })

  const pickupDate = moment(bikeDetails.pickupDate).format('DD MMM YYYY')
  const dropoffDate = moment(bikeDetails.dropoffDate).format('DD MMM YYYY')

  console.log({ bikeDetails })

  PdfMaker({
    contents: [
      {
        text: `${capitalize(bikeDetails.bikeName)} - Total Price $${totalCost / 100}`,
        style: 'subheader',
        fontSize: 20,
      },
      {
        text: `Owner: ${capitalize(
          contactData.memberData?.name || 'Refurbish'
        )}     email: ${contactData.memberData?.email || 'N/A'}     Ph: ${
          contactData.memberData?.mobile || 'N/A'
        }${bikeDetails.budget ? `     Budget: $${bikeDetails.budget}` : ''}`,
        style: 'text',
      },
      bikeDetails.replacementBike
        ? {
            text: `Replacement bike: ${bikeDetails.replacementBike} `,
            style: 'text',
            bold: true,
          }
        : {},
      {
        text: `Service type: ${CONSTANTS.SERVICE_TYPES[serviceType] || 'N/A'}`,
        style: 'text',
        bold: false,
      },
      { text: `Drop off date: ${dropoffDate} `, style: 'text', bold: true },
      { text: `Pick up date: ${pickupDate} `, style: 'text', bold: true },
      { text: `Job ID: ${jobNo}, Assessor: ${assessor} `, style: 'text', bold: false },
      { text: '', style: 'text' },

      {
        table: {
          widths: [240, 80, 80, 80],
          heights: 18,
          headerRows: 2,
          // keepWithHeaderRows: 1,
          body: [
            [
              {
                text: 'Service',
                style: 'tableHeader',
                colSpan: 3,
                alignment: 'center',
              },
              {},
              {},
              {
                text: 'Done?',
                alignment: 'center',
              },
            ],
            ...serviceItemNames,
            [
              { text: '', style: 'tableHeader', colSpan: 4, alignment: 'center' },
              {},
              {},
              {},
            ],
            [
              { text: '', style: 'tableHeader', colSpan: 3, alignment: 'center' },
              {},
              {},
              {},
            ],
            // ...servicePartNames,
            [
              { text: '', style: 'tableHeader', colSpan: 3, alignment: 'center' },
              {},
              {},
              {},
            ],
            [
              {
                text: 'Notes',
                style: 'tableHeader',
                colSpan: 4,
                alignment: 'center',
              },
              {},
              {},
              {},
            ],
            [{ text: bikeDetails.note || '', colSpan: 4, rowSpan: 3 }, {}, {}, {}],
            [{ text: '', colSpan: 4 }, '', '', ''],
            [{ text: '', colSpan: 4 }, '', '', ''],
          ],
        },
      },
    ],
    watermark: {
      text: capitalize(contactData.memberData?.name || 'Refurbish'),
    },
  })
}

export default createJobCard
