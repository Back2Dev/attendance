import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { Grid, Box, IconButton, TextField, InputAdornment } from '@material-ui/core'
import { gridColumnOptions } from '$sb/components/question/field/options'
import { Random } from 'meteor/random'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import SimpleSchema from 'simpl-schema'
import { makeStyles } from '@material-ui/core/styles'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator'
import { OptionList } from '$sb/components/question/field/option-list'
import { slugify } from '$sb/utils'
import { RemoveAnsBtn } from '$sb/components/panels/canvas/canvas'

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem',
    marginTop: '1.5rem',
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

const GridInner = ({ question, ...props }) => {
  return (
    <Fragment>
      <Grid container>
        <Grid item xs={12} md={6}>
          <Droppable
            droppableId={`grid-columns-${question._id}`}
            type={`grid-columns-${question._id}`}
          >
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {question.columns?.map((answer, aIndex) => {
                  return (
                    <Draggable draggableId={answer._id} key={answer._id} index={aIndex}>
                      {(provided, snapshot) => (
                        <div
                          key={aIndex}
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                        >
                          <ColumnRow
                            dragHandleProps={provided.dragHandleProps}
                            answer={answer}
                            question={question}
                            aIndex={aIndex}
                            {...props}
                            type={'columns'}
                          />
                        </div>
                      )}
                    </Draggable>
                  )
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Grid>

        <Grid item xs={12} md={6}>
          <Droppable
            droppableId={`grid-rows-${question._id}`}
            type={`grid-rows-${question._id}`}
          >
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {question.rows?.map((answer, aIndex) => {
                  return (
                    <Draggable draggableId={answer._id} key={answer._id} index={aIndex}>
                      {(provided, snapshot) => (
                        <div
                          key={aIndex}
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                        >
                          <ColumnRow
                            dragHandleProps={provided.dragHandleProps}
                            answer={answer}
                            question={question}
                            {...props}
                            aIndex={aIndex}
                            type={'rows'}
                          />
                        </div>
                      )}
                    </Draggable>
                  )
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Grid>
      </Grid>

      {/* {showMobileActions && (
        <Button
          variant="outlined"
          color="default"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => add()}
        >
          New item
        </Button>
      )} */}
    </Fragment>
  )
}

GridInner.propTypes = {
  question: PropTypes.object.isRequired,
  onQuestionChange: PropTypes.func,
}

export { GridInner }

const ColumnRow = ({
  answer,
  question,
  onQuestionChange,
  onRemoveAnswer,
  aIndex,
  dragHandleProps,
  type = 'rows',
  onAddGrid,
}) => {
  const key = type === 'rows' ? 'name' : 'field'
  const classes = useStyles()
  const [showField, setShowField] = useState(() =>
    Object.keys(gridColumnOptions).reduce((acc, cur) => {
      return {
        ...acc,
        [cur]: false,
      }
    }, {})
  )

  const onToggle = (key) => {
    setShowField({ ...showField, [key]: !showField[key] })
  }

  return (
    <Box className={classes.root}>
      <Grid container spacing={3} alignItems="flex-end">
        <IconButton
          {...dragHandleProps}
          className="drag-icon"
          variant="outlined"
          color="default"
        >
          <DragIndicatorIcon />
        </IconButton>
        <Grid item xs={12} md={12} lg={12}>
          <TextField
            fullWidth
            onChange={({ target: { value } }) => {
              question[type][aIndex][key] = value
              if (key === 'field' || key === 'name') {
                question[type][aIndex].id = slugify(value)
              }
              onQuestionChange({
                question,
              })
            }}
            value={answer[key]}
            InputProps={{
              // classes: {
              //   underline: classes.hideUnderline,
              // },
              endAdornment: (
                <InputAdornment
                  // classes={{ root: classes.InputAdornment }}
                  position="end"
                >
                  <OptionList
                    options={gridColumnOptions}
                    onToggle={onToggle}
                    showField={showField}
                  />

                  <IconButton
                    style={{ padding: '0.5rem' }}
                    aria-label="add-grid"
                    onClick={() =>
                      onAddGrid({
                        aIndex,
                        defaultGrid: {
                          [key]: 'Type the col/row here...',
                          id: Random.id(),
                          editable: true,
                          width: 200,
                        },
                        type,
                      })
                    }
                  >
                    <AddCircleIcon />
                  </IconButton>
                  <RemoveAnsBtn
                    onRemoveAnswer={() => onRemoveAnswer({ _id: answer._id, type })}
                  />
                  {/* <UploadImage {...props} /> */}
                  {/* {specify} */}
                  {/* {createActions(...actions)} */}
                </InputAdornment>
              ),
            }}
            label={type.toUpperCase()}
            placeholder="Type some row/col..."
          />
        </Grid>
      </Grid>
      <Grid container spacing={1} alignItems="flex-start">
        <Grid item xs={8}>
          {Object.entries(showField)
            .filter(([_, show]) => show)
            .map(([key]) => {
              return (
                <TextField
                  key={key}
                  fullWidth
                  value={answer[key] || ''}
                  onChange={({ target: { value } }) =>
                    onQuestionChange({ aIndex, key, value, type })
                  }
                  label={gridColumnOptions[key]}
                />
              )
            })}
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={2}>
          {/* {answer.image && (
                            <FieldImage
                              src={answer.image}
                              onDeleteImage={() =>
                                setPropertyByValue({
                                  pid,
                                  path: `answers[${aIndex}].image`,
                                })
                              }
                            />
                          )} */}
        </Grid>
      </Grid>
    </Box>
  )
}
