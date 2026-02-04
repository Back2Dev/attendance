import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Avatar, Box, Chip } from '@mui/material'

const MemberCardSmall = props => {
  const { _id, avatar = 'default.jpg', name } = props
  const shortName = (function() {
    const names = name ? name.split(' ') : ['Unknown']
    return names[1] ? `${names[0]} ${names[1][0]}` : `${names[0]}`
  })(name)
  const color = props.status === 'expired' ? 'error' : 'default'
  return (
    <Box sx={{ textAlign: 'center', mb: 1, width: '100%' }}>
      <Avatar
        src={`/images/avatars/${avatar}`}
        alt={name}
        sx={{
          width: 56,
          height: 56,
          mx: 'auto',
          border: '3px solid white',
          cursor: 'pointer'
        }}
        onClick={() => props.onCardClick && props.onCardClick(props._id, props.name)}
      />
      <Box sx={{ mt: 1 }}>
        <Chip
          size="medium"
          color={color}
          label={shortName}
          sx={{ fontSize: '1rem', px: 1 }}
        />
      </Box>
    </Box>
  )
}

MemberCardSmall.propTypes = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired
}

export default withRouter(MemberCardSmall)
