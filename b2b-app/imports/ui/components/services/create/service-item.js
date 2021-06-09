import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { IconButton } from '@material-ui/core'
import ClearIcon from '@material-ui/icons/Clear'

import InlineEdit from '/imports/ui/components/commons/inline-edit/input'

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

function ServiceItem({ item, onRemove, onChange }) {
  const [currentItem, setCurrentItem] = useState(item)

  useEffect(() => {
    if (currentItem.modifiedAt) onChange(currentItem)
  }, [currentItem.modifiedAt])

  const wrapperClasses = ['wrapper']
  wrapperClasses.push(currentItem.used ? 'used' : 'new')
  wrapperClasses.push(`code-${currentItem.code}`)
  wrapperClasses.push(`cat-${currentItem.category}`)
  return (
    <StyledServiceItem>
      <div className={wrapperClasses.join(' ')}>
        <div className="name">
          <InlineEdit
            text={currentItem.name}
            onSetText={(value) => {
              setCurrentItem({ ...currentItem, name: value, modifiedAt: new Date() })
            }}
          />
        </div>
        <div className="price">
          $
          <InlineEdit
            text={`${currentItem.price / 100}`}
            onSetText={(value) => {
              setCurrentItem({
                ...currentItem,
                price: value * 100,
                modifiedAt: new Date(),
              })
            }}
          />
        </div>
        <div className="remove-btn">
          <IconButton
            aria-label="remove item"
            component="span"
            size="small"
            onClick={onRemove}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        </div>
      </div>
    </StyledServiceItem>
  )
}

ServiceItem.propTypes = {
  item: PropTypes.shape({
    localId: PropTypes.string,
    _id: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.number,
    used: PropTypes.bool,
    code: PropTypes.string,
    category: PropTypes.string,
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default ServiceItem
