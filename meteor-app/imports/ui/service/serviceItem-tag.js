import React from 'react'
import PropTypes from 'prop-types'
import './serviceItem-tag.css'

const ServiceItemTag = ({ removeTag, toggleTag, majorMinorTotal, totalServicePrice, tags }) => {
  // const total = items => {
  //   let sum = items.reduce((total, item) => {
  //     if (!item.greyed) {
  //       total += item.price
  //     }
  //     return total
  //   }, 0)
  //   return sum
  // }

  return (
    <div className="wrapper">
      <div className="tag-wrapper">
        {tags.map((tag, index) =>
          tag.name !== 'Major Service' && tag.name !== 'Minor Service' ? (
            <span className="tag" key={index}>
              <span className="item-name">{tag.name}</span>
              <span className="item-name"> ${tag.price}</span>
              <span className="handle" onClick={() => removeTag(index)}>
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
              <span className="item-name"> ${majorMinorTotal(tag.items)}</span>
              <span className="handle" onClick={() => removeTag(index)}>
                x
              </span>
            </span>
            {tag.items.map((item, index) =>
              tag.name === 'Major Service' ? (
                <span className="tag" key={index} style={item.greyed ? { background: 'grey' } : {}}>
                  {item.name}
                  <span className="item-price"> ${item.price}</span>
                  <span className="handle" onClick={() => toggleTag(item, tag)}>
                    {item.greyed ? '+' : '-'}
                  </span>
                </span>
              ) : (
                <span className="tag" key={index} style={item.greyed ? { background: 'grey' } : {}}>
                  {item.name}
                  <span className="item-price"> ${item.price}</span>
                  <span className="handle" onClick={() => toggleTag(item, tag)}>
                    {item.greyed ? '+' : '-'}
                  </span>
                </span>
              )
            )}
          </div>
        ) : null
      )}
      <div class="total-price">$$${totalServicePrice}</div>
    </div>
  )
}

ServiceItemTag.propTypes = {
  removeTag: PropTypes.func.isRequired,
  toggleTag: PropTypes.func.isRequired,
  majorMinorTotal: PropTypes.number.isRequired,
  totalServicePrice: PropTypes.number.isRequired,
  tags: PropTypes.array.isRequired
}

export default ServiceItemTag
