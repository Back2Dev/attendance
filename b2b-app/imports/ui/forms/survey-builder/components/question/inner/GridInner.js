import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Grid,
  Box,
  IconButton,
  TextField,
  InputAdornment,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { useTheme } from '@material-ui/core/styles'
import {
  useSelectedPartValue,
  usePartGrid,
} from '/imports/ui/forms/survey-builder/recoil/hooks'
import { DndDraggable, DndDroppable } from '/imports/ui/forms/survey-builder/context/dnd'
import { useBuilder } from '/imports/ui/forms/survey-builder/context'
import { partAnswers } from '/imports/ui/forms/survey-builder/recoil/atoms'
import { gridColumnOptions } from '$sb/components/question/field/options'

import { OptionField, GridField } from '$sb/components/question/field'

import { Droppable, Draggable } from 'react-beautiful-dnd'
import SimpleSchema from 'simpl-schema'
import { makeStyles } from '@material-ui/core/styles'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator'
import { OptionList } from '$sb/components/question/field/option-list'

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

const gridSchema = new SimpleSchema({
  answers: Array,
  'answers.$': Object,
  'answers.$.id': String,
  'answers.$.name': String,
  'answers.$.type': String,
  'answers.$.row': { type: Array, defaultValue: [{ field: 'New row..' }] },
  'answers.$.row.$.name': String,
  'answers.$.column': { type: Array, defaultValue: [{ field: 'New column..' }] },
  'answers.$.column.$.field': String,
})
const GridInner = ({ question, onAnswerChange }) => {
  const cleanAnswer = gridSchema.clean(question).answers
  // const { addColumn, removeColumn, addRow, removeRow } = usePartGrid(pid)
  // const theme = useTheme()
  // const selectedPart = useSelectedPartValue()
  // const { isMobile } = useBuilder()

  // const getStyle = (style, snapshot, lockAxis) => {
  //   if (!snapshot.isDragging) return style
  //   return {
  //     ...lockAxis('y', style),
  //     boxShadow: theme.shadows[3],
  //     background: theme.palette.background.paper,
  //   }
  // }

  // const showMobileActions = isMobile && selectedPart === pid

  return (
    <Fragment>
      <Grid container>
        <Grid item xs={12} md={6}>
          <Droppable
            droppableId={`question-col-${question.id}`}
            type={`question-col-${question.id}`}
          >
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {cleanAnswer?.map((answer, aIndex) => {
                  return (
                    <Draggable draggableId={answer.id} key={answer.id} index={aIndex}>
                      {(provided, snapshot) => (
                        <div
                          key={aIndex}
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                        >
                          <ColumnRow
                            dragHandleProps={provided.dragHandleProps}
                            answer={answer}
                            onAnswerChange={onAnswerChange}
                            aIndex={aIndex}
                            type={'column'}
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
          {/* <DndDroppable pid={pid} listAtom={partAnswers(pid)} type={`${pid}_column`}>
            {(provided) => (
              <ul
                style={{ paddingLeft: 0 }}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {question?.answers?.[0]?.columns
                  ?.filter((c) => c.field !== 'name')
                  ?.map((column, index) => {
                    const columnIndex = index + 1
                    return (
                      <DndDraggable
                        pid={pid}
                        itemId={`column_${pid}_${columnIndex}`}
                        index={columnIndex}
                        key={`column_${pid}_${columnIndex}`}
                      >
                        {(provided, snapshot, lockAxis) => (
                          <div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getStyle(
                              provided.draggableProps.style,
                              snapshot,
                              lockAxis
                            )}
                            ref={provided.innerRef}
                          >
                            <GridField
                              onRemove={() => removeColumn(columnIndex)}
                              onAdd={() => addColumn(columnIndex)}
                              disableRemove={question.answers[0]?.columns?.length === 1}
                              setPropertyByValue={setPropertyByValue}
                              pid={pid}
                              data={column}
                              dataIndex={columnIndex}
                              showMobileActions={showMobileActions}
                              question={question}
                              pid_index={`column_${pid}_${index}`}
                              options={gridColumnOptions}
                              type={'column'}
                              // helperText={answer.optional ?? undefined}
                            />
                            <Grid container spacing={1} alignItems="flex-start">
                              <Grid item xs={8}>
                                <OptionField
                                  question={question.answers[0]?.columns?.[columnIndex]}
                                  filterList={[...filterList]}
                                  setPropertyByValue={setPropertyByValue}
                                  pid_index={`column_${pid}_${index}`}
                                  showMobileActions={showMobileActions}
                                  pid={pid}
                                  path={`answers[0].columns[${columnIndex}]`}
                                />
                              </Grid>
                              <Grid item xs={1}></Grid>
                            </Grid>
                          </div>
                        )}
                      </DndDraggable>
                    )
                  })}
                {provided.placeholder}
              </ul>
            )}
          </DndDroppable> */}
        </Grid>

        <Grid item xs={12} md={6}>
          <Droppable
            droppableId={`question-row-${question.id}`}
            type={`question-row-${question.id}`}
          >
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {cleanAnswer?.map((answer, aIndex) => {
                  return (
                    <Draggable draggableId={answer.id} key={answer.id} index={aIndex}>
                      {(provided, snapshot) => (
                        <div
                          key={aIndex}
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                        >
                          <ColumnRow
                            dragHandleProps={provided.dragHandleProps}
                            answer={answer}
                            onAnswerChange={onAnswerChange}
                            aIndex={aIndex}
                            type={'row'}
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
          {/* <DndDroppable pid={pid} listAtom={partAnswers(pid)} type={`${pid}_row`}>
            {(provided) => (
              <ul
                style={{ paddingLeft: 0 }}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {part?.answers?.[0]?.rows?.map((row, rowIndex) => {
                  return (
                    <DndDraggable
                      pid={pid}
                      itemId={`row_${pid}_${rowIndex}`}
                      index={rowIndex}
                      key={`row_${pid}_${rowIndex}`}
                    >
                      {(provided, snapshot, lockAxis) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getStyle(
                            provided.draggableProps.style,
                            snapshot,
                            lockAxis
                          )}
                          ref={provided.innerRef}
                        >
                          <GridField
                            onRemove={() => removeRow(rowIndex)}
                            onAdd={() => addRow(rowIndex)}
                            disableRemove={part.answers[0]?.rows?.length === 1}
                            setPropertyByValue={setPropertyByValue}
                            pid={pid}
                            data={row}
                            dataIndex={rowIndex}
                            showMobileActions={showMobileActions}
                            part={part}
                            pid_index={`row_${pid}_${rowIndex}`}
                            options={[]}
                            type={'row'}
                            // helperText={answer.optional ?? undefined}
                          />
                          <Grid container spacing={1} alignItems="flex-start">
                            <Grid item xs={8}>
                              <OptionField
                                part={part.answers[0]?.rows[rowIndex]}
                                filterList={[...filterList]}
                                setPropertyByValue={setPropertyByValue}
                                pid_index={`row_${pid}_${rowIndex}`}
                                showMobileActions={showMobileActions}
                                pid={pid}
                                path={`answers[0].rows[${rowIndex}]`}
                              />
                            </Grid>
                            <Grid item xs={1}></Grid>
                          </Grid>
                        </div>
                      )}
                    </DndDraggable>
                  )
                })}
                {provided.placeholder}
              </ul>
            )}
          </DndDroppable> */}
        </Grid>
      </Grid>

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
    </Fragment>
  )
}

GridInner.propTypes = {
  question: PropTypes.object.isRequired,
  onAnswerChange: PropTypes.func,
}

export { GridInner }

const ColumnRow = ({ answer, onAnswerChange, aIndex, dragHandleProps, type }) => {
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

  const onColRowChange = ({ aIndex, type, value }) => {
    onAnswerChange({ aIndex, key: type, value })
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
        <Grid item xs={12} md={9} lg={10}>
          <TextField
            fullWidth
            onChange={({ target: { value } }) =>
              onAnswerChange({
                aIndex,
                key: `${type}_${type === 'row' ? 'name' : 'field'}`,
                value,
              })
            }
            value={answer.name}
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
                  {/* <UploadImage {...props} /> */}
                  {/* {specify} */}
                  {/* {createActions(...actions)} */}
                </InputAdornment>
              ),
              startAdornment: (
                <InputAdornment position="start">
                  <CheckBoxOutlineBlankIcon />
                </InputAdornment>
              ),
            }}
            label="Answer"
            placeholder="Type some anwer..."
          />
        </Grid>
        {/* <Grid item xs={12} md={3} lg={2}>
          <TextField
            fullWidth
            select
            value={answer.type}
            onChange={({ target: { value } }) =>
              onAnswerChange({
                aIndex,
                key: 'type',
                value,
              })
            }
            label="Answer Type"
          >
            {subType.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </TextField>
        </Grid> */}
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
                  onChange={({ target: { value } }) => onAnswerChange({ key, value })}
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
