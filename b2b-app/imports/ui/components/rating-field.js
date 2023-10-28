import React from 'react'
import { connectField } from 'uniforms'
import { Box } from '@material-ui/core'
import Rating from '@material-ui/lab/Rating'
import HeartIcon from '@material-ui/icons/FavoriteBorderOutlined'
import ThumbIcon from '@material-ui/icons/ThumbUpAltOutlined'

const RatingField = ({ value, onChange, field, name, max = 7 }) => {
  // const [value, setValue] = React.useState(1)
  const [hover, setHover] = React.useState(-1)

  return (
    <Box component="fieldset" mb={3} borderColor="transparent">
      {field.label}
      <br />
      <br />
      {answer}
      <Rating
        name={name}
        size="small"
        value={value}
        emptyLabelText="Please provide a rating"
        precision={0.5}
        getLabelText={(value) => {
          return `${value} Star${value !== 1 ? 's' : ''}`
        }}
        max={Number(max)}
        onChange={(event, newValue) => {
          onChange(newValue)
        }}
        onChangeActive={(event, newHover) => {
          setHover(newHover)
        }}
      />{' '}
      {!!value && `${value}`}
    </Box>
  )
}

export default connectField(RatingField)
