import React from 'react'
import PropTypes from 'prop-types'
import './Digit.css'
import { Icon } from 'semantic-ui-react'

const MemberVisitsCard = props => {
  const digitClicked = () => {
    //Digit Clicked Code..
  }
  const { startDate, expiryDate, paid } = props
  const elements = []
  let start = moment(startDate)
  let expiry = moment(expiryDate)

  while (expiry > start || start.format('M') === expiry.format('M')) {
    console.log(start.format('MMM'))
    elements.push(
      <div className="digitParent">
        <p className="multiDigit" onClick={() => digitClicked}></p> {start.format('MMM')}
      </div>
    )
    start.add(1, 'month')
  }

  return (
    <div className="member-visit-card" style={{ backgroundColor: paid ? 'orange' : 'red' }}>
      <div className="Container">
        <h1 className="header">Visits</h1>
      </div>
      <div className="Container">{elements}</div>
    </div>
  )
}
MemberVisitsCard.propTypes = {
  totalVisits: PropTypes.number.isRequired,
  usedVisits: PropTypes.number.isRequired
}

export default MemberVisitsCard
