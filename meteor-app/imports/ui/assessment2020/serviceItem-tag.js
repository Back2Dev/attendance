import React, { useState, useContext } from 'react'
import './serviceItem-tag.css'
import { ServiceContextProvider } from './service-context'
import { ServiceContext } from './service-context'

export default function ServiceItemTag(props) {
  const value = useContext(ServiceContext)

  // data is available through context but props arent available in story render
  console.log('data =', value)

  // props are available in the story render but data not available which is coming from the context
  console.log('props =', props)
  const [tags, setTags] = useState(value)

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

{
  /* <serviceContext.Provider value={data}>
  <div></div>
</serviceContext.Provider> */
}
