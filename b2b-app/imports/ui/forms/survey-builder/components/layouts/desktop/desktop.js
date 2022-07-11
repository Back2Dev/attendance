import React, { useContext } from 'react'
import { Box } from '@material-ui/core'
import PropTypes from 'prop-types'
import { EditorContext } from '/imports/ui/forms/framework/framework'

const DesktopLayout = ({ toolbar, left, center, right }) => {
  const formContext = useContext(EditorContext)
  const isFormViewing = formContext.checked

  return (
    <Box height="calc(100vh - 64px - 48px)">
      {/* <Box
        height={40}
        flex="0 1 auto"
        border="1px solid lightgrey"
        display="flex"
        alignItems="center"
      >
        {toolbar}
      </Box> */}
      <Box position="relative" height="calc(100% - 40px)">
        {/* {!isFormViewing && (
          <Box
            position="absolute"
            top={0}
            left={0}
            bottom={0}
            width="20%"
            border="1px solid lightgrey"
            style={{ background: '#FFFFFF' }}
          >
            {left}
          </Box>
        )} */}
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
        {!isFormViewing && (
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
        )}
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
