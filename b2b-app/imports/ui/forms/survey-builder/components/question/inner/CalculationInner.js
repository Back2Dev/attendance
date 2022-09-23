import React, { useState } from 'react'
import { Grid, TextField } from '@material-ui/core'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  gridRoot: {
    flexGrow: 1,
    marginBottom: '1rem',
  },
}))

const expressionOptions = [
  { label: 'ID', value: 'id' },
  { label: 'Value', value: 'value' },
  { label: 'Integer', value: 'integer' },
]
const operators = [
  { label: '+', value: '+' },
  { label: '-', value: '-' },
  { label: 'x', value: '*' },
  { label: '÷', value: '%' },
]

const TargetField = ({ pid, setPropertyByValue, value = 'integer', target }) => {
  return (
    <TextField
      fullWidth
      select
      value={value}
      onChange={({ target: { value } }) => {
        setPropertyByValue({
          pid,
          path: `answers[0].expression.${target}`,
          value,
        })
        // setExpType(value)
      }}
      label="Target"
      SelectProps={{
        native: true,
      }}
    >
      {expressionOptions.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </TextField>
  )
}

const TargetValueField = ({ pid, setPropertyByValue, value = 0, targetValue }) => {
  return (
    <TextField
      fullWidth
      label="Target Value"
      value={value}
      InputLabelProps={{
        shrink: true,
      }}
      onChange={({ target: { value } }) =>
        setPropertyByValue({
          pid,
          path: `answers[0].expression.${targetValue}`,
          value,
        })
      }
    />
  )
}

const OperatorField = ({ pid, setPropertyByValue, value = '*' }) => {
  return (
    <TextField
      // id={`${pid}_${expressionIndex}`}
      fullWidth
      select
      value={value}
      onChange={({ target: { value } }) =>
        setPropertyByValue({
          pid,
          path: `answers[0].expression.operator`,
          value,
        })
      }
      label="Operator"
      SelectProps={{
        native: true,
      }}
    >
      {operators.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </TextField>
  )
}

const CalculationInner = ({ pid, question, setPropertyByValue }) => {
  const classes = useStyles()
  // const [exptype, setExpType] = useState({ 0: 'integer', 1: 'integer' })
  const expValue = question.answers[0]?.expression
  return (
    <div className={classes.gridRoot}>
      <Grid container spacing={1} alignItems="flex-end">
        <Grid item xs={1} style={{ marginLeft: '32px' }}>
          <TargetField
            pid={pid}
            target={'target1'}
            setPropertyByValue={setPropertyByValue}
            //   setExpType={(value) => setExpType((exp) => (exp[0] = value))}
            value={expValue?.target1}
          />
        </Grid>
        <Grid item xs={4}>
          <TargetValueField
            pid={pid}
            targetValue={'targetValue1'}
            setPropertyByValue={setPropertyByValue}
            //   type={exptype[0]}
            value={expValue?.targetValue1}
          />
        </Grid>

        <Grid item xs={1}>
          <OperatorField
            pid={pid}
            expressionIndex={2}
            setPropertyByValue={setPropertyByValue}
            value={expValue?.operator}
          />
        </Grid>

        <Grid item xs={1}>
          <TargetField
            pid={pid}
            target={'target2'}
            setPropertyByValue={setPropertyByValue}
            value={expValue?.target2}
          />
        </Grid>
        <Grid item xs={4}>
          <TargetValueField
            pid={pid}
            targetValue={'targetValue2'}
            setPropertyByValue={setPropertyByValue}
            // type={exptype[0]}
            value={expValue?.targetValue2}
          />
        </Grid>
      </Grid>
    </div>
  )
}

CalculationInner.propTypes = {
  /** single instance part id */
  pid: PropTypes.string.isRequired,
  /** function gets called when updating atom's value based on the input path argument */
  setPropertyByValue: PropTypes.func,
  /** Object contains question/answers, each pid correspond to a specific part  */
  question: PropTypes.object.isRequired,
}

CalculationInner.defaultProps = {
  initialList: [''],
}

export { CalculationInner }
