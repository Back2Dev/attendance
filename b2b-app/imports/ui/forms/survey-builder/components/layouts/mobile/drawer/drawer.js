import React from 'react'
import PropTypes from 'prop-types'

import { default as MuiDrawer } from '@material-ui/core/Drawer'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import { Box, IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { useSetDrawer } from '/imports/ui/forms/survey-builder/recoil/hooks'

const useStyles = makeStyles({
  paperAnchorBottom: {
    maxHeight: '50%',
  },
})

const Drawer = ({ open, title = '', children }) => {
  const classes = useStyles()
  const setDrawer = useSetDrawer()

  return (
    <div>
      <MuiDrawer
        open={open}
        anchor="bottom"
        variant="persistent"
        classes={{
          paperAnchorBottom: classes.paperAnchorBottom,
        }}
      >
        <Box display="flex" justifyContent="space-between">
          <Typography>{title}</Typography>
          <IconButton size="small" onClick={() => setDrawer(null)}>
            <CloseIcon />
          </IconButton>
        </Box>
        {children}
      </MuiDrawer>
    </div>
  )
}

Drawer.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  children: PropTypes.node,
}

export { Drawer }
