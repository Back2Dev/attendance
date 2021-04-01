import React from 'react'
import { connectField } from 'uniforms'
import MomentUtils from '@date-io/moment'
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers'

/*
 * * * * * * * * * * * * * PROBLEM * * * * * * * * * * * * * *
 * 1) The DatePicker is cool looking
 * 2) It has been deprecated in favour of labs/DatePicker
 * 3) The new one looks boring like the old one (because it's native)
 * 4) The component doesn't support the name property, which is a show-stopper
 *    for Uniforms
 * CONCLUSION: Don't use it, but leave the code here for a possible future
 */
const Picker = ({ ...props }) => {
  const dateParse = (timestamp, onChange) => {
    console.log({ timestamp })
    const date = new DateConstructor(timestamp)
    if (date.getFullYear() < 10000) {
      onChange(date)
    } else if (isNaN(timestamp)) {
      onChange(undefined)
    }
  }

  const onChange = (newValue) => {
    props.onChange()
  }
  return (
    <MuiPickersUtilsProvider utils={MomentUtils} name={props.id}>
      <DatePicker
        margin="normal"
        format="DD/MM/yyyy"
        views={['year', 'month', 'date']}
        name="bills-water"
        id={props.id}
        labelProps={{ shrink: true, disableAnimation: true }}
        KeyboardButtonProps={{
          'aria-label': 'change  date',
        }}
        {...props}
        value={new Date().toISOString()}
        onChange={(value) => dateParse(value, props.onChange)}
      />
    </MuiPickersUtilsProvider>
  )
}

export default connectField(Picker, { kind: 'leaf', absoluteName: 'bills-water' })
// export default DatePicker
