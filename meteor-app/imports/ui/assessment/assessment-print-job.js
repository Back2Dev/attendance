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

  const serviceItemNames = services.serviceItem.map(item => item.name);
  const servicePartNames = parts.partsItem.map(item => {
    if(!item.name) {
      return ["There are no parts for this service"]
    } else {
      return item.name   
    } 
  });
  const tempBike = temporaryBike ? "Yes" : "No"
  const isUrgent = urgent ? "Yes" : "No"
  const hasSentimentValue = bikeDetails.sentimentValue ? "Yes" : "No"
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
        } - Approx Value $${bikeDetails.bikeValue / 100}`,
        style: "subheader",
        fontSize: 20
      },

      { text: `Assessor: ${assessor} `, style: "text" },
      { text: `Base Service: ${services.baseService}`, style: "text" },

      { text: "Service Items", style: "subheader" },
      { ul: serviceItemNames },
      { text: "Part Items", style: "subheader" },
      { ul: servicePartNames },

      { text: "Comments", style: "subheader" },

      {
        ul: [
          { text: comment },
          { text: `Replacement bike required? - ${tempBike}`},
          { text: `Does the bike have sentimental value? - ${hasSentimentValue}`},
          { text: `Is this request urgent? - ${isUrgent}`}
        ]
      },
      { text: "Owner", style: "subheader" },
      {
        ul: [
          { text: name, bold: true },
          { text: email, bold: true },
          { text: phone, bold: true }
        ]
      },

      {
        text: `Pick Up Date: ${pickupDate.toDateString()}`,
        style: "subheader",
        bold: true
      },
      {
        text: `Total Price $${totalCost / 100}`,
        style: "subheader",
        bold: true
      }
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
  };
  pdfMake.createPdf(docDefinition).download(`${name}-${bikeDetails.make}-${bikeDetails.color}`);
};
