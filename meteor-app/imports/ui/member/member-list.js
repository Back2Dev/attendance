import React from 'react'
import PropTypes from 'prop-types'
import { Box } from '@mui/material'

const MemberList = props => {
  const { members, Component, style, onCardClick, list } = props

  return (
    <Box style={style}>
      {React.Children.map(props.children, child => child)}

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          height: '100%',
          alignContent: 'center',
          justifyContent: 'center'
        }}
      >
        {!props.loading &&
          members &&
          members.map(member => (
            <Box key={member._id} onClick={() => onCardClick(member)}>
              <Component
                className={props.componentClassName}
                list={list}
                {...member}
                style={{ padding: '5px' }}
              />
            </Box>
          ))}
      </Box>
    </Box>
  )
}

MemberList.propTypes = {
  Component: PropTypes.func.isRequired,
  componentClassName: PropTypes.string,
  Loader: PropTypes.func.isRequired,
  members: PropTypes.array,
  title: PropTypes.string
}

export default MemberList
