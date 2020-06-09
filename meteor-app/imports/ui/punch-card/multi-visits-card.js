import React from 'react'
import PropTypes from 'prop-types'
import './Digit.css'
import { Icon } from 'semantic-ui-react'

const MultiVisitsCard = (props) => {
  const digitClicked = () => {
    //Digit Clicked Code..
  }
  const { totalVisits, usedVisits, paid } = props
  const elements = []
  for (let i = 1; i <= totalVisits; i++) {
    if (i > usedVisits)
      elements.push(
        <div key={i} className="digitParent">
          <p className="multiDigit" onClick={() => digitClicked}>
            {i}
          </p>
        </div>
      )
    else
      elements.push(
        <div key={i} className="digitParent">
          <img src="images/smiley.png" className="usedMultiDigit" />
        </div>
      )
  }
  return (
    <div className="multi-visit-card" style={{ backgroundColor: paid ? 'orange' : 'red' }}>
      <div className="Container">
        <h1 className="cardHeader">Visits</h1>
      </div>
      <div className="Container">{elements}</div>
      {totalVisits ? (
        <div className="cardFooter">You have used {Math.round((usedVisits / totalVisits) * 100)}% of your visits.</div>
      ) : (
        <div className="cardFooter">We haven't seen you yet</div>
      )}
    </div>
  )
}
MultiVisitsCard.propTypes = {
  totalVisits: PropTypes.number.isRequired,
  usedVisits: PropTypes.number.isRequired,
}
export default MultiVisitsCard
