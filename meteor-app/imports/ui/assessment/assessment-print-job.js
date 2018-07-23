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
    urgent
  } = assessment;

  const serviceItemNames = services.serviceItem.map(item => item.name);
  const servicePartNames = parts.partsItem.map(item => {
    if (!item.name) {
      return "There are no parts for this service";
    } else {
      return item.name;
    }
  });

  const bikeModel = bikeDetails.model ? ` - ${bikeDetails.model}` : "";

  var docDefinition = {
    content: [
      {
        text: `Bike: ${bikeDetails.make} ${bikeModel} - ${
          bikeDetails.color
        } - Aprox Value $${bikeDetails.bikeValue / 100}`,
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
          { text: "Comments will go here!" },
          { text: `Replacement bike required? - ${temporaryBike}` },
          {
            text: `Does the bike have sentimental value? - ${
              bikeDetails.sentimentValue
            }`,
            style: "text"
          },
          { text: `Is this request urgent? - ${urgent} ` }
        ]
      },
      { text: "Owner", style: "subheader" },
      {
        ul: [
          { text: customerDetails.name, bold: true },
          { text: customerDetails.email, bold: true },
          { text: customerDetails.phone, bold: true }
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
  pdfMake.createPdf(docDefinition).download();
};
