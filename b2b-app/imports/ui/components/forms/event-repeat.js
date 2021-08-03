import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { connectField, useForm } from 'uniforms'
import {
  Switch,
  FormControlLabel,
  Select,
  Input,
  MenuItem,
  Button,
} from '@material-ui/core'
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
  .dow-options {
    button {
      width: 35px;
      height: 35px;
      min-width: unset;
      padding: 0;
      border-radius: 50%;
      margin-right: 5px;
    }
  }
`

const EventRepeat = ({ className, disabled, onChange, value = {}, label }) => {
  const formContext = useForm()
  console.log('selected date', formContext.model.when)

  console.log('value', JSON.stringify(value, null, 2))
  const [factor, setFactor] = useState(value?.factor ? value.factor : 'week')
  const [every, setEvery] = useState(value?.every || 1)
  const [dow, setDow] = useState(value?.dow || [])
  const [dom, setDom] = useState(value?.dom || null)
  const [util, setUtil] = useState(value?.util || null)

  useEffect(() => {
    if (formContext.model.when) {
      setDow([moment(formContext.model.when).day()])
    }
  }, [formContext.model.when])

  const [enabled, setEnabled] = useState(!!value?.factor)

  const toggleDow = (d) => {
    const newDow = dow.filter((item) => item !== d)
    if (dow.indexOf(d) === -1) {
      newDow.push(d)
    }
    setDow(newDow)
  }

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

  const getDowLabel = (i) => {
    switch (i) {
      case 0:
        return 'M'
      case 1:
        return 'T'
      case 2:
        return 'W'
      case 3:
        return 'T'
      case 4:
        return 'F'
      case 5:
        return 'S'
      case 6:
        return 'S'
      default:
        return 'N/A'
    }
  }

  const renderWeeklyOption = () => {
    if (factor !== 'week') {
      return null
    }
    const days = []
    for (let i = 0; i < 7; i += 1) {
      days.push({
        dow: i,
        selected: dow.indexOf(i) !== -1,
      })
    }

    return (
      <div className="dow-options">
        {days.map((d) => (
          <Button
            key={d.dow}
            variant="contained"
            color={d.selected ? 'primary' : 'default'}
            onClick={() => toggleDow(d.dow)}
          >
            {getDowLabel(d.dow)}
          </Button>
        ))}
      </div>
    )
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
