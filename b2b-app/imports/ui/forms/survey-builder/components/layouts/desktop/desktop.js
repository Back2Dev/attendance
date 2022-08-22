import React, { useContext } from 'react'
import { Box } from '@material-ui/core'
import PropTypes from 'prop-types'
import { EditorContext } from '/imports/ui/forms/framework/framework'

const DesktopLayout = ({ center, right }) => {
  const formContext = useContext(EditorContext)
  const isFormViewing = formContext.checked

  return (
    <Box position="relative">
      <Box maxWidth="1100px" margin="0 auto" overflow="auto">
        {center}
      </Box>

      {!isFormViewing && formContext.viewJSON && (
        <Box position="absolute" top="10px" right="10px" height="100%" width="382px">
          {right}
        </Box>
      )}
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
