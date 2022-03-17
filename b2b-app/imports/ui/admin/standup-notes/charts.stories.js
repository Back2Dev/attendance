import React from 'react'
import bb from 'billboard.js'

export default {
  title: 'Data Charts',
  component: Charts,
  parameters: {
    viewport: {
      // defaultViewport: 'iphone6',
    },
    layout: 'fullscreen',
  },
  decorators: [(Story) => <Story />],
}
export const Charts // <Meeting people={people} teamName="The dream team"></Meeting>

bb.generate({
  bindto: '#chart',
  data: {
    columns: [
      ['data1', 30, 200, 100, 170, 150, 250],
      ['data2', 130, 100, 140, 35, 110, 50],
    ],
    types: {
      data1: 'line',
      data2: 'area-spline',
    },
    colors: {
      data1: 'red',
      data2: 'green',
    },
  },
})
;<div>
  <script src="$pato/attendance/b2b-app/billboard.js"></script>

  <link rel="main.css" href="$π/billboard.css"></link>

  <link rel="main.css" href="$pato/attendance/b2b-app/billboard/theme/insight.css"></link>
  <script src="https://d3js.org/d3.v6.min.js"></script>
  <paper></paper>
</div>
