import React, { Component } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Button } from 'semantic-ui-react'

export default class PrintJobCard extends Component {

  printDocument() {
    const input = document.getElementById('toPrint');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'JPEG', 0, 0);
        // pdf.output('dataurlnewwindow');
        pdf.save("jobcard.pdf");
      })
    ;
  }

  render() {
    return (<Button onClick={this.printDocument}>Print Job</Button>);
  }
}