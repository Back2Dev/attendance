import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { IconButton } from '@material-ui/core'
import ClearIcon from '@material-ui/icons/Clear'

const StyledServiceItem = styled.div`
  display: inline-flex;
  margin-right: 10px;
  margin-top: 5px;
  .wrapper {
    border-radius: 10px;
    padding: 5px 10px;
    display: inline-flex;
    &.used {
      background-color: #0ecdea;
    }
    &.new {
      background-color: #069be5;
    }
  }
  .condition {
    padding-top: 2px;
    margin-right: 5px;
  }
  .name {
    padding-top: 2px;
    margin-right: 5px;
  }
  .price {
    padding-top: 2px;
    font-weight: bold;
  }
  .remove-btn {
    margin-left: 10px;
    padding: 0;
    span {
      padding: 0;
      height: 20px;
      line-height: 20px;
      color: #fff;
    }
  }
`

function ServiceItem({ item }) {
  const wrapperClasses = ['wrapper']
  wrapperClasses.push(item.used ? 'used' : 'new')
  wrapperClasses.push(`code-${item.code}`)
  wrapperClasses.push(`cat-${item.category}`)
  return (
    <StyledServiceItem>
      <div className={wrapperClasses.join(' ')}>
        <div className="condition">{item.used ? 'Used' : 'New'}</div>
        <div className="name">{item.name}</div>
        <div className="price">${item.price / 100}</div>
        <div className="remove-btn">
          <IconButton aria-label="remove item" component="span" size="small">
            <ClearIcon fontSize="small" />
          </IconButton>
        </div>
      </div>
    </StyledServiceItem>
  )
}

ServiceItem.propTypes = {
  item: PropTypes.shape({
    localId: String,
    _id: String,
    name: String,
    price: Number,
    used: Boolean,
    code: String,
    category: String,
  }),
}

export default ServiceItem
