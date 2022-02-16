import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useHistory } from 'react-router'

import { FormControl, MenuItem, Select, IconButton } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'

import { CollectionContext } from '../context'

const debug = require('debug')('app:dba-grid-views-selector')

const cc = require('change-case')
cc.kebabCase = (str) => cc.headerCase(str).toLowerCase()

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

function ViewsSelector({ showDefault = true }) {
  const { theCollection, theView, availableViews } = useContext(CollectionContext)
  const collectionKebab = cc.kebabCase(theCollection._name)
  debug({ theView, availableViews })

  const history = useHistory()

  const handleChange = (event) => {
    const viewSlug = event.target.value
    history.push(`/dba/${collectionKebab}${viewSlug ? `/${viewSlug}` : ''}`)
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
        <Select value={theView?.slug || ''} onChange={handleChange}>
          {showDefault && <MenuItem value="ALL_BY_SCHEMA">ALL (Schema)</MenuItem>}
          {renderMenuItems()}
        </Select>
      </FormControl>
      {theView && (
        <IconButton
          color="secondary"
          aria-label="edit view"
          className="btn btn-edit"
          component="span"
          onClick={() =>
            history.push(`/dba/${collectionKebab}/edit-view/${theView.slug}`)
          }
        >
          <EditIcon />
        </IconButton>
      )}
      <IconButton
        color="primary"
        aria-label="add view"
        className="btn btn-add"
        component="span"
        onClick={() => history.push(`/dba/${collectionKebab}/add-view`)}
      >
        <AddIcon />
      </IconButton>
    </StyledViewsSelector>
  )
}

ViewsSelector.propTypes = {
  showDefault: PropTypes.bool,
}

export default ViewsSelector
