import React, { Component } from 'react'
import Passes from '../products/passes'
import Courses from '../products/courses'
import Memberships from '../products/memberships'
import Checkout from '../purchase/checkout'

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
    <div>
      <p>Purchase Container</p>
      
    
    <div className="passes">
      <button onClick={this.passesHandler}>Passes</button>
      { this.state.passes ? <Passes/> : null }
    </div>

    <div className="courses">
      <button onClick={this.coursesHandler}>Courses</button>
      { this.state.courses ? <Courses /> : null }
    </div>

    <div className="memberships">
      <button onClick={this.membershipHandler}>Memberships</button>
      { this.state.memberships ? <Memberships /> : null }
    </div>

    </div>
  )
}
}
