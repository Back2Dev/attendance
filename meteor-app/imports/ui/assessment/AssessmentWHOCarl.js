import React, { useState } from 'react'
import './AssessmentWHOCarlStyles.css'

/*
The app will have

### Tabs:
  1. 3 Tabbable pages
    - Details
    - Service Selector
    - Summary (Hidden initially)
        - only Render in the Admin panel to allow quick review
          (Might need to check against the route as cannot use login)


### Search bar:
  1. A Search bar w drop down 
    - items in drop down are clickable items.
      - when clicked, the item will be added to an array
      - The arr will be rendered to the screen with pills
  2. Any active pills will be clickable to remove from array
  3. When "misc" is added, The parts collection is now available to select from
    - ** SHOULD BE A SEPERATE DROPDOWN.??  **


### Price / Expected labour & items
  1. This will be based off schema
  2. render total price only.
  3. Allow over-riding based on % off
    - ** RETAIN BOTH FIGURES (BASE PRICE AND SOLD PRICE)??**

### Major / Minor Service specific Pills
  1. When either service is selected, all pills under that service are added automatically.
    - when selected, it will grey out. Not delete.

*/



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
