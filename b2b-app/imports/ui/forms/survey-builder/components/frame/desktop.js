import React, { createElement, useEffect, useState, Fragment } from 'react'
import PropTypes from 'prop-types'

import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import AddIcon from '@material-ui/icons/Add'
import debug from 'debug'
import { makeStyles } from '@material-ui/core/styles'
import { defaultPart } from '/imports/ui/forms/survey-builder/recoil/hooks'
import {
  Card,
  Box,
  IconButton,
  CardHeader,
  CardContent,
  CardActions,
  TextField,
  Grid,
  Divider,
} from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import CancelIcon from '@material-ui/icons/Cancel'
import { Question } from '$sb/components/question/field'

import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import MenuIcon from '@material-ui/icons/Menu'
import UnfoldLessIcon from '@material-ui/icons/UnfoldLess'
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore'

const log = debug('builder:frame')

const borderColor = (theme) =>
  theme.palette.type === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)'

const useStyles = (selected, color) =>
  makeStyles((theme) => ({
    cardRoot: {
      outlineStyle: 'solid',
      outlineWidth: 1,
      outlineColor: selected ? theme.palette.primary.main : borderColor(theme),

      background: `conic-gradient(from 90deg at top 5px left 5px, #0000 90deg, ${color} 0) 0 0, conic-gradient(from 180deg at top 5px right 5px, #0000 90deg, ${color} 0) 100% 0, conic-gradient(from 0deg at bottom 5px left 5px, #0000 90deg, ${color} 0) 0 100%, conic-gradient(from -90deg at bottom 5px right 5px, #0000 90deg, ${color} 0) 100% 100%`,
      backgroundSize: '10px',
      backgroundOrigin: 'border-box',
      backgroundRepeat: 'no-repeat',
    },
    collapseIcon: {
      position: 'absolute',
      right: 0,
    },
    collapseHelperText: {
      position: 'absolute',
      left: '15px',
      color,
    },
    addPartButton: {
      background: 'white',
      borderRadius: '10px',
      width: '100px',
      boxShadow: '1px 1px 3px lightgray',
      // position: 'absolute',
      // bottom: 0,
    },
    cardBody: {
      backgroundColor: 'lightgray',
      paddingTop: '0px',
    },
    gridPadding: {
      padding: '0 1rem',
    },
  }))

const DesktopFrame = ({ question, children, ...props }) => {
  const classes = useStyles((selected = false), (color = 'black'))()
  const [isFrameCollapse, setIsFrameCollapse] = useState(false)

  // useEffect(() => {
  //   setIsFrameCollapse(sectionState)
  // }, [sectionState])

  // const actionTypes = {
  //   remove: { icon: DeleteOutlineIcon, handler: actions.onRemove },
  //   moveUp: {
  //     icon: KeyboardArrowUpIcon,
  //     handler: () =>
  //       actions.onMove({ dir: 'up', draggableId: otherProps['data-rbd-draggable-id'] }),
  //   },
  //   moveDown: {
  //     icon: KeyboardArrowDownIcon,
  //     handler: () =>
  //       actions.onMove({
  //         dir: 'down',
  //         draggableId: otherProps['data-rbd-draggable-id'],
  //       }),
  //   },
  //   copy: { icon: FileCopyIcon, handler: () => actions.onCopyPart() },
  // }

  // const createActions = (...newActions) =>
  //   newActions.map((t, i) => (
  //     <IconButton
  //       size="small"
  //       key={i}
  //       onClick={actionTypes[t].handler}
  //       className={actionTypes[t].classes}
  //     >
  //       {createElement(actionTypes[t].icon)}
  //     </IconButton>
  //   ))

  return (
    <Card>
      <CardHeader
        avatar={
          <IconButton aria-label="settings">
            <CancelIcon />
          </IconButton>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={<Question question={question} />}
        // subheader="September 14, 2016"
      />
      {/* <Card
          className={classes.cardRoot}
          onClick={actions.onSelect}
          onFocus={actions.onSelect}
          onBlur={actions.onDeselect}
          ref={ref}
          {...otherProps}
        > */}
      {/* <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <h3 className={classes.collapseHelperText}>{isFrameCollapse && type}</h3>

        <IconButton aria-label="dragIcon">
          <MenuIcon />
        </IconButton>
        <IconButton
          aria-label="collapse"
          className={classes.collapseIcon}
          onClick={() => {
          }}
        >
          {isFrameCollapse ? <UnfoldMoreIcon /> : <UnfoldLessIcon />}
        </IconButton>
      </div> */}

      <CardContent className={classes.cardBody}>{children}</CardContent>
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
                    checked={question.type === 'paragraph'}
                    onChange={() => {}}
                    name="header"
                  />
                }
                label="Header Only"
              />
            </FormGroup>
          </Grid>

          {/* <Grid item>{createActions('moveUp', 'moveDown', 'copy', 'remove')}</Grid> */}
        </Grid>
      </CardActions>
      {/* </Card> */}
      {/* <div
        style={{
          display: 'flex',
          // display: snapshot.isDragging ? 'none' : 'flex',
          justifyContent: 'center',
        }}
      >
        <IconButton variant="outlined" color="default" className={classes.addPartButton}>
          <AddIcon />
        </IconButton>
      </div> */}
    </Card>
  )
}

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
