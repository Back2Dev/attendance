import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './Digit.css'

const PunchCard = props => {
  const digitClicked = () => {
    alert('clicked')
  }

  //Arrays
  const { weekNum, weekValue, weekName, imgs } = props
  const elements = []

  let weeksDone = 0
  let weeksLeft = 0
  for (let i = 0; i < weekNum; i++) {
    if (weekValue[i] === 'false') {
      elements.push(
        <div key={i} className="digitParent">
          <img src={imgs[i]} className="Digit" onClick={() => digitClicked} />
          <p className="weekName">{weekName[i]}</p>
        </div>
      )
      weeksLeft++
    } else if (weekValue[i] === 'true') {
      elements.push(
        <div key={i} className="digitParent">
          <img className="Digit" src="images/tick2.png" />
          <p className="weekName">{weekName[i]}</p>
        </div>
      )
      weeksDone++
    }
  }

  return (
    <div className="Punch-Card">
      <div className="Container">
        <h1 className="header">Maintenance Course</h1>
      </div>
      <div className="Container">{elements}</div>
      <div className="footer">{Math.round((weeksDone / (weeksDone + weeksLeft)) * 100)}% Completed</div>
    </div>
  )
}

PunchCard.propTypes = {
  weekNum: PropTypes.number.isRequired,
  weekValue: PropTypes.array.isRequired,
  weekName: PropTypes.array.isRequired,
  imgs: PropTypes.array.isRequired
}
export default PunchCard
