import React from 'react'
import { connectField } from 'uniforms'
import { Box } from '@material-ui/core'
import Slider from '@material-ui/core/Slider'
import { withStyles, makeStyles } from '@material-ui/core/styles'

const PrettoSlider = withStyles({
  root: {
    color: '#52af77',
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider)

const SliderField = ({ value, onChange, field, name, ...rest }) => {
  // const [value, setValue] = React.useState(1)
  const [hover, setHover] = React.useState(-1)
  console.log('rest', rest)
  const max = rest?.max || 10
  return (
    <Box component="fieldset" mb={3} borderColor="transparent">
      {field.label}
      <PrettoSlider
        name={name}
        max={Number(max)}
        valueLabelDisplay="auto"
        aria-label="pretto slider"
        defaultValue={value}
      />
    </Box>
  )
}

export default connectField(SliderField)
