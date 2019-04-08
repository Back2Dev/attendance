import React, { Component } from 'react'
import './Digit.css'

const PunchCard = props => {
  //A function that fetchs array of attended and 'not' attended weeks

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
        <div>
          <div className="Digit" onClick={() => digitClicked}>
            <img src={imgs[i]} />
          </div>
          <div className="weekName">{weekName[i]}</div>
        </div>
      )
      weeksLeft++
    } else if (weekValue[i] === 'true') {
      elements.push(
        <div>
          <div className="DigitUsed">&#10003;</div>
          <p className="weekName">{weekName[i]}</p>
        </div>)
      weeksDone++
    } else {
      console.log("!!!!!!")
    }
  }

  return (
    <div className="Punch-Card">
      <div className="Container">
        <h1 className="header">Workshop Weeks</h1>
      </div>
      <div className="Container">{elements}</div>
      <div className="footer">
        Weeks completed: {weeksDone} and Weeks left: {weeksLeft}
      </div>
    </div>
  )
}

export default PunchCard
