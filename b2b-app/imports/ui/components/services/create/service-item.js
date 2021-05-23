import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import faker from 'faker'

const StyledServiceItem = styled.div`
  display: inline-flex;
  margin-right: 10px;
  .wrapper {
    border: 1px solid;
    border-radius: 10px;
    padding: 5px 10px;
    display: inline-flex;
  }
  .condition {
    margin-right: 5px;
  }
  .name {
    margin-right: 5px;
  }
  .price {
    font-weight: bold;
  }
`

function ServiceItem({ item }) {
  return (
    <StyledServiceItem>
      <div
        className="wrapper"
        style={{ backgroundColor: item.backgroundColor, color: '#FFFFFF' }}
      >
        <div className="condition">{item.used ? 'Used' : 'New'}</div>
        <div className="name">{item.name}</div>
        <div className="price">${item.price}</div>
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
    backgroundColor: String,
  }),
}

export default ServiceItem
