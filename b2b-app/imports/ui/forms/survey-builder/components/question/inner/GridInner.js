import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Button, Grid } from '@material-ui/core'
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

const filterList = [
  'name',
  'type',
  'image',
  'answers',
  'pid',
  'optional',
  'field',
  'width',
  'editable',
]

const GridInner = ({ pid, part, setPropertyByValue }) => {
  const { addColumn, removeColumn, addRow, removeRow } = usePartGrid(pid)
  const theme = useTheme()
  const selectedPart = useSelectedPartValue()
  const { isMobile } = useBuilder()

  const getStyle = (style, snapshot, lockAxis) => {
    if (!snapshot.isDragging) return style
    return {
      ...lockAxis('y', style),
      boxShadow: theme.shadows[3],
      background: theme.palette.background.paper,
    }
  }

  const showMobileActions = isMobile && selectedPart === pid

  return (
    <Fragment>
      <Grid container>
        <Grid item xs={12} md={6}>
          <DndDroppable pid={pid} listAtom={partAnswers(pid)} type={`${pid}_column`}>
            {(provided) => (
              <ul
                style={{ paddingLeft: 0 }}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {part?.answers?.[0]?.columns
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
                              disableRemove={part.answers[0]?.columns?.length === 1}
                              setPropertyByValue={setPropertyByValue}
                              pid={pid}
                              data={column}
                              dataIndex={columnIndex}
                              showMobileActions={showMobileActions}
                              part={part}
                              pid_index={`column_${pid}_${index}`}
                              options={gridColumnOptions}
                              type={'column'}
                              // helperText={answer.optional ?? undefined}
                            />
                            <Grid container spacing={1} alignItems="flex-start">
                              <Grid item xs={8}>
                                <OptionField
                                  part={part.answers[0]?.columns?.[columnIndex]}
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
          </DndDroppable>
        </Grid>

        <Grid item xs={12} md={6}>
          <DndDroppable pid={pid} listAtom={partAnswers(pid)} type={`${pid}_row`}>
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
          </DndDroppable>
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
  /** single instance part id */
  pid: PropTypes.string.isRequired,
  /** function gets called when updating atom's value based on the input path argument */
  setPropertyByValue: PropTypes.func,
  /** Object contains question/answers, each pid correspond to a specific part  */
  part: PropTypes.object.isRequired,
}

GridInner.defaultProps = {
  initialList: [''],
}

export { GridInner }
