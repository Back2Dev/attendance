import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { IconButton } from '@material-ui/core'
import ClearIcon from '@material-ui/icons/Clear'

import InlineEdit from '/imports/ui/components/commons/inline-edit/input'

const StyledServiceItem = styled.div`
  display: block;
  margin-top: 5px;
  width: 100%;

  .wrapper {
    border-radius: 5px;
    padding: 5px 10px;
    display: flex;
    flex-direction: row;

    &.used {
      background-color: #0ecdea;
    }
    &.new {
      background-color: #069be5;
      color: #ffffff;
    }
  }
  .condition {
    padding-top: 2px;
    margin-right: 5px;
  }
  .name {
    padding: 2px 5px;
    flex: 1;
  }
  .price {
    padding: 2px 0;
    font-weight: bold;
    min-width: 50px;
  }
  .remove-btn {
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

        <div className="name">
          <InlineEdit
            text={currentItem.name}
            onSetText={(value) => {
              setCurrentItem({ ...currentItem, name: value, modifiedAt: new Date() })
            }}
          />
        </div>

        <div className="remove-btn">
          <IconButton
            aria-label="remove item"
            component="span"
            size="small"
            onClick={onRemove}
            tabIndex={-1}
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
