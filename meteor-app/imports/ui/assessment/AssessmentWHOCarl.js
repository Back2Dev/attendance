import React, { useState } from 'react'
import './AssessmentWHOCarlStyles.css'

function AssessmentChecklist() {
  return (
    <div>
      <div className="input-container">
        <form>
          <label>
            Search:
            <input type="text" placeholder="Search.." class="ac-input" />
          </label>
          <input type="submit" value="submit" />
        </form>
      </div>
    </div>
  )
}

export default AssessmentChecklist
