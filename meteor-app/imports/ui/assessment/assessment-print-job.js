import pdfMake from "pdfmake/build/pdfmake";
import vfsFonts from "pdfmake/build/vfs_fonts";
export default assessment => {
  const {
    assessor,
    bikeDetails,
    customerDetails,
    parts,
    pickupDate,
    services,
    temporaryBike,
    totalCost,
    urgent, 
    comment
  } = assessment;

  const check = 'data:image/png;base64,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'
  const serviceItemNames = services.serviceItem.map(item => [item.name, '', '', '']);
  const servicePartNames = parts.partsItem.map(item => {
    if(!item.name) {
      return ["There are no parts for this service"]
    } 
    else if(item.code === "F") {
      return [item.name, {image: check, width: 10, alignment: 'center'}, '', '']
    } 
    else if(item.code === "R") {
      return [item.name, '', {image: check, width: 10, alignment: 'center'}, '']
    }
    else {
      return [item.name, '', '', {image: check, width: 10, alignment: 'center'}]
    } 
  });
  const tempBike = temporaryBike ? "A temporary bike has been provided to this customer." : "This customer did not require a temporary bike."
  const isUrgent = urgent ? `This request is URGENT and must be completed by ${pickupDate.toDateString()}` : `Pickup Date: ${pickupDate.toDateString()}`
  const name = customerDetails.name ? customerDetails.name : "Back 2 Bikes"
  const email = customerDetails.email ? customerDetails.email : "Back 2 Bikes"
  const phone = customerDetails.phone ? customerDetails.phone : "Back 2 Bikes"
  const bikeModel = bikeDetails.model ? ` - ${bikeDetails.model}` : "";

  var docDefinition = {
    pageSize: 'A4',

    watermark: {text: 'back2bikes', color: '#8FDBB6', opacity: 0.3, bold: true, italics: false},

    content: [
      {
        text: `Bike: ${bikeDetails.make} ${bikeModel} - ${
          bikeDetails.color
        } - Total Price $${totalCost / 100}`,
        style: "subheader",
        fontSize: 20
      },

      { text: `Assessor: ${assessor} `, style: "text" },
      { text: `${isUrgent} `, style: "text", bold: true },

      // { text: `Base Service: ${services.baseService}`, style: "text" },

      // below is code to test table format
      { stack: [
      { table: {
				widths: [200, 93, 93, 93],
				headerRows: 2,
				// keepWithHeaderRows: 1,
				body: [
          [{text: services.baseService, style: 'tableHeader', colSpan: 1, alignment: 'center'}, {text: '', colSpan: 3}, {}, {}],
          ...serviceItemNames,
					[{text: 'Parts Items', style: 'tableHeader', alignment: 'center'}, {text: 'Front', style: 'tableHeader', alignment: 'center'}, {text: 'Rear', style: 'tableHeader', alignment: 'center'}, {text: 'Other', style: 'tableHeader', alignment: 'center'}],
          ...servicePartNames,
          [{text: 'Comments', style: 'tableHeader', colSpan: 4, alignment: 'center'}, {}, {}, {}],
          [{text: comment, colSpan: 4 }, '', '', ''],
          [{text: tempBike, colSpan: 4 }, '', '', ''],
				]
      },
    },
  ]
},

    // end of table code
      
      { text: "Owner", style: "subheader" },
      {
        ul: [
          { text: name, bold: true },
          { text: email, bold: true },
          { text: phone, bold: true }
        ]
      },

      // {
      //   text: `Pick Up Date: ${pickupDate.toDateString()}`,
      //   style: "subheader",
      //   bold: true
      // },

    ],
    styles: {
      header: {
        fontSize: 24,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      subheader: {
        fontSize: 18,
        bold: true,
        margin: [0, 10, 0, 5]
      },
      text: {
        fontSize: 12,
        margin: [5, 5, 5, 5]
      },
      servicesTable: {
        margin: [5, 5, 5, 15]
      },
      tableHeader: {
        bold: true,
        fontSize: 15,
        color: "black"
      }
    },
    defaultStyle: {
      // alignment: 'justify'
    }
  }
  // chrome blocks blobs being opened in new tab
  pdfMake.createPdf(docDefinition).open();
};
