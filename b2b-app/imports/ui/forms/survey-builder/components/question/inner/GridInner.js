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
import { Random } from 'meteor/random'
import { OptionField, GridField } from '$sb/components/question/field'
import AddCircleIcon from '@material-ui/icons/AddCircle'
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

const gridSchema = new SimpleSchema(
  {
    rows: { type: Array, defaultValue: [{ name: 'New row', id: 'row' }] },
    'rows.$': Object,
    'rows.$.id': String,
    'rows.$.name': String,
    'rows.$.value': String,

    columns: { type: Array, defaultValue: [{ field: 'New column', id: 'column' }] },
    'columns.$': Object,
    'columns.$.id': String,
    'columns.$.field': String,
    'columns.$.value': String,
  },
  {
    clean: {
      trimStrings: false,
    },
  }
)

const GridInner = ({ question, onGridChange, onAddGrid }) => {
  // const cleanRows = gridSchema.clean(question).rows
  // const cleanColumns = gridSchema.clean(question).columns
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
            droppableId={`grid-columns-${question.id}`}
            type={`grid-columns-${question.id}`}
          >
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {question.columns?.map((answer, aIndex) => {
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
                            onGridChange={onGridChange}
                            aIndex={aIndex}
                            onAddGrid={onAddGrid}
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
            droppableId={`grid-rows-${question.id}`}
            type={`grid-rows-${question.id}`}
          >
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {question.rows?.map((answer, aIndex) => {
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
                            onGridChange={onGridChange}
                            onAddGrid={onAddGrid}
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
  onGridChange: PropTypes.func,
}

export { GridInner }

const ColumnRow = ({
  answer,
  onGridChange,
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
            onChange={({ target: { value } }) =>
              onGridChange({
                aIndex,
                key,
                value,
                type,
              })
            }
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
                    onGridChange({ aIndex, key, value, type })
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
