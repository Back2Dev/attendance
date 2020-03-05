import React from 'react'
import PropTypes from 'prop-types'
import './Digit.css'
import { Icon } from 'semantic-ui-react'

const MemberVisitsCard = props => {
  const digitClicked = () => {
    //Digit Clicked Code..
  }
  const { memberDuration } = props
  const elements = []
  return (
    <div className="multi-visit-card">
      <div className="Container">
        <h1 className="header">Visits</h1>
      </div>
      <div className="Container">
        {
          <div className="digitParent">
            <p className="multiDigit" onClick={() => digitClicked}>
              {memberDuration}
            </p>
          </div>
        }
      </div>
    </div>
  )
}
MemberVisitsCard.propTypes = {
  totalVisits: PropTypes.number.isRequired,
  usedVisits: PropTypes.number.isRequired
}

export default MemberVisitsCard
