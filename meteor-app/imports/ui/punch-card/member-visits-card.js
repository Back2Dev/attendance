import React from 'react'
import PropTypes from 'prop-types'
import './Digit.css'

const MemberVisitsCard = ({ months, title }) => {
  const calMonths = 'Jan Feb Mar Apr May Jun Jul  Aug Sep Oct Nov Dec'.split(/\s+/)

  return (
    <div className="member-visit-card">
      <div className="Container">
        <h1 className="cardHeader">{title}</h1>
      </div>
      <div className="Container">
        {months.map((visits, ix) => {
          return (
            <div className="digitParent" key={ix}>
              <p className="multiDigit">{visits ? visits : ''}</p>
              {calMonths[ix]}
            </div>
          )
        })}
      </div>
    </div>
  )
}
MemberVisitsCard.propTypes = {
  months: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired
}

export default MemberVisitsCard
