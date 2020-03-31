import React from 'react'
import './tag-list.css'

export default Tag = ({ index, tag, adjustPrice, removeTag }) => {
  const [disableToggle, setDisableToggle] = React.useState(false)

  return (
    <>
      <span className="tag" key={index}>
        <span className="item-name" key={'a'}>
          {tag.name}{' '}
        </span>
        {!disableToggle ? (
          <span
            onClick={() => {
              setDisableToggle(!disableToggle)
            }}
            className="item-name"
            key={'b'}
          >
            &nbsp;${tag.price}
          </span>
        ) : (
          <span>
            &nbsp;$
            <input
              defaultValue={tag.price}
              className="tag-input"
              onChange={e => adjustPrice(tag._id, e.target.value)}
              onBlur={() => setDisableToggle(!disableToggle)}
            />
          </span>
        )}

        <span className="handle" key={'c'} onClick={() => removeTag(tag, index)}>
          x
        </span>
      </span>
    </>
  )
}
