import React from 'react'
import PropTypes from 'prop-types'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  IconButton,
  useTheme,
  Typography,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import withStyles from '@material-ui/core/styles/withStyles'
import { meteorCall } from '/imports/ui/utils/meteor'
import config from '../config'
import InsertForm from '../add'

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
})

let push

const MyDialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props
  return (
    <DialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
          size="large"
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
})

export default function AddModal({ handleClose, open, insert, push }) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('lg'))
  const methods = {
    save: (form) => {
      meteorCall('insert.schemas', 'saving', form)
      push('/admin/schemas')
    },
  }
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullScreen={fullScreen}
      >
        <MyDialogTitle onClose={handleClose}>Add new document type</MyDialogTitle>
        <DialogContent>
          <InsertForm
            insert={insert}
            handleClose={handleClose}
            item={config.add.defaultObject}
            methods={methods}
            loading={false}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

AddModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  insert: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
}
