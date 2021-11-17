import { Box } from '@material-ui/core'
import React from 'react'
import PropTypes from 'prop-types'

const DesktopLayout = ({ toolbar, left, center, right }) => {
  return (
    <Box height="calc(100vh - 64px - 48px)">
      <Box
        height={40}
        flex="0 1 auto"
        border="1px solid lightgrey"
        display="flex"
        alignItems="center"
      >
        {toolbar}
      </Box>
      <Box position="relative" height="calc(100% - 40px)">
        <Box
          position="absolute"
          top={0}
          left={0}
          bottom={0}
          width="20%"
          border="1px solid lightgrey"
        >
          {left}
        </Box>
        <Box
          position="absolute"
          top={0}
          bottom={0}
          left="20%"
          right="20%"
          border="1px solid lightgrey"
          overflow="auto"
        >
          {center}
        </Box>
        <Box
          position="absolute"
          top={0}
          right={0}
          bottom={0}
          width="20%"
          border="1px solid lightgrey"
        >
          {right}
        </Box>
      </Box>
    </Box>
  )
}

DesktopLayout.propTypes = {
  toolbar: PropTypes.node,
  left: PropTypes.node,
  center: PropTypes.node,
  right: PropTypes.node,
}

export { DesktopLayout }
