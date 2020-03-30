import React from 'react'
import PropTypes from 'prop-types'
import './tag-list.css'

export default function TagList(props) {
  const { removeTag, toggleTag, majorMinorTotal, totalPrice, toggleExpand, tags } = props

  return (
    <div className="wrapper">
      <div className="tag-wrapper">
        {tags.map((tag, index) =>
          tag.name !== 'Major Service' && tag.name !== 'Minor Service' ? (
            <span className="tag" key={index}>
              <span className="item-name" key={'a'}>
                {tag.name}{' '}
              </span>
              <span className="item-name" key={'b'}>
                &nbsp;${tag.price}
              </span>
              <span className="handle" key={'c'} onClick={() => removeTag(tag, index)}>
                x
              </span>
            </span>
          ) : null
        )}
      </div>

      {tags.map((tag, index) =>
        tag.name === 'Major Service' || tag.name === 'Minor Service' ? (
          <div className="mjmn" key={`minor${index}`}>
            <span className="tag">
              <span className="expand" key={'a'} onClick={() => toggleExpand(tag, index)}>
                {tag.expanded ? '<' : '>'}
              </span>
              {tag.name}
              <span className="item-name" key={'b'}>
                &nbsp;${majorMinorTotal(tag.items)}
              </span>
              <span className="handle" key={'c'} onClick={() => removeTag(tag, index)}>
                x
              </span>
            </span>
            {tag.expanded &&
              tag.items.map((item, index) =>
                tag.name === 'Major Service' ? (
                  <span className="tag" key={`major${index}`} style={item.greyed ? { background: 'grey' } : {}}>
                    {item.name}
                    <span className="item-price" key={'a'}>
                      &nbsp;${item.price}
                    </span>
                    <span className="handle" key={'b'} onClick={() => toggleTag(item, tag)}>
                      {item.greyed ? '+' : '-'}
                    </span>
                  </span>
                ) : (
                  <span className="tag" key={index} style={item.greyed ? { background: 'grey' } : {}}>
                    {item.name}
                    <span className="item-price" key={'a'}>
                      &nbsp;${item.price}
                    </span>
                    <span className="handle" key={'b'} onClick={() => toggleTag(item, tag)}>
                      {item.greyed ? 'O' : 'X'}
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

TagList.propTypes = {
  removeTag: PropTypes.func.isRequired,
  toggleTag: PropTypes.func.isRequired,
  majorMinorTotal: PropTypes.func.isRequired,
  totalPrice: PropTypes.number.isRequired,
  tags: PropTypes.array.isRequired
}
