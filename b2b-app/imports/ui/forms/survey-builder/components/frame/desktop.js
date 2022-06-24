import React, { createElement, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { IconButton, Divider, Button, Grid } from '@material-ui/core'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
// import CloseIcon from '@material-ui/icons/Close'
// import DragIndicatorIcon from '@material-ui/icons/DragIndicator'
import AddIcon from '@material-ui/icons/Add'
// import styled from 'styled-components'
import debug from 'debug'
import { makeStyles } from '@material-ui/core/styles'
import { useParts, defaultPart } from '/imports/ui/forms/survey-builder/recoil/hooks'
import Card from '@material-ui/core/Card'
// import CardHeader from '@material-ui/core/CardHeader'
// import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import FormatColorFillIcon from '@material-ui/icons/FormatColorFill'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import MenuIcon from '@material-ui/icons/Menu'
import UnfoldLessIcon from '@material-ui/icons/UnfoldLess'
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore'

const log = debug('builder:frame')

const useStyles = makeStyles(() => ({
  hideButton: {
    display: 'none',
  },
  addPartButton: {
    background: 'white',
    borderRadius: '10px',
    width: '100px',
    boxShadow: '1px 1px 3px lightgray',
  },
  cardBody: {
    paddingTop: '0px',
  },
  gridPadding: {
    // padding: '0 37px',
    padding: '0 1rem',
  },
}))

// const borderColor = (theme) =>
//   theme.palette.type === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)'

// const Root = styled('li')(({ theme, isSelected }) => ({
//   listStyle: 'none',
//   backgroundColor: theme.palette.background.paper,
//   padding: theme.spacing(2),
//   outlineStyle: 'solid',
//   outlineWidth: 1,
//   outlineColor: isSelected ? theme.palette.primary.main : borderColor(theme),
//   '&:hover': {
//     outlineColor: isSelected ? theme.palette.primary.main : theme.palette.text.primary,
//   },
//   '.dragIcon': {
//     color: theme.palette.action.active,
//     margin: 3,
//   },
// }))

const DesktopFrame = React.forwardRef(
  (
    {
      children,
      selected,
      actions,
      hide = [],
      setSectionState,
      sectionState,
      belongSection,
      pid,
      index,
      onAddPart,
      onCopyPart,
      setHeaderOnly,
      type,
      ...otherProps
    },
    ref
  ) => {
    const classes = useStyles()
    const [isFrameCollapse, setIsFrameCollapse] = useState(false)

    useEffect(() => {
      setIsFrameCollapse(sectionState)
    }, [sectionState])

    const actionTypes = {
      // add: {
      //   icon: AddIcon,
      //   handler: () => actions.onAdd(),
      // },
      remove: { icon: DeleteOutlineIcon, handler: actions.onRemove },
      moveUp: {
        icon: KeyboardArrowUpIcon,
        handler: () =>
          actions.onMove({ dir: 'up', draggableId: otherProps['data-rbd-draggable-id'] }),
      },
      moveDown: {
        icon: KeyboardArrowDownIcon,
        handler: () =>
          actions.onMove({
            dir: 'down',
            draggableId: otherProps['data-rbd-draggable-id'],
          }),
      },
      // color: { icon: FormatColorFillIcon, handler: () => {} },
      copy: { icon: FileCopyIcon, handler: () => actions.onCopyPart() },
    }

    const createActions = (...types) =>
      types.map((t, i) => (
        <IconButton
          size="small"
          key={i}
          onClick={actionTypes[t].handler}
          className={actionTypes[t].classes}
        >
          {createElement(actionTypes[t].icon)}
        </IconButton>
      ))

    return (
      <>
        <Card
          onClick={actions.onSelect}
          // isSelected={selected}
          onFocus={actions.onSelect}
          onBlur={actions.onDeselect}
          ref={ref}
          {...otherProps}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <IconButton aria-label="dragIcon">
              <MenuIcon />
            </IconButton>
            <IconButton
              aria-label="collapse"
              style={{ position: 'absolute', right: 0 }}
              onClick={() => {
                if (pid === belongSection) {
                  setSectionState((prev) => ({
                    ...prev,
                    [belongSection]: !prev[belongSection],
                  }))
                } else {
                  setIsFrameCollapse((prev) => !prev)
                }
              }}
            >
              {isFrameCollapse ? <UnfoldMoreIcon /> : <UnfoldLessIcon />}
            </IconButton>
          </div>

          <CardContent
            style={isFrameCollapse ? { display: 'none' } : { display: 'block' }}
            className={classes.cardBody}
          >
            {children}
          </CardContent>
          <CardActions>
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              className={classes.gridPadding}
            >
              <Grid item>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={type === 'paragraph'}
                        onChange={() => {
                          if (type === 'paragraph') {
                            setHeaderOnly({
                              pid,
                              content: { ...defaultPart },
                            })
                          } else {
                            setHeaderOnly({
                              pid,
                              content: {
                                paragraph: '',
                                type: 'paragraph',
                              },
                            })
                          }
                        }}
                        name="header"
                      />
                    }
                    label="Header Only"
                  />
                </FormGroup>
              </Grid>

              <Grid item>
                {/* <Grid container > */}
                {/* {createActions('color', )} */}
                {/* <Divider orientation="vertical" flexItem /> */}
                {createActions('moveUp', 'moveDown', 'copy', 'remove')}
                {/* </Grid> */}
              </Grid>
            </Grid>
          </CardActions>
        </Card>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton
            variant="outlined"
            color="default"
            className={classes.addPartButton}
            onClick={onAddPart}
          >
            <AddIcon />
          </IconButton>
        </div>
      </>
    )
  }
)

DesktopFrame.displayName = 'DesktopFrame'

DesktopFrame.propTypes = {
  /** A question type component */
  children: PropTypes.node.isRequired,
  /** whether frame or children has received focus or been clicked on */
  selected: PropTypes.bool,
  /** action handlers. eg. onSelect, onRemove, etc */
  actions: PropTypes.objectOf(PropTypes.func),
}

export { DesktopFrame }
