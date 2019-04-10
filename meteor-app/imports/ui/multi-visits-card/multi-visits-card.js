import React from 'react'
import PropTypes from 'prop-types'
import '../punch-card/Digit.css'

const MultiVisitsCard = props => {
    const digitClicked = () => {
        //Digit Clicked Code..
    }
    const { totalVisits, usedVisits } = props
    const elements = []
    for (let i = 1; i <= totalVisits; i++) {
        if (i > usedVisits)
            elements.push(
                <div key={i} className="digitParent">
                    <p className="multiDigit" onClick={() => digitClicked}>{i}</p>
                </div>
            )
        else
            elements.push(
                <div key={i} className="digitParent">
                    <p className="usedMultiDigit" onClick={() => digitClicked}>X</p>
                </div>
            )
    }

    return (
        <div className="multi-visit-card" >
            <div className="Container">
                <h1 className="header">Visits</h1>
            </div>
            <div className="Container">{elements}</div>
            <div className="footer">You have used {Math.round((usedVisits / totalVisits) * 100)}% of your visits.</div>
        </div >
    )
}

export default MultiVisitsCard