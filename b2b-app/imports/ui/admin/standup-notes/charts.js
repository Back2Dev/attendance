import React from 'react'

import BillboardChart from 'react-billboardjs'
import 'billboard.js/dist/billboard.css'
import Paper from '@material-ui/core/Paper'
import { bar, line } from 'billboard.js'

const CHART_DATA = {
  columns: [
    ['data1', 30, 20, 50, 40, 60, 50],
    ['data2', 200, 130, 90, 240, 130, 220],
    ['data3', 300, 200, 160, 400, 250, 250],
  ],
  type: bar(),
}

const CHART_DATA_LINE = {
  columns: [
    ['data1', 30, 20, 50, 40, 60, 50],
    ['data2', 200, 130, 90, 240, 130, 220],
    ['data3', 300, 200, 160, 400, 250, 250],
  ],
  type: line(),
}
const Charts = () => {
  return (
<<<<<<< HEAD
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap-reverse',
        flexGrow: '6',
        justifyContent: 'center',
        alignSelf: 'flex-end',
      }}
    >
=======
    <div style={{ flexAlign: 'right' }}>
>>>>>>> fbcc565acd520781b11ee043917d5886c37cfe88
      <Paper elevation={0} />
      <BillboardChart data={CHART_DATA} />

      <Paper />
      <Paper elevation={3}>
        <BillboardChart data={CHART_DATA_LINE} />
      </Paper>
    </div>
  )
}

export default Charts
