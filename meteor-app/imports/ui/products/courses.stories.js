// member-card.stories.js
import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react'

const courseInfo = {
    img:'/images/gym.jpg',
    title: 'awesome course similar to awesome sauce, but a course',
    startDate: '2019-02-18T16:00:00Z',
    endDate: '2019-03-18T16:00:00Z',
    description: '10 visits, usable at any of our evening sessions '
}

import Courses from './courses'

storiesOf('Courses', module)
  .addDecorator(withKnobs)

  .add('div.course-card', () => {
    const story = (
      <div>
        <Courses {...courseInfo} />
        {/* <p>hello</p> */}
      </div>
    )
    return story
  })


// {this.state.courses.map( 
//   course => {return (
//     <div class="course-card">
//       <div class="course-card-details">
//         <img src={course.img}/>
//         <h1>{course.title}</h1>
//         <span>Starting on: {course.startDate}, Ending on: {course.endDate}</span>
//         <p>{course.description}</p>