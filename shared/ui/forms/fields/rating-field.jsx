import React from 'react'
import { connectField } from 'uniforms'
import Box from '@mui/material/Box'
import Rating from '@mui/material/Rating'

const RatingField = ({ max = 1, value, onChange }) => {
  // const [value, setValue] = React.useState(1)

  return (
    <Box component="fieldset" mb={3} borderColor="transparent">
      <Rating
        name="simple-controlled"
        value={value}
        max={Number(max)}
        onChange={(event, newValue) => {
          onChange(newValue)
        }}
      />
    </Box>
  )
}

export default connectField(RatingField)
