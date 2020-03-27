import React from 'react'
import { storiesOf } from '@storybook/react'
import Summary from './summary'
import { action } from '@storybook/addon-actions'
import { fakeJob } from '/imports/test/fake-data'
import { withKnobs, number } from '@storybook/addon-knobs/react'
import { LOG_EVENT_TYPES, JOB_STATUS, NEW_JOB, STATUS_UPDATE } from '/imports/api/constants'

const members = [
  {
    id: 1,
    name: 'Mike King'
  },
  {
    id: 2,
    name: 'Matt Wiseman'
  }
]

const currentJob = {
  ...fakeJob(),
  status: number('Status', JOB_STATUS.NEW)
}

const logs = [
  {
    _id: 123,
    user: 'Mike',
    aId: currentJob._id,
    status: JOB_STATUS.NEW,
    eventType: LOG_EVENT_TYPES.NEW_JOB,
    data: 'test log',
    createdAt: new Date('2018-09-01')
  }
]

storiesOf('Service', module).add('Summary tab', () => (
  <Summary
    key={currentJob._id}
    currentJob={currentJob}
    updateStatus={action('Update Status')}
    members={members}
    logs={logs}
    job={currentJob}
  />
))
