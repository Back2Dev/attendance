import React, { createElement } from 'react'
// import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked'
// import DeleteIcon from '@material-ui/icons/Delete'
// import DragIndicatorIcon from '@material-ui/icons/DragIndicator'
// import DragHandleIcon from '@material-ui/icons/DragHandle'
import AddIcon from '@material-ui/icons/Add'
import { IconButton } from '@material-ui/core'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import debug from 'debug'
// import { InlineEdit } from '/imports/ui/forms/survey-builder/components/core/inline-edit'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
// import FilledInput from '@material-ui/core/FilledInput'
// import FormControl from '@material-ui/core/FormControl'
// import FormHelperText from '@material-ui/core/FormHelperText'
// import Input from '@material-ui/core/Input'
// import InputLabel from '@material-ui/core/InputLabel'
// import Grid from '@material-ui/core/Grid'
import InputAdornment from '@material-ui/core/InputAdornment'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
// import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import CropOriginalIcon from '@material-ui/icons/CropOriginal'
// import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import { MoreList } from './inner'

// import MoreVertIcon from '@material-ui/icons/MoreVert'

const log = debug('builder:item')

export const StyledItem = styled('li')(({ theme }) => ({
  listStyleType: 'none',
  display: 'flex',
  alignItems: 'center',
  '.inline-edit': {
    marginLeft: theme.spacing(1),
    flexGrow: 1,
  },
  '.icon': {
    margin: 3,
  },
  [theme.breakpoints.up('sm')]: {
    '&:hover': { outline: `1px solid ${theme.palette.divider}` },
    '.inline-edit': {
      marginLeft: theme.spacing(2),
    },
  },
}))

const useStyles = makeStyles({
  underline: {
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

export const Actions = styled('div')(({ theme, showMobileActions }) => {
  /**
   * Visually hide an element, but leave it available for screen readers
   * @link https://github.com/h5bp/html5-boilerplate/blob/master/dist/css/main.css
   * @link http://snook.ca/archives/html_and_css/hiding-content-for-accessibility
   */
  const hideVisually = {
    border: '0',
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: '0',
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: '1px',
  }

  /**
   * Extends the .screen-reader class to allow the element to be focusable when navigated to via the keyboard
   * @link https://github.com/h5bp/html5-boilerplate/blob/master/dist/css/main.css
   * @link https://www.drupal.org/node/897638
   */
  const showVisually = {
    clip: 'auto',
    height: 'auto',
    overflow: 'visible',
    position: 'static',
    whiteSpace: 'normal',
    width: 'auto',
    flexShrink: 0,
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(2),
    },
  }
  if (showMobileActions) {
    return showVisually
  }

  /** show on mouse hover and when tabbing. Note: you must import styled from 'styled-components'
   * and not from '@material-ui/core/styles' when referencing components.
   * https://styled-components.com/docs/advanced#referring-to-other-components */
  return {
    ...hideVisually,
    [`${StyledItem}:hover &, &:focus-within`]: showVisually,
    '& svg': {
      verticalAlign: 'middle',
      fill: theme.palette.action.active,
    },
    '.delete-button[disabled] svg': {
      fill: theme.palette.action.disabled,
    },
  }
})

const style = {
  question: { margin: 'normal' },
  answer: {},
  option: {
    variant: 'filled',
    size: 'small',
    margin: 'dense',
  },
}

/** A radio button with actions to move it up/down and delete. Used by Single component */
const Item = ({
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
  type = 'answer',
  showMore,
  ...props
}) => {
  // const preventFocus = (e) => {
  // Actions stay visible after user clicks a button and mouse leaves Item. The reason this
  // happens is because Actions uses the 'focus-within' rule to make it visible. This fixes it by
  // preventing focus but still allows tabbing to work correctly.
  // e.preventDefault()
  // }
  // const ListStyleType = showMobileActions ? DragHandleIcon : RadioButtonUncheckedIcon
  const classes = useStyles()

  const actionTypes = {
    add: {
      icon: AddIcon,
      handler: onAdd,
    },
    remove: { icon: DeleteOutlineIcon, handler: onRemove },
    upload: { icon: CropOriginalIcon, handler: onUpload },
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
      {...style[type]}
      fullWidth
      label={label}
      value={text ?? ''}
      placeholder={placeholder}
      onChange={onChange}
      InputProps={{
        classes: {
          underline: type === 'answer' ? classes.underline : undefined,
          root: classes.answerField,
        },

        endAdornment: (
          <InputAdornment classes={{ root: classes.InputAdornment }} position="end">
            {showMore && <MoreList {...props} />}

            {createActions(...actions)}
          </InputAdornment>
        ),
      }}
    />
    // <StyledItem ref={ref} {...otherProps}>
    //   {showMobileActions !== undefined && <ListStyleType className="icon" />}

    //   <InlineEdit
    //     // className="inline-edit"
    //     text={text}
    //     placeholder={placeholder}
    //     onTextChange={onTextChange}
    //     onAdd={onAdd}
    //     pid={pid}
    //     index={index}
    //     {...otherProps}
    //   />
    //   <Actions onMouseDown={preventFocus} showMobileActions={showMobileActions}>
    //     {onAdd && (
    //       <Hidden xsDown>
    //         <DragIndicatorIcon />
    //         <IconButton size="small" onClick={onAdd} aria-label="add">
    //           <AddIcon />
    //         </IconButton>
    //       </Hidden>
    //     )}

    //     {onRemove && (
    //       <IconButton
    //         className="delete-button"
    //         size="small"
    //         onClick={onRemove}
    //         aria-label="delete"
    //         disabled={disableRemove}
    //       >
    //         <DeleteIcon />
    //       </IconButton>
    //     )}
    //   </Actions>
    // </StyledItem>
  )
}

Item.displayName = 'Item'

Item.propTypes = {
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

Item.defaultProps = {
  placeholder: 'New choice',
}

export { Item }
