import React from 'react'
import './Digit.css'

const PunchCard = props => {
  const digitClicked = () => {
    alert('clicked')
  }
  const { visits, numVisits } = props
  const elements = []
  for (let i = 1; i <= visits; i++) {
    // push the component to elements!
    const style = i <= numVisits ? 'DigitUsed' : 'Digit'
    elements.push(<div className={style}>{i}</div>)
  }

  return (
    <div className="Punch-Card">
      <div className="Container">{elements}</div>
    </div>
  )
}

export default PunchCard
