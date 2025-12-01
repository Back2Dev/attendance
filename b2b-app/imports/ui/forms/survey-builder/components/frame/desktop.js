import React, { useState } from 'react'
import PropTypes from 'prop-types'
import debug from 'debug'
import makeStyles from '@mui/styles/makeStyles';
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
} from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import SwapVerticalCircleIcon from '@mui/icons-material/SwapVerticalCircle'
import { useEffect } from 'react'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import ReactJson from 'react-json-view'
import { Random } from 'meteor/random'
import AddCircleIcon from '@mui/icons-material/AddCircle'

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
                size="large">
                <CancelIcon />
              </IconButton>
              {collapse ? (
                <IconButton
                  style={{ padding: '0.3rem' }}
                  aria-label="fold"
                  onClick={() => setCollapse(false)}
                  size="large">
                  <SwapVerticalCircleIcon />
                </IconButton>
              ) : (
                <IconButton
                  style={{ padding: '0.3rem' }}
                  aria-label="unfold"
                  onClick={() => setCollapse(true)}
                  size="large">
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
                  size="large">
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
            size="large">
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
                  size="large">
                  <FileCopyIcon />
                </IconButton>
                <IconButton
                  style={{ padding: '0.3rem' }}
                  aria-label="move-up"
                  onClick={() => onMoveUp()}
                  disabled={moveUpDisabled}
                  size="large">
                  <ExpandLessIcon />
                </IconButton>
                <IconButton
                  style={{ padding: '0.3rem' }}
                  aria-label="move-down"
                  onClick={() => onMoveDown()}
                  disabled={moveDownDisabled}
                  size="large">
                  <ExpandMoreIcon />
                </IconButton>
                <IconButton
                  style={{ padding: '0.3rem' }}
                  aria-label="unfold"
                  onClick={() => setShowJSON(!showJSON)}
                  size="large">
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
  );
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
