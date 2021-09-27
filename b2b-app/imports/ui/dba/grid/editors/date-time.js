import React from 'react'
import styled from 'styled-components'
import { TextField } from '@material-ui/core'
import moment from 'moment'
import PropTypes from 'prop-types'

const StyledDateTimeField = styled(TextField)`
  display: flex;
  width: 100%;
  height: 100%;
  > div {
    flex: 1;
    font-size: 14px;
    input {
      font-size: 14px;
    }
  }
`

function DateTimeField(props) {
  // console.log('DateTimeField', props)
  const { row, column, onRowChange } = props
  const value = row[column.key]
  const formated = moment(value).format('YYYY-MM-DDTHH:mm')
  // console.log('value', value, formated)
  return (
    <StyledDateTimeField
      type="datetime-local"
      defaultValue={formated}
      InputLabelProps={{
        shrink: true,
      }}
      onChange={(event) => {
        console.log(event.target.value)
        onRowChange({ ...row, [column.key]: event.target.value })
      }}
    />
  )
}

DateTimeField.propTypes = {
  column: PropTypes.object,
  onClose: PropTypes.func,
  onRowChange: PropTypes.func,
  row: PropTypes.object,
  rowIdx: PropTypes.number,
}

export default DateTimeField
