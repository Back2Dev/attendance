import PdfMaker from '/imports/ui/utils/pdf-maker.js'
import moment from 'moment'

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
const createJobCard = ({ serviceItems, bikeDetails, contactData, pickup }) => {
  const totalCost = serviceItems.reduce((a, b) => {
    return a + b.price
  }, 0)

  const serviceItemNames = serviceItems.map((item) => {
    return [
      {
        text: item.name,
        align: 'right',
        colSpan: 3,
      },
      {},
      {},
      {
        image: item.code ? item.code : 'O',
        width: 60,
        height: 21,
        alignment: 'center',
      },
    ]
  })

  const tempBike = pickup.replacementBike
    ? `A temporary bike has been provided to this customer. Replacement bike: ${pickup.replacementBike}`
    : ''

  const pickupDate = moment(pickup.pickupDate).format('DD MMM YYYY')

  const isUrgent = pickup.urgent
    ? `URGENT: This request must be completed by ${pickupDate}`
    : `Pickup Date: ${pickupDate}`

  PdfMaker({
    contents: [
      {
        text: `${capitalize(bikeDetails.make)} ${bikeDetails.model} - ${capitalize(
          bikeDetails.color
        )} - Total Price $${totalCost / 100}`,
        style: 'subheader',
        fontSize: 20,
      },
      {
        text: `Owner:   ${capitalize(
          contactData.memberData?.name || 'Refurbish'
        )}     email: ${contactData.memberData?.email || 'N/A'}     Ph: ${
          contactData.memberData?.mobile || 'N/A'
        }`,
      },

      // { text: `Assessor: ${assessor} `, style: 'text' },
      { text: `${isUrgent} `, style: 'text', bold: true },
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
              {
                text: 'Other Items',
                style: 'tableHeader',
                alignment: 'center',
                colSpan: 3,
              },
              {},
              {},
              { text: 'Done?', alignment: 'center' },
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
                rowSpan: 4,
                alignment: 'center',
              },
              {},
              {},
              {},
            ],
            [{ text: '', colSpan: 4 }, '', '', ''],
            [{ text: '', colSpan: 4 }, '', '', ''],
            [{ text: '', colSpan: 4 }, '', '', ''],
          ],
        },
      },
      {
        text: tempBike,
      },
    ],
    watermark: {
      text: capitalize(contactData.memberData?.name || 'Refurbish'),
    },
  })
}

export default createJobCard
