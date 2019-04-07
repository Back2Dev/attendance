import React, { Component } from 'react'
import './Digit.css'

const PunchCard = props => {
  //A function that fetchs array of attended and 'not' attended weeks

  const digitClicked = () => {
    alert('clicked')
  }
  const weeks = [
    //Sample array
    { '1': true },
    { '2': false },
    { '3': false },
    { '4': true },
    { '5': true },
    { '6': false },
    { '7': true },
    { '8': false },
    { '9': true },
    { '10': true },
    { '11': false },
    { '12': true }
  ]

  //Arrays
  const { visits, numVisits } = props
  const elements = []
  const weekValue = [] //Array of attended and 'not'attended weeks. let say true is attended and false is not attended
  const weekNum = [] //Key of each object in weeks array
  let weeksDone = 0
  let weeksLeft = 0

  //populating values in arrays
  for (let i = 0; i < weeks.length; i++) {
    weekValue.push(Object.values(weeks[i]))
  }
  for (let i = 0; i < weeks.length; i++) {
    weekNum.push(Object.keys(weeks[i]))
  }

  for (let i = 0; i < weeks.length; i++) {
    //const style = weekValue[i] ? 'DigitUsed' : 'Digit'

    if (weekValue[i] == 'false') {
      elements.push(
        <div className="Digit" onClick={() => digitClicked}>
          {weekNum[i]}
        </div>
      )
      weeksLeft++
    } else if (weekValue[i] == 'true') {
      elements.push(<div className="DigitUsed">X</div>)
      weeksDone++
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
