import React, { useState } from './react'
import './serviceItem-tag.css'

const data = [
  { title: 'item1', isMajMin: false },
  { title: 'item2', isMajMin: false },
  { title: 'item3', isMajMin: false },
  { title: 'item4', isMajMin: false },
  { title: 'item5', isMajMin: false },
  { title: 'item6', isMajMin: false },
  { title: 'item6', isMajMin: false },
  { title: 'item7', isMajMin: false },
  { title: 'item8', isMajMin: false },
  { title: 'item9', isMajMin: false },
  { title: 'item10', isMajMin: false },
  { title: 'item11', isMajMin: false },
  { title: 'item12', isMajMin: false },
  { title: 'item13', isMajMin: false },
  { title: 'item14', isMajMin: false },
  { title: 'item15', isMajMin: false },
  { title: 'item16', isMajMin: false },
  { title: 'item17', isMajMin: false },
  {
    title: 'Major Service',
    isMajMin: true,
    items: [
      { title: 'mj1', greyed: false },
      { title: 'mj2', greyed: false },
      { title: 'mj3', greyed: false },
      { title: 'mj4', greyed: false },
      { title: 'mj5', greyed: false },
      { title: 'mj6', greyed: false },
      { title: 'mj7', greyed: false },
      { title: 'mj8', greyed: false },
      { title: 'mj19', greyed: false },
      { title: 'mj10', greyed: false },
      { title: 'mj11', greyed: false },
      { title: 'mj12', greyed: false },
      { title: 'mj13', greyed: false },
      { title: 'mj14', greyed: false },
      { title: 'mj15', greyed: false },
      { title: 'mj16', greyed: false },
      { title: 'mj17', greyed: false },
      { title: 'mj18', greyed: false }
    ]
  },
  {
    title: 'Minor Service',
    isMajMin: true,
    items: [
      { title: 'mn1', greyed: false },
      { title: 'mn2', greyed: false },
      { title: 'mn3', greyed: false },
      { title: 'mn4', greyed: false },
      { title: 'mn5', greyed: false },
      { title: 'mn6', greyed: false },
      { title: 'mn7', greyed: false },
      { title: 'mn8', greyed: false },
      { title: 'mn9', greyed: false },
      { title: 'mn10', greyed: false },
      { title: 'mn11', greyed: false },
      { title: 'mn12', greyed: false },
      { title: 'mn13', greyed: false },
      { title: 'mn14', greyed: false },
      { title: 'mn15', greyed: false },
      { title: 'mn16', greyed: false },
      { title: 'mn17', greyed: false },
      { title: 'mn18', greyed: false },
      { title: 'mn19', greyed: false },
      { title: 'mn20', greyed: false }
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

  function toggleTag(item) {
    console.log(item)
    const newTags = [...tags]
    newTags.map(tag => {
      tag.items
        ? tag.items.map(serviceItem => {
            if (serviceItem.title === item.title) {
              serviceItem.greyed = !serviceItem.greyed
            }
          })
        : null
    })
    setTags(newTags)
  }

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
