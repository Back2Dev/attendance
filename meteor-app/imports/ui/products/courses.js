import React, { Component } from 'react'
import Checkout from '../purchase/checkout'

export default class Courses extends Component {
  state = {
    //   isSuper = this.isSuper
    rendered: false
  }

//   componentDidMount () {
//     const url =  `${process.env.REACT_APP_DOMAIN}/courses`
//     axios.get(url)
//     .then(resp => {
//       const courses = resp.data 
//       this.setState({
//           courses: courses, 
//           rendered: true})
//           courses.map(course => {
//             console.log(course.title)
//           })
//     })
//     .catch( err => console.log(err))
//   }
  //still need to filter result of products - to only include products that are courses

  render() {
    // if (this.state.isSuper) {

    //     return (
    //     <div>
    //         Update course functionality
    //     </div>
    //     )
    //  }
    // else  {

        if(this.state.rendered) {
            return (
                <div class="course-container">
                  {this.state.courses.map( 
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
            else {
              return (
                  <p>There are currently no courses</p>
              )
            }
        }      
}



