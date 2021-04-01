import React from 'react'
import PropTypes from 'prop-types'
import { connectField } from 'uniforms'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'
import moment from 'moment'

function DateOnlyField({ onChange, value }) {
  const [newValue, setNewValue] = React.useState(value || null)

  const handleChange = (_value) => {
    setNewValue(_value._d)
    onChange(_value._d)
  }

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <KeyboardDatePicker
        style={{ width: '100%' }}
        margin="normal"
        id="settlement-date-picker"
        label="Settlement Date"
        value={newValue}
        minDate={moment()}
        format="DD/MM/yyyy"
        views={['year', 'month', 'date']}
        onChange={handleChange}
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
      />
    </MuiPickersUtilsProvider>
  )
}

DateOnlyField.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.object,
}

export default connectField(DateOnlyField)
