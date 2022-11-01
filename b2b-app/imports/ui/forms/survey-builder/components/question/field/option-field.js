import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  MenuItem,
  Grid,
  TextField,
  InputAdornment,
  Box,
  IconButton,
} from '@material-ui/core'
import { textOptions } from '$sb/components/question/field/options'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { OptionList } from '$sb/components/question/field/option-list'
import SimpleSchema from 'simpl-schema'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator'
import { makeStyles } from '@material-ui/core/styles'
import { slugify } from '$sb/utils'
import { RemoveAnsBtn } from '$sb/components/panels/canvas/canvas'
import { Fragment } from 'react'

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem',
    '& .drag-icon': {
      display: 'none',
    },
    '&:hover .drag-icon': {
      display: 'inline',
      position: 'absolute',
      left: '-15px',
      bottom: '3px',
    },
  },
}))

const OptionField = ({ showField, answer, onQuestionChange, question, aIndex }) =>
  Object.entries(showField)
    .filter(([_, show]) => show)

    .map(([key]) => {
      const fieldType = typeof answer[key]

      switch (fieldType) {
        case 'boolean':
          return (
            <Grid item xs={12} md={9} lg={10} key={key}>
              <TextField
                fullWidth
                size="small"
                margin="dense"
                select
                value={answer[key] || false}
                onChange={({ target: { value } }) => {
                  question.answers[aIndex][key] = Boolean(value)
                  onQuestionChange({ question })
                }}
                label={key}
                variant="filled"
              >
                <MenuItem key={'true'} value={true}>
                  True
                </MenuItem>
                <MenuItem key={'false'} value={false}>
                  False
                </MenuItem>
              </TextField>
            </Grid>
          )
        default:
          return (
            <Grid item xs={12} md={9} lg={10} key={key}>
              <TextField
                fullWidth
                size="small"
                margin="dense"
                type={fieldType}
                value={answer[key] || ''}
                onChange={({ target: { value } }) => {
                  if (key === 'optional') {
                    question.answers[aIndex].optional = !Boolean(
                      question.answers[aIndex].optional
                    )
                  } else {
                    question.answers[aIndex][key] = value
                  }

                  onQuestionChange({ question })
                }}
                label={textOptions[key]}
                variant="filled"
              />
            </Grid>
          )
      }
    })

export default OptionField
