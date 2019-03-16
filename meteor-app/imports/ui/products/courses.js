import React, { useState } from 'react'
import Checkout from '../purchase/checkout'
import './courses.css'

const Courses = props => {
  const [courses, setCourses] = useState([])

  const { img = '/images/gym.jpg', title = '', description = '', startDate = '', endDate = '' } = props

  if (courses) {
    return (
      <div className="course-container product-content">
        {/* {courses.map(  */}
        {/* course => {return ( */}
        <div class="course-card">
          <div class="course-card-details">
            <img src={img} />
            <h1>{title}</h1>
            <span>
              Starting on: {startDate}, Ending on: {endDate}
            </span>
            <p>{description}</p>
            <Checkout />
            {/* i need to pass the price as props here */}
            <hr />
          </div>
        </div>
        {/* )} */}
        {/* )} */}
      </div>
    )
  } else {
    return (
      <div className="course-container product-content">
        <h3>There are currently no courses</h3>
      </div>
    )
  }
}

export default Courses
