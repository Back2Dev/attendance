import React, { useEffect, useRef, useState } from 'react'
import {
  Switch,
  FormControlLabel,
  Select,
  Input,
  MenuItem,
  Button,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
} from '@mui/material'
import styled from 'styled-components'
import moment from 'moment'

const StyledRepeat = styled.div`
  margin: 10px 0;
  .input-every {
    width: 50px;
    input { text-align: center; }
  }
  .repeat-option { margin: 10px 0; }
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
  .repeat-ends {
    margin: 10px 0;
    .inline-radio-label {
      span { margin-right: 10px; }
      &.on input { width: 160px; }
      &.after input { width: 50px; }
    }
  }
`

const DOW_LABELS = { 1: 'M', 2: 'T', 3: 'W', 4: 'T', 5: 'F', 6: 'S', 0: 'S' }

const RepeatWidget = ({ value, onChange, when: whenProp }) => {
  const when = whenProp ? new Date(whenProp) : new Date()

  const [enabled, setEnabled] = useState(!!value?.factor)
  const [factor, setFactor] = useState(value?.factor || 'week')
  const [every, setEvery] = useState(value?.every || 1)
  const [dow, setDow] = useState(value?.dow || [moment(when).day()])
  const [dom, setDom] = useState(value?.dom ?? moment(when).date())
  const [until, setUntil] = useState(value?.until ? new Date(value.until) : moment(when).add(6, 'months').toDate())
  const [endsOpt, setEndsOpt] = useState('on')
  const [endsAfter, setEndsAfter] = useState(12)
  const [changed, setChanged] = useState(null)

  const isMountedRef = useRef(false)
  const selfChangeRef = useRef(false)
  const prevValueRef = useRef(value)

  // Sync from external value changes (e.g. initial load from DB)
  useEffect(() => {
    if (selfChangeRef.current) {
      selfChangeRef.current = false
      prevValueRef.current = value
      return
    }
    const prev = prevValueRef.current
    const same =
      !!value?.factor === !!prev?.factor &&
      value?.factor === prev?.factor &&
      value?.every === prev?.every &&
      JSON.stringify(value?.dow) === JSON.stringify(prev?.dow) &&
      value?.dom === prev?.dom &&
      (value?.until ? new Date(value.until).getTime() : null) ===
        (prev?.until ? new Date(prev.until).getTime() : null)
    prevValueRef.current = value
    if (same) return

    setEnabled(!!value?.factor)
    setFactor(value?.factor || 'week')
    setEvery(value?.every || 1)
    setDow(value?.dow || [moment(when).day()])
    setDom(value?.dom ?? moment(when).date())
    setUntil(value?.until ? new Date(value.until) : moment(when).add(6, 'months').toDate())
  }, [value])

  // Recalculate until when endsOpt=after
  useEffect(() => {
    if (endsOpt === 'after' && endsAfter) {
      setUntil(moment(when).add(every * endsAfter, factor).toDate())
      setChanged(new Date())
    }
  }, [factor, every, endsOpt, endsAfter])

  // Emit value upward — skip on mount
  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true
      return
    }
    selfChangeRef.current = true
    if (!enabled) {
      onChange(undefined)
      return
    }
    onChange({ factor, every, dow, dom, until })
  }, [changed])

  const toggleDow = (d) => {
    const next = dow.includes(d) ? dow.filter((x) => x !== d) : [...dow, d]
    setDow(next)
    setChanged(new Date())
  }

  const weeklyOptions = () => {
    if (factor !== 'week') return null
    const days = Array.from({ length: 7 }, (_, i) => (i < 6 ? i + 1 : 0))
    return (
      <div className="dow-options">
        {days.map((d) => (
          <Button
            key={d}
            variant={dow.includes(d) ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => toggleDow(d)}
          >
            {DOW_LABELS[d]}
          </Button>
        ))}
      </div>
    )
  }

  const endsOnInput = (
    <div className="inline-radio-label on">
      <span>On</span>
      <Input
        type="date"
        value={until ? moment(until).format('YYYY-MM-DD') : ''}
        onChange={(e) => { setUntil(moment(e.target.value).toDate()); setChanged(new Date()) }}
        disabled={endsOpt !== 'on'}
      />
    </div>
  )

  const endsAfterInput = (
    <div className="inline-radio-label after">
      <span>After</span>
      <Input
        type="number"
        value={endsAfter}
        onChange={(e) => { setEndsAfter(parseInt(e.target.value)); setChanged(new Date()) }}
        disabled={endsOpt !== 'after'}
      />{' '}occurrences
    </div>
  )

  return (
    <StyledRepeat>
      <FormControlLabel
        control={
          <Switch
            checked={enabled}
            onChange={() => { setEnabled((v) => !v); setChanged(new Date()) }}
            color="primary"
          />
        }
        label="Repeat"
      />
      {enabled && (
        <div>
          <div>
            Repeat every{' '}
            <Input
              className="input-every"
              type="number"
              value={every}
              onChange={(e) => { setEvery(Number(e.target.value)); setChanged(new Date()) }}
            />{' '}
            <Select
              value={factor}
              onChange={(e) => { setFactor(e.target.value); setChanged(new Date()) }}
              margin="dense"
            >
              <MenuItem value="day">Day</MenuItem>
              <MenuItem value="week">Week</MenuItem>
              <MenuItem value="month">Month</MenuItem>
              <MenuItem value="year">Year</MenuItem>
            </Select>
          </div>
          <div className="repeat-option">{weeklyOptions()}</div>
          <div className="repeat-ends">
            <FormLabel component="legend">Ends</FormLabel>
            <RadioGroup value={endsOpt} onChange={(e) => { setEndsOpt(e.target.value); setChanged(new Date()) }}>
              <FormControlLabel value="on" control={<Radio />} label={endsOnInput} />
              <FormControlLabel value="after" control={<Radio />} label={endsAfterInput} />
            </RadioGroup>
          </div>
        </div>
      )}
    </StyledRepeat>
  )
}

export default RepeatWidget
