import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withKnobs, number } from '@storybook/addon-knobs/react'
import StoryRouter from 'storybook-router'
import AssessmentJobCard from './assessment-job-card'
import { fakeJob } from '/imports/api/fake-data'

// this ensures we get the same random data everytime so we dont break storyshots
const members = [{
  id: 1,
  name: "Mike King",
}, {
  id: 2,
  name: "Matt Wiseman",
}]

storiesOf('Job List', module)
  .addDecorator(withKnobs)
  .addDecorator(StoryRouter())

  .add('Job Card New', (() => {
    const currentJob = {
      ...fakeJob(),
      status: number('Status', 1)
    }
    const story = (
        <AssessmentJobCard
          currentJob={currentJob}
          updateStatus={action('Update Status')}
          members={members}
        />
    )
    return story
  }))
  .add('Job Card In Progress', (() => {
    const currentJob = {
      ...fakeJob(),
      status: number('Status', 2)
    }
    const story = (
        <AssessmentJobCard
          currentJob={currentJob}
          updateStatus={action('Update Status')}
          members={members}
        />
    )
    return story
  }))

  .add('Job Card Completed', (() => {
    const currentJob = {
      ...fakeJob(),
      status: number('Status', 3)
    }
    const story = (
        <AssessmentJobCard
          currentJob={currentJob}
          updateStatus={action('Update Status')}
          members={members}
        />
    )
    return story
  }))

  .add('Job Card Picked Up', (() => {
    const currentJob = {
      ...fakeJob(),
      status: number('Status', 4)
    }
    const story = (
        <AssessmentJobCard
          currentJob={currentJob}
          updateStatus={action('Update Status')}
          members={members}
        />
    )
    return story
  }))

  .add('Job Card Cancelled', (() => {
    const currentJob = {
      ...fakeJob(),
      status: number('Status', 5)
    }
    const story = (
        <AssessmentJobCard
          currentJob={currentJob}
          updateStatus={action('Update Status')}
          members={members}
        />
    )
    return story
  }))