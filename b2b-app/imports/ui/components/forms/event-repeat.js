import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { connectField, useForm } from 'uniforms'
import { Switch, FormControlLabel, Select, Input, MenuItem } from '@material-ui/core'
import styled from 'styled-components'
import moment from 'moment'

const StyledEventRepeat = styled.div`
  margin: 10px 0;
  .input-every {
    width: 50px;
    input {
      text-align: center;
    }
  }
  .MuiSelect-selectMenu {
    min-height: 1em;
  }
  .repeat-option {
    margin: 10px 0;
  }
`

const EventRepeat = ({ className, disabled, onChange, value = {}, label }) => {
  const formContext = useForm()
  console.log('selected date', formContext.model.when)

  console.log('value', JSON.stringify(value, null, 2))
  const [factor, setFactor] = useState(value?.factor ? value.factor : 'week')
  const [every, setEvery] = useState(value?.every || 1)
  const [dow, setDow] = useState(value?.dow || null)
  const [dom, setDom] = useState(value?.dom || null)
  const [util, setUtil] = useState(value?.util || null)

  const [enabled, setEnabled] = useState(!!value?.factor)

  const renderSwitch = () => {
    return (
      <FormControlLabel
        control={
          <Switch
            checked={enabled}
            onChange={() => {
              setEnabled(!enabled)
            }}
            color="primary"
          />
        }
        label="Repeat"
      />
    )
  }

  const renderWeeklyOption = () => {
    if (factor !== 'week') {
      return null
    }
    return <div>weekly option</div>
  }

  const renderMonthlyOption = () => {
    if (factor !== 'month') {
      return null
    }
    return <div>monthly option</div>
  }

  const renderRecurrenceForm = () => {
    if (!enabled) {
      return null
    }
    return (
      <div>
        <div>
          Repeat every{' '}
          <Input
            className="input-every"
            type="number"
            value={every}
            onChange={(event) => setEvery(event.target.value)}
          />{' '}
          <Select
            className="input-factor"
            value={factor}
            onChange={(event) => setFactor(event.target.value)}
            margin="dense"
          >
            <MenuItem value="day">Day</MenuItem>
            <MenuItem value="week">Week</MenuItem>
            <MenuItem value="month">Month</MenuItem>
            <MenuItem value="year">Year</MenuItem>
          </Select>
        </div>
        <div className="repeat-option">
          {renderWeeklyOption()}
          {renderMonthlyOption()}
        </div>
      </div>
    )
  }

  return (
    <StyledEventRepeat>
      {renderSwitch()}
      {renderRecurrenceForm()}
    </StyledEventRepeat>
  )
}

EventRepeat.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.object,
  // value: PropTypes.shape({
  //   factor: PropTypes.string,
  //   every: PropTypes.number,
  //   dow: PropTypes.number,
  //   dom: PropTypes.number,
  //   util: Date,
  // }),
  disabled: PropTypes.bool,
  label: PropTypes.string,
}

const EventRepeatField = connectField(EventRepeat)

export default EventRepeatField
