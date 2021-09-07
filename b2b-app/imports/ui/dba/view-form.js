import { Meteor } from 'meteor/meteor'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useTracker } from 'meteor/react-meteor-data'
import { useParams } from 'react-router'

import {
  Typography,
  Button,
  Modal,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'

import Collections from '/imports/api/collections/schema'
import getCollection from '/imports/api/collections/collections.js'
import { getFieldType } from '/imports/api/collections/utils.js'

const StyledViewForm = styled.div`
  padding: 40px 20px;
  .selected-columns-wrapper {
    margin: 20px 0;
  }
  .column-wrapper {
    margin: 10px 0;
    display: flex;
    flex-direction: row;
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
  const { collection: collectionName, view: viewName } = useParams()
  console.log({ collectionName, viewName })

  const [showColumnsTable, setShowColumnsTable] = useState(false)
  const [columnsTobeAdded, setColumnsTobeAdded] = useState([])
  const [selectedColumns, setSelectedColumn] = useState([])

  const { collection } = useTracker(() => {
    console.log('run tracker', collectionName)
    Meteor.subscribe('name.collections', { name: collectionName })
    return {
      collection: Collections.findOne({ name: collectionName }),
    }
  }, [collectionName, viewName])

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
    () => collection?.views?.filter((item) => item.name === viewName),
    [collection]
  )

  useEffect(() => {
    if (theView) {
      setSelectedColumn(theView.columns)
    }
  }, [theView])

  // get collection

  if (!rawC) {
    return (
      <StyledViewForm>
        <Typography variant="h1">Opps! the collection was not found</Typography>
      </StyledViewForm>
    )
  }

  const renderColumns = () => {
    if (selectedColumns.length === 0) {
      return <div>Please select some columns</div>
    }
    return selectedColumns.map((col) => {
      return (
        <div key={col.name} className="column-wrapper">
          <div className="column-name">{col.name}</div>
          <div className="column-label">
            <TextField
              label="Column label"
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
          </div>
          <div className="column-filter">
            <TextField
              label="Column filter"
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
          </div>
        </div>
      )
    })
  }

  return (
    <StyledViewForm>
      <Typography variant="h1">
        {viewName ? `Edit view ${viewName}` : 'Add new view'}
      </Typography>
      <div className="selected-columns-wrapper">{renderColumns()}</div>
      <Button
        title="Add column"
        color="primary"
        startIcon={<AddIcon />}
        variant="contained"
        onClick={() => setShowColumnsTable(true)}
      >
        Add columns
      </Button>
      <Modal
        open={showColumnsTable}
        onClose={() => setShowColumnsTable(false)}
        aria-labelledby="add columns modal"
        aria-describedby="select columns to add"
        style={{ display: 'flex' }}
      >
        <StyledModalBox>
          <div>
            <Typography h2>Select columns tobe added</Typography>
            <FormGroup>
              {allColumns.map((col) => {
                if (selectedColumns.some((item) => item.name === col.name)) {
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
