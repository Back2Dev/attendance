import React from 'react'
import PropTypes from 'prop-types'

import { default as MuiDrawer } from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@mui/styles'
import { Box, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
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
