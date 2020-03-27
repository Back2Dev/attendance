import React from 'react'
import PropTypes from 'prop-types'
import './tag.css'

export default function ServiceItemTag(props) {
  const { removeTag, toggleTag, majorMinorTotal, totalPrice, toggleExpand, tags } = props

  return (
    <div className="wrapper">
      <div className="tag-wrapper">
        {tags.map((tag, index) =>
          tag.name !== 'Major Service' && tag.name !== 'Minor Service' ? (
            <span className="tag" key={index}>
              <span className="item-name">{tag.name} </span>
              <span className="item-name">&nbsp;${tag.price}</span>
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
              <span className="expand" onClick={() => toggleExpand(tag, index)}>
                {tag.expanded ? '<' : '>'}
              </span>
              {tag.name}
              <span className="item-name">&nbsp;${majorMinorTotal(tag.items)}</span>
              <span className="handle" onClick={() => removeTag(tag, index)}>
                x
              </span>
            </span>
            {tag.expanded &&
              tag.items.map((item, index) =>
                tag.name === 'Major Service' ? (
                  <span className="tag" key={index} style={item.greyed ? { background: 'grey' } : {}}>
                    {item.name}
                    <span className="item-price">&nbsp;${item.price}</span>
                    <span className="handle" onClick={() => toggleTag(item, tag)}>
                      {item.greyed ? '+' : '-'}
                    </span>
                  </span>
                ) : (
                  <span className="tag" key={index} style={item.greyed ? { background: 'grey' } : {}}>
                    {item.name}
                    <span className="item-price">&nbsp;${item.price}</span>
                    <span className="handle" onClick={() => toggleTag(item, tag)}>
                      {item.greyed ? '+' : '-'}
                    </span>
                  </span>
                )
              )}
          </div>
        ) : null
      )}
      <div className="total-price">${totalPrice}</div>
    </div>
  )
}

ServiceItemTag.propTypes = {
  removeTag: PropTypes.func.isRequired,
  toggleTag: PropTypes.func.isRequired,
  majorMinorTotal: PropTypes.func.isRequired,
  totalPrice: PropTypes.number.isRequired,
  tags: PropTypes.array.isRequired
}
