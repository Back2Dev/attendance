import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withKnobs, number } from '@storybook/addon-knobs/react'
import StoryRouter from 'storybook-router'
import faker from 'faker'
import AssessmentJobCard from './assessment-job-card'
import { fakeJob } from '/imports/test/fake-data'
import { LOG_EVENT_TYPES, JOB_STATUS, NEW_JOB, STATUS_UPDATE } from '/imports/api/constants'

faker.seed(888)

// this ensures we get the same random data everytime so we dont break storyshots
const members = [{
  id: 1,
  name: "Mike King",
}, {
  id: 2,
  name: "Matt Wiseman",
}]

storiesOf('Job Card', module)
.addDecorator(withKnobs)
.addDecorator(StoryRouter())

.add('Job Card New', (() => {
  const currentJob = {
    ...fakeJob(),
    status: number('Status', JOB_STATUS.NEW)
  }

  const logs = [{
    _id: 123,
    user: 'Mike',
    aId: currentJob._id,
    status: JOB_STATUS.NEW,
    eventType: LOG_EVENT_TYPES.NEW_JOB,
    data: 'test log',
    createdAt: new Date('2018-09-01')
  }]

  const story = (
    <AssessmentJobCard
          currentJob={currentJob}
          updateStatus={action('Update Status')}
          members={members}
          logs={logs}
          job={currentJob}
        />
    )
    return story
  }))
  .add('Job Card In Progress', (() => {
    const currentJob = {
      ...fakeJob(),
      status: number('Status', JOB_STATUS.IN_PROGRESS)
    }
    const logs = [{
      _id: 456,
      user: 'Mike',
      aId: currentJob._id,
      status: JOB_STATUS.IN_PROGRESS,
      eventType: LOG_EVENT_TYPES.STATUS_UPDATE,
      data: 'test log',
      createdAt: new Date('2018-09-01')
    }]
    const story = (
        <AssessmentJobCard
          currentJob={currentJob}
          updateStatus={action('Update Status')}
          members={members}
          logs={logs}
          job={currentJob}
        />
    )
    return story
  }))

  .add('Job Card Quality Check', (() => {
    const currentJob = {
      ...fakeJob(),
      status: number('Status', JOB_STATUS.QUALITY_CHECK)
    }
    const logs = [{
      _id: 789,
      user: 'Mike',
      aId: currentJob._id,
      status: JOB_STATUS.QUALITY_CHECK,
      eventType: LOG_EVENT_TYPES.STATUS_UPDATE,
      data: 'test log',
      createdAt: new Date('2018-09-01')
    }]
    const story = (
        <AssessmentJobCard
          currentJob={currentJob}
          updateStatus={action('Update Status')}
          members={members}
          logs={logs}
          job={currentJob}
        />
    )
    return story
  }))

  .add('Job Card Ready For Pick Up', (() => {
    const currentJob = {
      ...fakeJob(),
      status: number('Status', JOB_STATUS.READY_FOR_PICK_UP)
    }
    const logs = [{
      _id: 101,
      user: 'Mike',
      aId: currentJob._id,
      status: JOB_STATUS.READY_FOR_PICK_UP,
      eventType: LOG_EVENT_TYPES.STATUS_UPDATE,
      data: 'test log',
      createdAt: new Date('2018-09-01')
    }]
    const story = (
        <AssessmentJobCard
          currentJob={currentJob}
          updateStatus={action('Update Status')}
          members={members}
          logs={logs}
          job={currentJob}
        />
    )
    return story
  }))

  .add('Job Card Picked Up', (() => {
    const currentJob = {
      ...fakeJob(),
      status: number('Status', JOB_STATUS.PICKED_UP)
    }
    const logs = [{
      _id: 112,
      user: 'Mike',
      aId: currentJob._id,
      status: JOB_STATUS.PICKED_UP,
      eventType: LOG_EVENT_TYPES.STATUS_UPDATE,
      data: 'test log',
      createdAt: new Date('2018-09-01')
    }]
    const story = (
        <AssessmentJobCard
          currentJob={currentJob}
          updateStatus={action('Update Status')}
          members={members}
          logs={logs}
          job={currentJob}
        />
    )
    return story
  }))

  .add('Job Card Cancelled', (() => {
    const currentJob = {
      ...fakeJob(),
      status: number('Status', JOB_STATUS.CANCELLED)
    }
    const logs = [{
      _id: 131,
      user: 'Mike',
      aId: currentJob._id,
      status: JOB_STATUS.CANCELLED,
      eventType: LOG_EVENT_TYPES.STATUS_UPDATE,
      data: 'test log',
      createdAt: new Date('2018-09-01')
    }]
    const story = (
        <AssessmentJobCard
          currentJob={currentJob}
          updateStatus={action('Update Status')}
          members={members}
          logs={logs}
          job={currentJob}
        />
    )
    return story
  }))