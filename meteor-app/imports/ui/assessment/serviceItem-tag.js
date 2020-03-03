import React, { useState } from 'react'
import './serviceItem-tag.css'

const data = [
  { title: 'item1', isMajMin: false },
  { title: 'item2', isMajMin: false },
  { title: 'item3', isMajMin: false },
  { title: 'item4', isMajMin: false },
  { title: 'item5', isMajMin: false },
  { title: 'item6', isMajMin: false },
  {
    title: 'Major Service',
    isMajMin: true,
    items: [
      { title: 'mj1', greyed: false },
      { title: 'mj2', greyed: false },
      { title: 'mj3', greyed: false }
    ]
  },
  {
    title: 'Minor Service',
    isMajMin: true,
    items: [
      { title: 'mn1', greyed: false },
      { title: 'mn2', greyed: false },
      { title: 'mn3', greyed: false }
    ]
  }
]

export default function ServiceItemTag() {
  const [tags, setTags] = useState(data)

  function removeTag(index) {
    const newTags = [...tags]
    newTags.splice(index, 1)
    setTags(newTags)
  }

  function exclude(item) {
    console.log(item)
    const newTags = [...tags]
    newTags.map(tag => {
      tag.items
        ? tag.items.map(serviceItem => {
            if (serviceItem.title === item.title) {
              serviceItem.greyed = true
            }
          })
        : null
    })
    setTags(newTags)
  }
  function include(item) {
    console.log(item)
    const newTags = [...tags]
    newTags.map(tag => {
      tag.items
        ? tag.items.map(serviceItem => {
            if (serviceItem.title === item.title) {
              serviceItem.greyed = false
            }
          })
        : null
    })
    setTags(newTags)
  }

  return (
    <div>
      {tags.map((tag, index) =>
        tag.title !== 'Major Service' && tag.title !== 'Minor Service' ? (
          <span className="tag" key={index}>
            <span className="item-name">{tag.title}</span>
            <span className="remove-tag" onClick={() => removeTag(index)}>
              X
            </span>
          </span>
        ) : (
          <div key={index}>
            <div className="tag">
              {tag.title}
              <span className="remove-tag" onClick={() => removeTag(index)}>
                X
              </span>
            </div>
            {tag.items.map((item, index) =>
              tag.title === 'Major Service' ? (
                <span className="mjmn-tag" key={index} style={item.greyed ? { background: 'grey' } : {}}>
                  <span className="add-tag" onClick={() => include(item, index)}>
                    +
                  </span>
                  {item.title}
                  <span className="remove-tag" onClick={() => exclude(item, index)}>
                    X
                  </span>
                </span>
              ) : (
                <span className="mjmn-tag" key={index} style={item.greyed ? { background: 'grey' } : {}}>
                  <span className="add-tag" onClick={() => include(item, index)}>
                    +
                  </span>
                  {item.title}
                  <span className="remove-tag" onClick={() => exclude(item, index)}>
                    X
                  </span>
                </span>
              )
            )}
          </div>
        )
      )}
    </div>
  )
}
