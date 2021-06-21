import React, { useContext } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router'

import { Typography, IconButton } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import EditIcon from '@material-ui/icons/Edit'
import numeral from 'numeral'

import { JobsDetailsContext } from './context'

const StyledJobServiceItems = styled.div`
  .header {
    display: flex;
    flex-direction: row;
    .title {
      flex: 1;
    }
  }
  .price {
    min-width: 35px;
    display: inline-block;
  }
`

function JobServiceItems() {
  const { item, loading } = useContext(JobsDetailsContext)
  const { push } = useHistory()

  const renderServiceItem = (serviceItem) => {
    if (!serviceItem) {
      return null
    }

    return (
      <div
        className="service-item"
        key={`${serviceItem._id}-${serviceItem.name}-${serviceItem.price}`}
      >
        <span className="price">${numeral(serviceItem.price / 100).format('0,0')}</span>
        <span className="separator"> - </span>
        <span className="name">{serviceItem.name}</span>
      </div>
    )
  }

  const renderItems = () => {
    if (!item || loading) {
      return <Skeleton />
    }
    return item.serviceItems.map((serviceItem) => {
      return renderServiceItem(serviceItem)
    })
  }

  return (
    <StyledJobServiceItems>
      <div className="header">
        <Typography variant="h4" className="title">
          Service Items
        </Typography>
        <IconButton
          color="primary"
          aria-label="edit"
          component="span"
          size="small"
          onClick={() => {
            push(`/services/edit/${item._id}`)
          }}
        >
          <EditIcon />
        </IconButton>
      </div>
      {renderItems()}
    </StyledJobServiceItems>
  )
}

export default JobServiceItems
