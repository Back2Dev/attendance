import React from 'react'
import { Box, TextField } from '@material-ui/core'

const Section = React.memo(({ section, onSectionChange }) => {
  return (
    <Box style={{ padding: '1rem 2rem 0rem 2rem' }}>
      <TextField
        fullWidth
        value={section.name}
        onChange={(e) => {
          onSectionChange({ key: 'name', value: e.target.value })
        }}
      />
    </Box>
  )
})

export default Section
