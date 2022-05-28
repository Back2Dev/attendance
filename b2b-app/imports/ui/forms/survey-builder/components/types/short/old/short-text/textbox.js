import React, { useState } from 'react'
import { Text } from 'slate'
// import { makeStyles } from '@material-ui/core/styles';
// import TextField from '@material-ui/core/TextField';

const TextFields = ({
  item,
  id,
  onChange,
  onRemoveItem,
  onUpItem,
  length,
  onDownItem,
  onAddItem,
}) => {
  const [editted, setEditting] = useState(false)

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setEditting(false)
    }
  }

  return (
    <div>
      {editted ? (
        <div onBlur={() => setEditting(false)} onKeyDown={handleKeyDown}>
          {
            <input
              value={item.value}
              onChange={(e) => {
                onChange(item.sortOrder - 1, e.target.value)
              }}
              id={id}
            ></input>
          }
        </div>
      ) : (
        <div onClick={() => setEditting(true)}>
          <span id={id}>
            {item.label} {item.sortOrder}
          </span>
        </div>
      )}
      <div className="removeButton">
        <button onClick={onRemoveItem}>Remove</button>
      </div>

      {id >= 1 && (
        <div className="upButton">
          <button onClick={onUpItem}>Move up</button>
        </div>
      )}
      {id >= 0 && id <= length - 1 && length >= 2 && (
        <div className="downButton">
          <button onClick={onDownItem}>Move down</button>
        </div>
      )}

      {length - 1 === id && <button onClick={onAddItem}>Add</button>}
    </div>
  )
}

export default TextFields
