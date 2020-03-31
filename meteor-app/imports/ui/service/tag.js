import React from 'react'
import './tag-list.css'

export default Tag = ({ index, tag }) => {
  const [newPrice, setNewPrice] = React.useState(null)
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
          <input onBlur={e => setNewPrice(e.target.value)}></input>
        )}

        <span className="handle" key={'c'} onClick={() => removeTag(tag, index)}>
          x
        </span>
      </span>
    </>
  )
}
