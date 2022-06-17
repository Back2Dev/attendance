import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { useTheme } from '@material-ui/core/styles'

import {
  useUndefinedAnswers,
  useUndefinedQuestion,
  useSelectedPartValue,
} from '/imports/ui/forms/survey-builder/recoil/hooks'
import { undefinedAnswers } from '/imports/ui/forms/survey-builder/recoil/atoms'
import { DndDraggable, DndDroppable } from '/imports/ui/forms/survey-builder/context/dnd'
import { useBuilder } from '/imports/ui/forms/survey-builder/context'
// import { Question } from '/imports/ui/forms/survey-builder/components/question'
import InputAdornment from '@material-ui/core/InputAdornment'
import { makeStyles } from '@material-ui/core/styles'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import { SingleInner } from '../single/inner'
import { MultipleInner } from '../multiple/inner'
import { UploadInner } from '../upload/inner'
import { ImageInner } from '../image/inner'
import { TextInner } from '../text/inner'
import { SectionInner } from '../section/inner'
import { useRecoilCallback, useRecoilState } from 'recoil'
import {
  editInspectorState,
  getInspectorPart,
} from '/imports/ui/forms/survey-builder/recoil/atoms'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Grid from '@material-ui/core/Grid'
import { Item } from '$sb/components/types/single/item'
import { questionOptions } from '$sb/components/types/undefined/options'
import { Question } from './question'

const options = [
  { label: 'Single', value: 'single', component: SingleInner },
  { label: 'Multiple', value: 'multiple', component: MultipleInner },
  { label: 'Upload', value: 'upload', component: UploadInner },
  // { label: 'Image', value: 'image', component: ImageInner },
  { label: 'Text', value: 'text', component: TextInner },
  { label: 'Section', value: 'section', component: SectionInner },
]

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  gridRoot: {
    flexGrow: 1,
    marginTop: '-1rem',
    marginBottom: '1rem',
  },
  answerField: {
    '&:hover .MuiInputAdornment-root': {
      display: 'flex',
    },
  },
  InputAdornment: {
    display: 'none',
  },
}))

/** Undefined Choice question */
const UndefinedInner = ({ pid, type }) => {
  const classes = useStyles()
  const { all, add, update, remove } = useUndefinedAnswers(pid)
  // const [question, setQuestion] = useUndefinedQuestion(pid)
  // const theme = useTheme()
  const selectedPart = useSelectedPartValue()
  const { isMobile } = useBuilder()
  // const [isIdChecked, setIsIdChecked] = useState({})
  const [qType, setQType] = useState(type ?? 'single')

  const setTypeProperty = useRecoilCallback(({ set }) => (path, type) => {
    set(editInspectorState({ pid, path }), () => {
      return type
    })
  })

  const [part] = useRecoilState(getInspectorPart({ pid }))

  const setPropertyByValue = useRecoilCallback(
    ({ set }) =>
      ({ path, value = undefined, pid }) => {
        set(editInspectorState({ pid, path }), (property) => {
          if (value) {
            return value
          }
          if (property === undefined) {
            return path.includes('optional') ? true : ''
          } else {
            return undefined
          }
        })
      }
  )

  // const getStyle = (style, snapshot, lockAxis) => {
  //   if (!snapshot.isDragging) return style
  //   return {
  //     ...lockAxis('y', style),
  //     boxShadow: theme.shadows[3],
  //     background: theme.palette.background.paper,
  //   }
  // }

  const showMobileActions = isMobile && selectedPart === pid

  const handleChange = ({ target: { value } }) => {
    setQType(value)
    setTypeProperty('type', value)
  }

  return (
    <>
      <div className={classes.gridRoot}>
        <Grid container spacing={1} alignItems="flex-start">
          <Grid item xs={8}>
            <Question
              label={qType === 'section' ? 'Section Title' : 'Question'}
              pid={pid}
              part={part}
              setPropertyByValue={setPropertyByValue}
            />
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={2}>
            <TextField
              fullWidth
              margin="normal"
              select
              value={qType}
              onChange={handleChange}
              label="Type"
            >
              {options.map(({ value, label }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </div>

      {React.createElement(
        (options.find(({ value }) => value === qType) || options[0]).component,
        {
          pid,
          setPropertyByValue,
          part,
        }
      )}

      {showMobileActions && (
        <Button
          variant="outlined"
          color="default"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => add()}
        >
          New item
        </Button>
      )}
    </>
  )
}

UndefinedInner.propTypes = {
  /** undefined instance part id */
  pid: PropTypes.string.isRequired,
  /** function gets called when any choice gets updated */
  onChange: PropTypes.func,
}

UndefinedInner.defaultProps = {
  initialList: [''],
}

export { UndefinedInner }

import MoreVertIcon from '@material-ui/icons/MoreVert'

import Menu from '@material-ui/core/Menu'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import { get } from 'lodash'
import { IconButton, Hidden } from '@material-ui/core'

const QuestionOptions = [
  { label: 'Value', value: 'val' },
  { label: 'Score', value: 'score' },
  { label: 'Specify', value: 'specify' },
]

export default function MoreList({ part, handleToggle }) {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <IconButton aria-label="add" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <List className={classes.list}>
          {QuestionOptions.map((item) => {
            const labelId = item.label

            const checked = get(part, item.value)
            return (
              <ListItem
                key={item.value}
                role={undefined}
                dense
                button
                onClick={handleToggle(item.value)}
              >
                <ListItemIcon className={classes.listIcon}>
                  <Checkbox
                    edge="start"
                    checked={Boolean(checked || checked === '')}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={item.label} />
              </ListItem>
            )
          })}
        </List>
      </Menu>
    </div>
  )
}
