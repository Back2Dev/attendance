import React from 'react'
import './serviceItem-tag.css'

export default function ServiceItemTag(props) {
  const { removeTag, toggleTag, tags } = props

  const totalPrice = 0

  console.log('tags = ', tags)

  const total = items => {
    let sum = items.reduce((total, cur) => total + cur.price)

    console.log('sum = ', sum)
    // return sum
  }

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
              <span className="item-name"> ${total(tag.items)}</span>
              <span className="handle" onClick={() => removeTag(index)}>
                x
              </span>
            </span>
            {tag.items.map((item, index) =>
              tag.name === 'Major Service' ? (
                <span className="tag" key={index} style={item.greyed ? { background: 'grey' } : {}}>
                  {item.name}
                  <span className="handle" onClick={() => toggleTag(item, tag)}>
                    {item.greyed ? '+' : '-'}
                  </span>
                </span>
              ) : (
                <span className="tag" key={index} style={item.greyed ? { background: 'grey' } : {}}>
                  {item.name}
                  <span className="handle" onClick={() => toggleTag(item, tag)}>
                    {item.greyed ? '+' : '-'}
                  </span>
                </span>
              )
            )}
          </div>
        ) : null
      )}
    </div>
  )
}
