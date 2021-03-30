import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withKnobs, number } from '@storybook/addon-knobs/react'
import JobCard from './assessment-job-card'
import { fakeJob } from '/imports/test/fake-data'
import { Grid } from 'semantic-ui-react'

// this ensures we get the same random data everytime so we dont break storyshots
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

storiesOf('Job List', module)
  .addDecorator(withKnobs)

  .add('Job Card List', () => {
    const currentJob1 = {
      ...fakeJob(123),
      status: number('Status', 1)
    }
    const currentJob2 = {
      ...fakeJob(234),
      status: number('Status', 2)
    }
    const currentJob3 = {
      ...fakeJob(456),
      status: number('Status', 4)
    }

    const logs = [
      {
        _id: 567,
        user: 'Mike',
        aId: currentJob3._id,
        status: 3,
        eventType: 22,
        data: 'test log',
        createdAt: new Date('2018-09-01')
      }
    ]

    const story = (
      <Grid style={{ marginLeft: '50px', marginRight: '50px' }}>
        <Grid.Row centered>
          <h1>Current Jobs</h1>
        </Grid.Row>
        <Grid.Row>
          <JobCard
            currentJob={currentJob3}
            key={currentJob3._id}
            updateStatus={action('Update Status')}
            members={members}
            logs={logs}
            job={currentJob3}
          />
        </Grid.Row>
        <Grid.Row>
          <JobCard
            key={currentJob2._id}
            currentJob={currentJob2}
            updateStatus={action('Update Status')}
            members={members}
            logs={logs}
            job={currentJob2}
          />
        </Grid.Row>
        <Grid.Row>
          <JobCard
            key={currentJob1._id}
            currentJob={currentJob1}
            updateStatus={action('Update Status')}
            members={members}
            logs={logs}
            job={currentJob1}
          />
        </Grid.Row>
        <Grid.Row>
          <JobCard
            key={currentJob3._id}
            currentJob={currentJob3}
            updateStatus={action('Update Status')}
            members={members}
            logs={logs}
            job={currentJob3}
          />
        </Grid.Row>
      </Grid>
    )
    return story
  })
