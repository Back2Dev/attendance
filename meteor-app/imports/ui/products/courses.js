import React, { useState } from 'react'
import Checkout from '../purchase/checkout'
import './courses.css'

const Courses = props => {

  const [courses, setCourses] = useState([])

    // if(rendered) {
      return (
        <div className="course-container product-content">
          {courses.map( 
            course => {return (
              <div class="course-card">
                <div class="course-card-details">
                  <img src={course.img}/>
                  <h1>{course.title}</h1>
                  <span>Starting on: {course.startDate}, Ending on: {course.endDate}</span>
                  <p>{course.description}</p>
                  <Checkout/> 
                  {/* i need to pass the price as props here */}
                  <hr/>
                </div>
              </div>
            )}
          )}
        </div>         
      )}
    //   else {
    //     return (
    //       <div className="course-container product-content">
    //         <h3>There are currently no courses</h3>
    //       </div>
    //     )
    //   }
    // }      


export default Courses



