import React from 'react'
import PropTypes from 'prop-types'
import './Digit.css'

const MemberVisitsCard = ({ startDate, expiryDate, paid, sessions }) => {
  const digitClicked = () => {
    //Digit Clicked Code..
  }

  const elements = []
  let start = moment(startDate)
  let expiry = moment(expiryDate)

  while (expiry > start || start.format('M') === expiry.format('M')) {
    elements.push(
      <div className="digitParent">
        <p className="multiDigit" onClick={() => digitClicked}>
          {sessions.filter(session => moment(session.timeIn).format('M') === start.format('M')).length}
        </p>
        {start.format('MMM')}
      </div>
    )
    start.add(1, 'month')
  }

  return (
    <div className="member-visit-card" style={{ backgroundColor: paid ? 'orange' : 'red' }}>
      <div className="Container">
        <h1 className="cardHeader">Visits</h1>
      </div>
      <div className="Container">{elements}</div>
      <div className="cardFooter">Expiry: {expiry.format('DD/MM/YY')}</div>
    </div>
  )
}
MemberVisitsCard.propTypes = {
  totalVisits: PropTypes.number.isRequired,
  usedVisits: PropTypes.number.isRequired
}

export default MemberVisitsCard
