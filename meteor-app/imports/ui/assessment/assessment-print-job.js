import pdfMake from "pdfmake/build/pdfmake"
import vfsFonts from "pdfmake/build/vfs_fonts"
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
  } = assessment

  capitalize = function(str){
    if (!str) return
    return str.toLowerCase().split(' ').map(x => x[0].toUpperCase()+x.slice(1)).join(' ')
  }

  const serviceItemNames = services.serviceItem.map(item => {
    return [{
      text: item.name,
      align: 'right',
      colSpan: 3},
      {},
      {},
      {
        image: (item.code) ? item.code : "O",
        width: 60,
        height: 21,
        alignment: 'center'
      },
    ]
  })
  
  const mergedParts = parts.partsItem.reduce((acc, val) => {
    const itemName = val.name.replace(/^front\s+|rear\s+/ig,"")
    if (acc[itemName]) {
      const codes = [acc[itemName].code, val.code]
      if (codes.includes("F") && codes.includes("R")) {
        acc[itemName].code = "FR"
      }
    } else {
      acc[itemName] = val
    }
    return acc
  },{})
  const servicePartNames = Object.keys(mergedParts).map(name => {
    const item = mergedParts[name]
    if (!item.name) {
      return ["There are no parts for this service",""]
    } else {
      return [
        {
          text: name,
          alignment: 'right',
          colSpan: 3,
        },
        {},
        {},
        {
          image: item.code,
          width: 60,
          height: 21,
          alignment: 'center',
        },
      ]
    }
  })
  const tempBike = temporaryBike ? "A temporary bike has been provided to this customer." : ""
  const isUrgent = urgent ? `URGENT: This request must be completed by ${pickupDate.toDateString()}` : `Pickup Date: ${pickupDate.toDateString()}`
  const name = customerDetails.name ? customerDetails.name : "Back2bikes"
  const email = customerDetails.email ? customerDetails.email : "N/A"
  const phone = customerDetails.phone ? customerDetails.phone : "N/A"
  const bikeModel = bikeDetails.model ? ` - ${bikeDetails.model}` : ""

  var docDefinition = {
    pageSize: 'A4',

    watermark: {text: 'back2bikes', color: '#8FDBB6', opacity: 0.3, bold: true },

    images: {
      R: 'data:image/png;base64,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',
      F: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAAqCAYAAAB4Ip8uAAAABGdBTUEAALGPC/xhBQAABORJREFUeAHtmudLPD0QgOfsvSuCotixg6DiJ7/6B/g/C4piAXtDxF6wd+/nE8m5d5t7b89lj9e9BI7s5lI28+xMZieJfH5+RsWm0Eogj5lFIpHQTjCbJxaNRiUnmwWQDXO3gENO2QK2gEMugZBPz2qwBRxyCYR8euozKRNzfH5+luvra3l7exPcd5LOneObypyfcTk5OZKfny9VVVVSXFzsbGqvDRIIHDDAdnZ2ZGtrSx4eHuQrsBJ7DBPM2J9JLoAN5NLSUuns7FQ/5wuQpFnWFgcOeHt7WxYXF5W21tfXKzB+gPBSPD4+ytnZWazf7u7urAWYauKBAdYg1tbWlNaOjIxIS0tLLGr2G8ha48kPDg5kYWFB1tfXpbm5WUpKSlLNNSv/9wT45uZGPj4+PAmopqZG1aP++fm53N3dKbDt7e2Sm5vrqQ8vlejv9PRU9vf31dpuAZul5gnwzMyM3N7emntwlLI2Tk9PqxLWWuCSV1ZW+oL7/v4uS0tLUlBQID09PSrnZamoqFCm//7+3vEU9tIpAU+AnQ28XmNGX15elEkGvJ+0ubkprOX0c3l5KZh74AIZU884NpklkDbguro6GRsbM/bmXFcBjOaRnOXGhv9ReHFxIRsbG6oG1uD4+FhZBgDrpMfR9zb/kUDagNGasrKynx6SXAGYb14/6fX1VVZWVoSclwTAjY2N0tDQENetV/8grlGW3PiznSmEBBA/CdOMI0XihWENHhoaUoEOP/1mU9tAAfsRJN+5mGY0lx+Ae3t7RXvpfvrOprb/S8A4TcvLy2oNd5pmIlfc2+RdAmmvwXwuzc3NuUYgNtzV1eUq/00BwQucK625hYWF1jT/RpBfbdIG/PT0JHt7e67hmpqaPAFmXQYgGwamF+Lk5ER9EgFXA+7r65Pq6mrXmLYgtQTSBoyjg7YmJoIZqRLeLqaXjQe+afGygacTO05O00x9XpyOjg5rmrWQ0szTBowmTU5OpjnMd3XMLnBxmIC3urqqrvv7+1UF7q+urmKay3YgXnNeXtqP+avnC2OjjEquvLxcecGARoOBzGYEppjAxe7urrrWpnlgYECFOcMo+EzNKaNeNBsCo6OjUltbq+ACEsisyfPz83FlmOa2tjZrmn2+CYECBmBiYq0m1EnIE7jUIdSo49aYbzbzh4eHfW1QJI6brfeBAQYcnrIpJUJ21gHw4OCgp3Cobud3M0P3E8Y8MMAISwseaInJBBmNxiw7DwYktjPdWyfMJJXvssAAo8EEKExw9eMAeXx8XG0eYKa5x6P2ejCAvvlZwFqi7tyTFz01NeVumaIE7WUtJXGGKlnCe56YmBACHMSZvexU6b50v/Y0h5aIOw9Mg9FCHCm0+OjoSB3fcQ//XQKg1tbWtD6JOA5Ev/RvNyCSSfYXocrkXcX/gwYT8eLsFLtCs7Oz6nAcWm3yruNbJ7/DJHP89vDwUOWcqMS022SWQOQrNhz1I3Bztz+lxK7ZtN//OhwHHMYCvt4r1o7YTwv3lbMufXBPP2g9n1NFRUXuRrbkW95BA0bOnMjgLBVa5+XwXio2rNsclSVgQmzcJrMElEJlAjDD8wkEaHK/ifUdsF69bb/j/dX2GQX8V4X0l58bwIF50X9ZMGF6dgs4TDQNc7GADUIJU5EFHCaahrmoUCWLsU3hlMA/4lcK9ZqqKt0AAAAASUVORK5CYII=',
      FR: 'data:image/jpeg;base64,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',
      O: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAAqCAYAAAB4Ip8uAAAABGdBTUEAALGPC/xhBQAABDFJREFUeAHtm1dP40AQgCf0Xh4AAaIIeEB0JBD8A344PFBEESB6EUiIjqhC1BzfntYXcjgisY/cTjxSZMexx+x8O7Ozs0vs/f09LpGotUABLYvFYmobmMsNi8fjkpfLBsiFtkeAlVOOAEeAlVtAefMiD1YO2GTRGtr49PQk5+fn8vj4KGSPfKwknttrfkdmFHl5eVJSUiJ1dXXm6HevC9dVAN7b25PV1VW5u7uTj3l9KHYHckVFhfT19UlnZ2coOrOhxHnAu7u7Mjs7azwWj6uqqjIemMnc3no+x9vbW7m8vPR0d3V1ZYNP4Hc6DZhwvLKyYozQ398vPT09kp+fH9goKCASrK2tGf1Eh+bmZiktLQ1F908qcTrJOj09lfv7ezNWEkrDggsAQnRvb6/RzTt4l4viNGAMTzitqakJXG4lGszPz8vx8bHHkTBfW1tr3nFzc+Ndd+nEacBkzjbrDWJ0Osni4qKsr6/L5OSkLC0tydvbm1GJfj7Pz89BXpG1Z50G/PLyEorh9vf35eDgQIqKioy3MvZeX197gDmJAIdi6vSUvL6+mgfwsEyFML+8vGzGXHSQXJFQEfatoN++y15z5ei0BxNGg8AlNC8sLJjiCHr4XlxcLMPDw6EmbNnsDE4DDmq4nZ0dOTo68mDivUy3mEtrkZwFTCGDOTTTIYRoQGh2taDh1yFzEjCeSmi2WTihmdozoTlIyPczcjavqwQMuFTz1u3tbTPftYURgA8MDEhlZWU2WfyTdztdqvzKIg8PDzI1NWVqyaOjo9Le3v7pNqY/lB4TQ3NLS4t0dHR8uk/LF1UejOcC9+rqykx3WIRgjmuFcZbQzJzWZs1lZWUqQ7NtsyrAgGNei3dagHNzc8JyIrK5uSknJyde1szYOzg4KOXl5dYe6o6qADOGjo+PG4DAs5CpMeO5GxsbHlwKF21tbX+FcG2EVQEGDlOdsbEx48WJkPFeSptAJ6miM+C92sXpJItQDMRkIWlCpqenDUyg2ozZ3js0NCSMv9rFaQ8uLCz05QNkwnVyJyA0kzHbTuCrIOEHOlFyB0n4+b8+ddqDCwp+//lfeTFWtxBnZma8xYLq6uq0QrPVzUqTi+I0YBYGAMCY6idAxvuYMnHfyMiIWVDwuz/5Ovr5RICTLfMD35neML5SV04lTU1NMjExYUClO+6im3e4ugDh9Bjc0NBgEqWzszPZ2tpKxdhsmEsXLiVN9mKx2a6+vj6l/v/1x9hH2IrTQ10Vttmw3YZkqrGxURhjObfy3bbZsZbnCOXUstmfRfWLRQh2bLomtMl5wDSCLTYUMdg4F6bgud3d3QbudztKmO8PqksFYGsE/qvh8PBQLi4u7KWMjxiGTfStra1OrzCpApwxTcUPAvjPYKW4obnctAiwcvoR4Aiwcgsob17kwcoBm1o02VYkOi3wC0QT42PWmObwAAAAAElFTkSuQmCC',
    },
  
    content: [
      {
        text: `${capitalize(bikeDetails.make)} ${bikeModel} - ${
          capitalize(bikeDetails.color)
        } - Total Price $${totalCost / 100}`,
        style: "subheader",
        fontSize: 20
      },
      { text: `Owner:   ${capitalize(name)}     email: ${email}     Ph: ${phone}` },

      { text: `Assessor: ${assessor} `, style: "text" },
      { text: `${isUrgent} `, style: "text", bold: true },
      { text: '', style: "text"},

      { table: {
        widths: [240, 80, 80, 80],
        heights: 18,
				headerRows: 2,
				// keepWithHeaderRows: 1,
				body: [
          [
            {
              text: services.baseService,
              style: 'tableHeader',
              colSpan: 3,
              alignment: 'center'
            },
            {},
            {},
            {
              text: 'Done?', alignment: 'center',
            },
          ],
          ...serviceItemNames,
          [{text: '', style: 'tableHeader', colSpan: 4, alignment: 'center'}, {}, {}, {}],
					[{text: 'Other Items', style: 'tableHeader', alignment: 'center', colSpan: 3}, {}, {}, {text: 'Done?', alignment: 'center',}],
          ...servicePartNames,
          [{text: '', style: 'tableHeader', colSpan: 3, alignment: 'center'}, {}, {}, {}],
          [{text: 'Notes', style: 'tableHeader', colSpan: 4, alignment: 'center'}, {}, {}, {},],
          [{text: comment, colSpan: 4 }, '', '', ''],
				]
      },
    },
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
  if (tempBike) {
    docDefinition.content.push({text: tempBike})
  }
  if (!customerDetails.refurbishment) {
    docDefinition.watermark.text = customerDetails.name
    docDefinition.watermark.color = "cyan"
  }
  try {
    pdfMake.createPdf(docDefinition).open()
  } catch (error) {
    alert("There was a problem creating the printable job card: "+error.message)
  }
}
