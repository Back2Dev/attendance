import { Meteor } from 'meteor/meteor'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useTracker } from 'meteor/react-meteor-data'
import { useParams } from 'react-router'
import DeleteIcon from '@material-ui/icons/Delete'
import { useHistory } from 'react-router'

import {
  Typography,
  Button,
  IconButton,
  Modal,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  RadioGroup,
  Radio,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'

import { showError } from '/imports/ui/utils/toast-alerts.js'

import Collections from '/imports/api/collections/schema'
import getCollection from '/imports/api/collections/collections.js'
import { getFieldType } from '/imports/api/collections/utils.js'

const StyledViewForm = styled.div`
  padding: 40px 20px;
  .view-configs {
    margin: 20px 0;
  }
  .selected-columns-wrapper {
    margin: 20px 0;
  }
  .column-wrapper {
    margin: 10px 0;
  }
  .actions {
    display: flex;
    flex-directoin: row;
    justify-content: space-between;
    flex-wrap: wrap;
    .sortByColumn {
      display: flex;
      flex-direction: row;
      align-items: center;
      .select-column {
        min-width: 200px;
        margin-right: 10px;
      }
      .select-direction {
      }
    }
  }
  .primary-actions {
    margin: 40px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
`

const StyledModalBox = styled.div`
  min-width: 300px;
  min-height: 200px;
  max-width: 80vw;
  max-height: 80vh;
  overflow-y: scroll;
  background: #ffffff;
  align-self: center;
  justify-self: center;
  margin: 0 auto;
  padding: 40px 20px;
`

function ViewForm() {
  const { collection: collectionName, view: viewSlug } = useParams()
  console.log({ collectionName, viewSlug })
  const history = useHistory()

  const [newViewName, setNewViewName] = useState('')
  const [readOnly, setReadOnly] = useState(false)
  const [showColumnsTable, setShowColumnsTable] = useState(false)
  const [columnsTobeAdded, setColumnsTobeAdded] = useState([])
  const [selectedColumns, setSelectedColumn] = useState([])
  const [sortOrder, setSortOrder] = useState({
    column: '',
    order: 'asc',
  })

  const { collection } = useTracker(() => {
    console.log('run tracker', collectionName)
    Meteor.subscribe('name.collections', { name: collectionName })
    return {
      collection: Collections.findOne({ name: collectionName }),
    }
  }, [collectionName, viewSlug])

  const { rawC, allColumns } = React.useMemo(() => {
    const rawC = getCollection(collectionName)
    const firstLevelFields = rawC?.schema._firstLevelSchemaKeys.map((fieldName) => {
      return {
        name: fieldName,
        label: rawC.schema._schema[fieldName].label,
        type: getFieldType({ fieldSchema: rawC.schema._schema[fieldName] }),
      }
    })
    return { rawC, allColumns: firstLevelFields }
  }, [collectionName])

  const theView = React.useMemo(
    () => collection?.views?.find((item) => item.slug === viewSlug),
    [collection, viewSlug]
  )

  useEffect(() => {
    if (theView) {
      setSelectedColumn(theView.columns || [])
      setNewViewName(theView.name || '')
      setReadOnly(theView.readOnly === true)
      if (theView.sortOrder) {
        setSortOrder(theView.sortOrder)
      }
    }
  }, [theView])

  const handleSubmit = () => {
    console.log('submit')
    Meteor.call(
      'collections.updateView',
      {
        collectionName,
        viewSlug,
        viewName: newViewName,
        readOnly,
        columns: selectedColumns,
        sortOrder,
      },
      (error, result) => {
        console.log(error, result)

        if (error) {
          showError(error.message)
          return
        }
        if (result) {
          if (result.status === 'failed') {
            showError(result.message)
            return
          }

          // go to new view
          if (result.view?.slug) {
            history.push(`/dba/${collectionName}/${result.view?.slug}`)
            return
          }
        }

        history.push(`/dba/${collectionName}`)
      }
    )
  }

  if (!rawC) {
    return (
      <StyledViewForm>
        <Typography variant="h1">Opps! the collection was not found</Typography>
      </StyledViewForm>
    )
  }

  const renderColumns = () => {
    if (!selectedColumns || selectedColumns.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={10}>Please select some columns</TableCell>
        </TableRow>
      )
    }
    return selectedColumns.map((col) => {
      return (
        <TableRow key={col.name} className="column-wrapper">
          <TableCell className="column-name">{col.name}</TableCell>
          <TableCell className="column-label">
            <TextField
              value={col.label}
              onChange={(event) => {
                setSelectedColumn(
                  selectedColumns.map((item) => {
                    if (item.name === col.name) {
                      return {
                        ...item,
                        label: event.target.value,
                      }
                    }
                    return item
                  })
                )
              }}
            />
          </TableCell>
          <TableCell className="column-filter">
            <TextField
              value={col.filter}
              onChange={(event) => {
                setSelectedColumn(
                  selectedColumns.map((item) => {
                    if (item.name === col.name) {
                      return {
                        ...item,
                        filter: event.target.value,
                      }
                    }
                    return item
                  })
                )
              }}
            />
          </TableCell>
          <TableCell>
            <FormControlLabel
              key={col.name}
              control={
                <Checkbox
                  checked={col.readOnly === true}
                  onChange={() => {
                    setSelectedColumn(
                      selectedColumns.map((item) => {
                        if (item.name === col.name) {
                          return {
                            ...item,
                            readOnly: !col.readOnly,
                          }
                        }
                        return item
                      })
                    )
                  }}
                  color="primary"
                />
              }
              label="Read only"
            />
          </TableCell>
          <TableCell>
            <IconButton
              onClick={() => {
                setSelectedColumn(
                  selectedColumns.filter((item) => item.name !== col.name)
                )
              }}
            >
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      )
    })
  }

  const renderSortByColumn = () => {
    if (!selectedColumns?.length) {
      return null
    }
    return (
      <>
        <FormControl className="select-column">
          <InputLabel id="sort-by-column-select-label">Sort by column</InputLabel>
          <Select
            labelId="sort-by-column-select-label"
            value={sortOrder?.column || ''}
            onChange={(event) => {
              setSortOrder({ ...sortOrder, column: event.target.value })
            }}
          >
            <MenuItem value="">No column selected</MenuItem>
            {selectedColumns?.length &&
              selectedColumns.map((col) => {
                return (
                  <MenuItem key={col.name} value={col.name}>
                    {col.label || col.name}
                  </MenuItem>
                )
              })}
          </Select>
        </FormControl>
        <RadioGroup
          row
          aria-label="sortby-column-direction"
          name="position"
          className="select-direction"
          defaultValue="right"
          onChange={(event) => {
            setSortOrder({ ...sortOrder, order: event.target.value })
          }}
          value={sortOrder.order}
        >
          <FormControlLabel value="asc" control={<Radio color="primary" />} label="ASC" />
          <FormControlLabel
            value="desc"
            control={<Radio color="primary" />}
            label="DESC"
          />
        </RadioGroup>
      </>
    )
  }

  console.log({ theView })
  return (
    <StyledViewForm>
      <Typography variant="h1">
        {theView ? `Edit view ${theView.name}` : 'Add new view'}
      </Typography>
      <div className="view-configs">
        <TextField
          label="View name"
          value={newViewName}
          onChange={(event) => setNewViewName(event.target.value)}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={readOnly}
              onChange={() => {
                setReadOnly(!readOnly)
              }}
              color="primary"
            />
          }
          label="Read only"
        />
      </div>
      <Table className="selected-columns-wrapper">
        <TableHead>
          <TableRow>
            <TableCell>Field name</TableCell>
            <TableCell>Column Label</TableCell>
            <TableCell>Column filter</TableCell>
            <TableCell>Read only</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{renderColumns()}</TableBody>
      </Table>
      <div className="actions">
        <div className="sortByColumn">{renderSortByColumn()}</div>
        <Button
          title="Add column"
          color="primary"
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => setShowColumnsTable(true)}
        >
          Add columns
        </Button>
      </div>
      <div className="primary-actions">
        <Button
          variant="contained"
          onClick={() => {
            history.push(`/dba/${collectionName}${viewSlug ? `/${viewSlug}` : ''}`)
          }}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={handleSubmit}
          disabled={!newViewName || selectedColumns.length === 0}
        >
          Submit
        </Button>
      </div>
      <Modal
        open={showColumnsTable}
        onClose={() => setShowColumnsTable(false)}
        aria-labelledby="add columns modal"
        aria-describedby="select columns to add"
        style={{ display: 'flex' }}
      >
        <StyledModalBox>
          <div>
            <Typography variant="h2">Select columns tobe added</Typography>
            <FormGroup>
              {allColumns.map((col) => {
                if (selectedColumns?.some((item) => item.name === col.name)) {
                  return null
                }
                const checked = columnsTobeAdded.some((item) => item.name === col.name)
                return (
                  <FormControlLabel
                    key={col.name}
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={() => {
                          if (checked) {
                            setColumnsTobeAdded(
                              columnsTobeAdded.filter((item) => item.name !== col.name)
                            )
                          } else {
                            setColumnsTobeAdded([
                              ...columnsTobeAdded,
                              {
                                name: col.name,
                                label: col.label,
                                readOnly: false,
                              },
                            ])
                          }
                        }}
                        name={col.name}
                        color="primary"
                      />
                    }
                    label={col.label || col.name}
                  />
                )
              })}
            </FormGroup>
            <div>
              <Button
                disabled={columnsTobeAdded.length === 0}
                variant="contained"
                color="primary"
                onClick={() => {
                  setSelectedColumn([...selectedColumns, ...columnsTobeAdded])
                  setColumnsTobeAdded([])
                  setShowColumnsTable(false)
                }}
              >
                Add selected columns
              </Button>
            </div>
          </div>
        </StyledModalBox>
      </Modal>
    </StyledViewForm>
  )
}

export default ViewForm
