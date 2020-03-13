import React from 'react'
import PropTypes from 'prop-types'
import './serviceItem-tag.css'

export default function ServiceItemTag(props) {
  const { removeTag, toggleTag, majorMinorTotal, totalServicePrice, tags } = props

  return (
    <div className="wrapper">
      <div className="tag-wrapper">
        {tags.map((tag, index) =>
          tag.name !== 'Major Service' && tag.name !== 'Minor Service' ? (
            <span className="tag" key={index}>
              <span className="item-name">{tag.name} </span>
              <span className="item-name">- $ {tag.price / 100}</span>
              <span className="handle" onClick={() => removeTag(tag, index)}>
                x
              </span>
            </span>
          ) : null
        )}
      </div>

      {tags.map((tag, index) =>
        tag.name === 'Major Service' || tag.name === 'Minor Service' ? (
          <div className="mjmn" key={index}>
            <span className="tag">
              {tag.name}
              <span className="item-name">- $ {majorMinorTotal(tag.items)}</span>
              <span className="handle" onClick={() => removeTag(tag, index)}>
                x
              </span>
            </span>
            {tag.items.map((item, index) =>
              tag.name === 'Major Service' ? (
                <span className="tag" key={index} style={item.greyed ? { background: 'grey' } : {}}>
                  {item.name}
                  <span className="item-price">- $ {item.price / 100}</span>
                  <span className="handle" onClick={() => toggleTag(item, tag)}>
                    {item.greyed ? '+' : '-'}
                  </span>
                </span>
              ) : (
                <span className="tag" key={index} style={item.greyed ? { background: 'grey' } : {}}>
                  {item.name}
                  <span className="item-price">- $ {item.price / 100}</span>
                  <span className="handle" onClick={() => toggleTag(item, tag)}>
                    {item.greyed ? '+' : '-'}
                  </span>
                </span>
              )
            )}
          </div>
        ) : null
      )}
      <div className="total-price">${totalServicePrice}</div>
    </div>
  )
}

ServiceItemTag.propTypes = {
  removeTag: PropTypes.func.isRequired,
  toggleTag: PropTypes.func.isRequired,
  majorMinorTotal: PropTypes.func.isRequired,
  totalServicePrice: PropTypes.number.isRequired,
  tags: PropTypes.array.isRequired
}
