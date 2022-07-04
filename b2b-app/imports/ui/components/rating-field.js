import React from 'react'
import { connectField } from 'uniforms'
import { Box } from '@material-ui/core'
import Rating from '@material-ui/lab/Rating'

const RatingField = ({ max }) => {
  const [value, setValue] = React.useState(3)

  return (
    <Box component="fieldset" mb={3} borderColor="transparent">
      <Rating
        name="simple-controlled"
        value={value}
        max={Number(max) || 10}
        onChange={(event, newValue) => {
          setValue(newValue)
        }}
      />
    </Box>
  )
}

export default connectField(RatingField)
