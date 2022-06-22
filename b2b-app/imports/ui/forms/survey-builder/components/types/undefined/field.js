import React, { createElement } from 'react'
import AddIcon from '@material-ui/icons/Add'
import { IconButton } from '@material-ui/core'
import PropTypes from 'prop-types'
import debug from 'debug'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import { MoreList } from './moreList'
import { UploadImage } from '$sb/components/types/undefined/upload'

const log = debug('builder:Field')

const useStyles = makeStyles({
  hideUnderline: {
    '&:before': {
      'border-bottom': '1px solid white',
    },
    '&:hover:not(.Mui-disabled)::before': {
      'border-bottom': '1px solid black',
    },
  },
  answerField: {
    '&:hover .MuiInputAdornment-root': {
      visibility: 'visible',
    },
  },
  InputAdornment: {
    visibility: 'hidden',
  },
})

const Field = ({
  text,
  placeholder,
  label,
  onChange,
  onRemove,
  onAdd,
  onUpload,
  onDeleteOption,
  actions = [],
  disableRemove,
  showMobileActions,
  //   type = 'answer',
  underline,
  showMore,
  showUploadImage,
  variant,
  size,
  ...props
}) => {
  const classes = useStyles()

  const actionTypes = {
    add: {
      icon: AddIcon,
      handler: onAdd,
    },
    remove: { icon: DeleteOutlineIcon, handler: onRemove },
    deleteOption: { icon: DeleteOutlineIcon, handler: onDeleteOption },
  }

  const createActions = (...types) =>
    types.map((t, i) => (
      <IconButton size="small" key={i} onClick={actionTypes[t].handler}>
        {createElement(actionTypes[t].icon)}
      </IconButton>
    ))

  return (
    <TextField
      //   {...style[type]}
      size={size}
      variant={variant}
      fullWidth
      label={label}
      value={text ?? ''}
      placeholder={placeholder}
      onChange={onChange}
      InputProps={{
        classes: {
          underline: underline ? undefined : classes.hideUnderline,
          root: classes.answerField,
        },

        endAdornment: (
          <InputAdornment classes={{ root: classes.InputAdornment }} position="end">
            {showMore && <MoreList {...props} />}
            {showUploadImage && <UploadImage {...props} />}
            {createActions(...actions)}
          </InputAdornment>
        ),
      }}
    />
  )
}

Field.displayName = 'Field'

Field.propTypes = {
  /** Initial text to show */
  text: PropTypes.string,
  /** Show placeholder when `text` content is empty */
  placeholder: PropTypes.string,
  /** function gets called when text field loses focus */
  onTextChange: PropTypes.func,
  /** function gets called when delete button pressed */
  onRemove: PropTypes.func,
  /** function gets called when add button pressed */
  onAdd: PropTypes.func,
  /** disable removing choice */
  disableRemove: PropTypes.bool,
  /** whether to show actions for mobile */
  showMobileActions: PropTypes.bool,
}

Field.defaultProps = {
  placeholder: 'New choice',
}

export { Field }
