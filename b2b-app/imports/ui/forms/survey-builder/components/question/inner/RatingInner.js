import React from 'react'
import PropTypes from 'prop-types'
import { Button, Box, TextField, Grid } from '@material-ui/core'
import Rating from '@material-ui/lab/Rating'
import AddIcon from '@material-ui/icons/Add'
import { useBuilder } from '/imports/ui/forms/survey-builder/context'
import { useSelectedPartValue } from '/imports/ui/forms/survey-builder/recoil/hooks'
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked'

const maxOptions = Array.from({ length: 10 }, (_, i) => String(i + 1))

const RatingInner = ({ pid, part, setPropertyByValue }) => {
  const selectedPart = useSelectedPartValue()
  const { isMobile } = useBuilder()
  const showMobileActions = isMobile && selectedPart === pid

  return (
    <Grid container spacing={1} alignItems="flex-start">
      <Grid item style={{ visibility: 'hidden' }}>
        <RadioButtonUncheckedIcon />
      </Grid>
      <Grid item xs={3}>
        <TextField
          id={`${pid}_${0}`}
          fullWidth
          select
          value={part.answers?.[0]?.max}
          onChange={({ target: { value } }) =>
            setPropertyByValue({
              pid,
              path: `answers[${0}].max`,
              value,
            })
          }
          label="Max Number"
          SelectProps={{
            native: true,
          }}
        >
          {maxOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={6}>
        <Box component="fieldset" mb={3} borderColor="transparent">
          <Rating name={pid} max={Number(part.answers?.[0]?.max) || 1} readOnly />
        </Box>
      </Grid>

      {showMobileActions && (
        <Button
          variant="outlined"
          color="default"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => add()}
        >
          New item
        </Button>
      )}
    </Grid>
  )
}

RatingInner.propTypes = {
  /** single instance part id */
  pid: PropTypes.string.isRequired,
}

RatingInner.defaultProps = {
  initialList: [''],
}

export { RatingInner }
