import React, { Component } from 'react'
import Passes from '../products/passes'
import Courses from '../products/courses'
import Memberships from '../products/memberships'
import Checkout from '../purchase/checkout'
import './purchase-container.css'

export default class PurchaseContainer extends Component {
constructor(props) {
  super(props)

  this.state = {
     passes: false,
     courses: false,
     memberships: false
  }
}

passesHandler = () => {
    this.setState(prevState => {
        return {passes: !prevState.passes}
    })
}

coursesHandler = () => {
    this.setState(prevState => {
        return {courses: !prevState.courses}
    })
}

membershipHandler = () => {
    this.setState(prevState => {
        return {memberships: !prevState.memberships}
    })
}

render() {
  return (
    <div className="purchase-container">
      {/* <p>Purchase Container</p> */}
      
    
      <div className="passes purchase-option">
        <button onClick={this.passesHandler} className="purchase-button">Passes</button>
        { this.state.passes ? <Passes/> : null }
      </div>

      <div className="courses purchase-option">
        <button onClick={this.coursesHandler} className="purchase-button">Courses</button>
        { this.state.courses ? <Courses /> : null }
      </div>

      <div className="memberships purchase-option">
        <button onClick={this.membershipHandler} className="purchase-button">Memberships</button>
        { this.state.memberships ? <Memberships /> : null }
      </div>

    </div>
  )
}
}
