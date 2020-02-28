import React, { useState } from 'react'
import './AssessmentWHOCarlStyles.css'

function todo({index, removeItem}){
    return(
        <div>
            <button onClick={() => removeItem(index)}>X</button>
        </div>
    )
}

function AssessmentChecklist({ addItem }) {
  const [value, setValue] = useState('')
  const [item, setItem] = useState([])
  const handleSubmit = e => {
    e.preventDefault()
    if (!value) return
    addItem(value)
    setValue('')
  }

  const removeItem = index => {
      const newValue = [...value]
      newValue.splice(index, 1)
      setValue(newValue)
  }

  return (
    <div>
      <div className="input-container">
        <form onSubmit={handleSubmit}>
          <input
            type="submit"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="Search Services/Items..."
            removeItem={removeItem}
          />
        </form>
      </div>
    </div>
  )
}

export default AssessmentChecklist
