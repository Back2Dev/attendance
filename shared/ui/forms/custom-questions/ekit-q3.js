import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { AutoField, HiddenField } from 'uniforms-mui'
import { ErrorField } from 'uniforms-mui'

import dbg from 'debug'
const debug = dbg('app:ekit-q3')

const headings = [
  {
    col: 'spent',
    width: '25%',
    align: 'center',
    heading: '% of time you are currently spending',
    label: 'Spent',
  },
  {
    col: 'activity',
    width: '50%',
    align: 'center',
    heading: 'Activity',
    label: 'Activity [n]',
  },
  {
    col: 'should',
    width: '25%',
    align: 'center',
    heading: '% of time you should be spending',
    label: 'Should',
  },
]

const getColor = (score) => {
  const n = parseInt(score)
  if (n > 0) {
    if (n < 95 || n > 105) return 'red'
  }
  return 'default'
}
/**
 *
 * Table field - will become great!
 *
 */
const Q3Question = (q, ix, model, formData) => {
  const { id, name } = q
  debug({ q, model, formData })
  if (!formData.time) formData.time = { activities: [] }
  for (let i = 0; i < 6; i++) {
    if (!formData.time.activities[i]) {
      formData.time.activities.push({
        activities__activity: '',
        activities__should: '0',
        activities__spent: '0',
      })
    }
  }

  const total = (data) => {
    debug({ data })
    if (!data?.activities) return { activity: 'TOTALS ' }
    const values = {
      spent: data?.activities?.reduce((acc, row) => {
        if (row && row.activities__spent) acc = acc + parseInt(row.activities__spent)
        return acc
      }, 0),
      should: data?.activities?.reduce((acc, row) => {
        if (row && row.activities__should) acc = acc + parseInt(row.activities__should)
        return acc
      }, 0),
      activity: 'TOTALS ',
    }
    // model.total__spent = values.spent
    // model.total__should = values.should
    return values
  }

  const [totals, setTotals] = React.useState(total(formData.time))

  React.useEffect(() => {
    setTotals(total(model))
  }, [model])

  return (
    <div>
      <TableContainer component={Paper} key="1">
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow key="hdr">
              {headings.map((hdr, iy) => (
                <TableCell as="th" align={hdr.align} width={hdr.width} key={iy}>
                  {hdr.heading}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {formData.time?.activities?.map((row, rowix) => (
              <TableRow
                key={`${row?.activities__activity}.${rowix}`}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {headings.map((hdr, iy) => {
                  // const label = hdr.label // Copy and replace the copy
                  return (
                    <TableCell scope="row" width={hdr.width} key={iy}>
                      <AutoField
                        id={`${id}.${rowix}.${id}__${hdr.col}`}
                        name={`${id}.${rowix}.${id}__${hdr.col}`}
                        defaultValue={row[`activities__${hdr.col}`]}
                        label={hdr.label.replace('[n]', rowix + 1)}
                        max={90}
                        min={5}
                      />
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
            <TableRow key="ftr">
              {headings.map((hdr, iy) => {
                const Tot = () => (
                  <h3 style={{ color: getColor(totals[hdr.col]) }}>{totals[hdr.col]}</h3>
                )
                return (
                  <TableCell width={hdr.width} sx={{ textAlign: hdr.align }} key={iy}>
                    <Tot></Tot>
                  </TableCell>
                )
              })}
            </TableRow>
            <TableRow>
              <TableCell colSpan="3" align="right">
                <ErrorField
                  name="activities"
                  style={{ textAlign: 'right', fontWeight: 'bold' }}
                ></ErrorField>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer component={Paper} key="2h">
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableBody>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell scope="row" width="30%" key="1">
                <HiddenField
                  id="total__spent"
                  name="total__spent"
                  value={totals.spent}
                  defaultValue={totals.spent}
                  label="Total Percentage spent"
                  max={90}
                  min={5}
                />
                <ErrorField
                  name="total__spent"
                  style={{ textAlign: 'right', fontWeight: 'bold' }}
                ></ErrorField>
              </TableCell>
              <TableCell
                scope="row"
                width="40%"
                key="2"
                style={{ textAlign: 'center' }}
              ></TableCell>
              <TableCell scope="row" width="30%" key="3">
                <HiddenField
                  id="total__should"
                  name="total__should"
                  value={totals.should}
                  defaultValue={totals.should}
                  readOnly
                  label="Total percentage I should be working"
                  max={90}
                  min={5}
                />
                <ErrorField
                  name="total__should"
                  style={{ textAlign: 'right', fontWeight: 'bold' }}
                ></ErrorField>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer component={Paper} key="2">
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow key="hdr">
              <TableCell as="th" width="30%" key="1" colSpan={3}>
                <h3>How many hours do I usually do per week</h3>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell scope="row" width="30%" key="1">
                <AutoField
                  id="hours__current"
                  name="hours__current"
                  defaultValue={formData.hours__current}
                  label="Current working hours"
                  max={90}
                  min={5}
                />
                <ErrorField
                  name="hours__current"
                  style={{ textAlign: 'right', fontWeight: 'bold' }}
                ></ErrorField>
              </TableCell>
              <TableCell scope="row" width="40%" key="2" style={{ textAlign: 'center' }}>
                <h3>TOTALS</h3>
              </TableCell>
              <TableCell scope="row" width="30%" key="3">
                <AutoField
                  id="hours__should"
                  name="hours__should"
                  defaultValue={formData.hours__should}
                  label="Hours I should be working"
                  max={90}
                  min={5}
                />
                <ErrorField
                  name="hours__should"
                  style={{ textAlign: 'right', fontWeight: 'bold' }}
                ></ErrorField>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Q3Question
