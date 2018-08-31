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

  capitalize = function(str1){
    return str1.charAt(0).toUpperCase() + str1.slice(1);
  }
  const check = 'data:image/jpeg;base64,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'
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
        text: `${capitalize(bikeDetails.make)} ${capitalize(bikeModel)} - ${
          capitalize(bikeDetails.color)
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
          [{text: capitalize(comment), colSpan: 4 }, '', '', ''],
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
