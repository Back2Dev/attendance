import React, { useState } from 'react'
import PropTypes from 'prop-types'
import debug from 'debug'
import { makeStyles } from '@material-ui/core/styles'
import {
  Card,
  Box,
  IconButton,
  CardHeader,
  CardContent,
  CardActions,
  Grid,
  Collapse,
  Typography,
} from '@material-ui/core'
import CancelIcon from '@material-ui/icons/Cancel'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'
import SwapVerticalCircleIcon from '@material-ui/icons/SwapVerticalCircle'
import { useEffect } from 'react'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import VisibilityIcon from '@material-ui/icons/Visibility'
import DragHandleIcon from '@material-ui/icons/DragHandle'
import ReactJson from 'react-json-view'
import { Random } from 'meteor/random'
import AddCircleIcon from '@material-ui/icons/AddCircle'

const log = debug('builder:frame')

const jsonViewConfig = {
  displayDataTypes: false,
  quotesOnKeys: false,
}

const useStyles = makeStyles(() => ({
  root: {
    '& .MuiCardHeader-avatar': {
      flex: 1,
      margin: '0px',
    },
  },
}))

const DesktopFrame = ({
  question,
  children,
  onRemoveQuestion,
  sectionCollapse,
  dragHandleProps,
  onCopyQuestion,
  onMoveUp,
  onMoveDown,
  moveUpDisabled,
  moveDownDisabled,
  onAddAnswer,
}) => {
  const classes = useStyles()
  const [collapse, setCollapse] = useState(sectionCollapse)
  const [showJSON, setShowJSON] = useState(false)

  useEffect(() => {
    setCollapse(sectionCollapse)
  }, [sectionCollapse])

  return (
    <Card className={classes.root}>
      <CardHeader
        style={{ background: 'lightgray', padding: '0.3rem' }}
        avatar={
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <Box>
              <IconButton
                style={{ padding: '0.3rem' }}
                aria-label="close"
                onClick={() => onRemoveQuestion({ _id: question._id })}
              >
                <CancelIcon />
              </IconButton>
              {collapse ? (
                <IconButton
                  style={{ padding: '0.3rem' }}
                  aria-label="fold"
                  onClick={() => setCollapse(false)}
                >
                  <SwapVerticalCircleIcon />
                </IconButton>
              ) : (
                <IconButton
                  style={{ padding: '0.3rem' }}
                  aria-label="unfold"
                  onClick={() => setCollapse(true)}
                >
                  <RemoveCircleIcon />
                </IconButton>
              )}
              {question.type !== 'grid' && (
                <IconButton
                  style={{ padding: '0.5rem' }}
                  aria-label="add-question"
                  onClick={() =>
                    onAddAnswer({
                      aIndex: question.answers.length - 1,
                      defaultAnswer: {
                        name: 'Type the answer here...',
                        id: Random.id(),
                        type: 'text',
                      },
                    })
                  }
                >
                  <AddCircleIcon />
                </IconButton>
              )}
            </Box>
            <Box>{collapse ? question.prompt : ''}</Box>
            {/* <Box>
              <IconButton
                {...dragHandleProps}
                style={{ padding: '0.3rem' }}
                variant="outlined"
                color="default"
              >
                <DragHandleIcon />
              </IconButton>
            </Box>
            <Box></Box> */}
          </Box>
        }
        title={
          <IconButton
            {...dragHandleProps}
            style={{ padding: '0.3rem' }}
            variant="outlined"
            color="default"
          >
            <DragHandleIcon />
          </IconButton>
        }
        // title={<Box>{collapse ? question.prompt : ''}</Box>}
      />

      {!collapse && (
        <Box style={{ padding: '0.3prem' }}>
          <CardContent>{children}</CardContent>
          <CardActions style={{ padding: '1rem' }}>
            <Grid container alignItems="center" justifyContent="flex-end">
              <Grid>
                <IconButton
                  style={{ padding: '0.3rem' }}
                  aria-label="copy-question"
                  onClick={() => onCopyQuestion()}
                >
                  <FileCopyIcon />
                </IconButton>
                <IconButton
                  style={{ padding: '0.3rem' }}
                  aria-label="move-up"
                  onClick={() => onMoveUp()}
                  disabled={moveUpDisabled}
                >
                  <ExpandLessIcon />
                </IconButton>
                <IconButton
                  style={{ padding: '0.3rem' }}
                  aria-label="move-down"
                  onClick={() => onMoveDown()}
                  disabled={moveDownDisabled}
                >
                  <ExpandMoreIcon />
                </IconButton>
                <IconButton
                  style={{ padding: '0.3rem' }}
                  aria-label="unfold"
                  onClick={() => setShowJSON(!showJSON)}
                >
                  <VisibilityIcon />
                </IconButton>
              </Grid>

              {/* <Grid item>{createActions('moveUp', 'moveDown', 'copy', 'remove')}</Grid> */}
            </Grid>
          </CardActions>

          <Collapse in={showJSON} timeout="auto" unmountOnExit>
            <CardContent>
              <ReactJson src={question} {...jsonViewConfig} />
            </CardContent>
          </Collapse>
        </Box>
      )}
    </Card>
  )
}

DesktopFrame.propTypes = {
  /** A question type component */
  children: PropTypes.node.isRequired,
  /** whether frame or children has received focus or been clicked on */
  selected: PropTypes.bool,
  /** action handlers. eg. onSelect, onRemove, etc */
  actions: PropTypes.objectOf(PropTypes.func),
}

export { DesktopFrame }
