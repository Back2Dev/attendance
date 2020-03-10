import React from 'react'
import './serviceItem-tag.css'

export default function ServiceItemTag(props) {
  const { removeTag, toggleTag, tags } = props

  return (
    <div className="wrapper">
      <div className="tag-wrapper">
        {tags.map((tag, index) =>
          tag.title !== 'Major Service' && tag.title !== 'Minor Service' ? (
            <span className="tag" key={index}>
              <span className="item-name">{tag.title}</span>
              <span className="handle" onClick={() => removeTag(index)}>
                x
              </span>
            </span>
          ) : null
        )}
      </div>

      {tags.map((tag, index) =>
        tag.title === 'Major Service' || tag.title === 'Minor Service' ? (
          <div className="mjmn" key={index}>
            <span className="tag">
              {tag.title}
              <span className="handle" onClick={() => removeTag(index)}>
                x
              </span>
            </span>
            {tag.items.map((item, index) =>
              tag.title === 'Major Service' ? (
                <span className="tag" key={index} style={item.greyed ? { background: 'grey' } : {}}>
                  {item.title}
                  <span className="handle" onClick={() => toggleTag(item, index)}>
                    {item.greyed ? '+' : '-'}
                  </span>
                </span>
              ) : (
                <span className="tag" key={index} style={item.greyed ? { background: 'grey' } : {}}>
                  {item.title}
                  <span className="handle" onClick={() => toggleTag(item, index)}>
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
