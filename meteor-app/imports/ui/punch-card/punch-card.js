import React from 'react'
import './Digit.css'

import One from './Numbers/1.png'
import Two from './Numbers/2.png'
import Three from './Numbers/3.png'
import Four from './Numbers/4.png'
import Five from './Numbers/5.png'
import Six from './Numbers/6.png'
import Seven from './Numbers/7.png'
import Eight from './Numbers/8.png'
import Nine from './Numbers/9.png'
import Ten from './Numbers/10.png'

const eachDigitStyle = {
  marginLeft: '5px;'
}

export default class PunchCard extends React.Component {
  digitClicked = () => {
    alert('clicked')
  }

  render() {
    return (
      <div className="Punch-Card">
        <div className="Container">
          <div className="Digit">
            <img src={One} onClick={() => digitClicked} />
            <img src={Two} />
            <img src={Three} />
            <img src={Four} />
            <img src={Five} />
          </div>
          <div className="Digit">
            <img src={Six} />
            <img src={Seven} />
            <img src={Eight} />
            <img src={Nine} />
            <img src={Ten} />
          </div>
        </div>
      </div>
    )
  }
}
