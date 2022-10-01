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
} from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import CancelIcon from '@material-ui/icons/Cancel'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'
import SwapVerticalCircleIcon from '@material-ui/icons/SwapVerticalCircle'
import { useEffect } from 'react'

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
      backgroundColor: 'whte',
    },
    gridPadding: {
      padding: '0 1rem',
    },
  }))

const DesktopFrame = ({
  question,
  children,
  onRemoveQuestion,
  sectionCollapse,
  ...props
}) => {
  const classes = useStyles((selected = false), (color = 'black'))()
  const [collapse, setCollapse] = useState(sectionCollapse)

  useEffect(() => {
    setCollapse(sectionCollapse)
  }, [sectionCollapse])

  return (
    <Card>
      <CardHeader
        style={{ background: 'lightgray', padding: '0.3rem' }}
        avatar={
          <Box>
            <IconButton
              style={{ padding: '0.3rem' }}
              aria-label="close"
              onClick={() => onRemoveQuestion()}
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
          </Box>
        }
        // action={
        //   <IconButton style={{ padding: '0.3rem' }} aria-label="settings">
        //     <MoreVertIcon />
        //   </IconButton>
        // }
        title={<Box>{collapse ? question.prompt : ''}</Box>}
      />
      {!collapse && (
        <Box style={{ padding: '0.3prem' }}>
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
        </Box>
      )}
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
