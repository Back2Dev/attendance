import React, { useContext } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router'

import { FormControl, MenuItem, Select, IconButton } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'

import { CollectionContext } from '../context'

const StyledViewsSelector = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  .form-control {
    min-width: 100px;
  }
  .btn {
    margin-left: 10px;
  }
`

function ViewsSelector() {
  const { theCollection, theView, availableViews } = useContext(CollectionContext)
  console.log({ theView, availableViews })

  const history = useHistory()

  const handleChange = (event) => {
    console.log(event.target.value)
  }

  const renderMenuItems = () => {
    if (!availableViews?.length) {
      return <MenuItem value="">No View available</MenuItem>
    }
    return availableViews.map((item) => (
      <MenuItem value={item.slug} key={item.slug}>
        {item.name}
      </MenuItem>
    ))
  }

  if (!theCollection) {
    return null
  }

  return (
    <StyledViewsSelector>
      <FormControl className="form-control">
        <Select value={theView?.name || ''} onChange={handleChange}>
          {renderMenuItems()}
        </Select>
      </FormControl>
      {theView && (
        <IconButton
          color="secondary"
          aria-label="edit view"
          className="btn btn-edit"
          component="span"
        >
          <EditIcon />
        </IconButton>
      )}
      <IconButton
        color="primary"
        aria-label="add view"
        className="btn btn-add"
        component="span"
        onClick={() => history.push(`/dba/${theCollection._name}/add-view`)}
      >
        <AddIcon />
      </IconButton>
    </StyledViewsSelector>
  )
}

export default ViewsSelector
