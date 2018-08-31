import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withKnobs, number } from '@storybook/addon-knobs/react'
import StoryRouter from 'storybook-router'
import AssessmentJobCard from './assessment-job-card'
import { fakeJob } from '/imports/test/fake-data'
import { Grid } from 'semantic-ui-react'

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

.add('Job Card List', (() => {
  const currentJob1 = {
    ...fakeJob(),
    status: number('Status', 1)
  }
  const currentJob2 = {
    ...fakeJob(),
    status: number('Status', 2)
  }
  const currentJob3 = {
    ...fakeJob(),
    status: number('Status', 4)
  }

  const logs = [{
    _id: 567,
    user: 'Mike',
    aId: currentJob3._id,
    status: 3,
    eventType: 22,
    data: 'test log'
  }]

  const story = (
    <Grid style={{marginLeft: "50px", marginRight: "50px" }}>
      <Grid.Row centered>
        <h1>Current Jobs</h1>
      </Grid.Row>
      <Grid.Row> 
      <AssessmentJobCard
            currentJob={currentJob3}
            updateStatus={action('Update Status')}
            members={members}
            logs={logs}
            job={currentJob3}
          />
      </Grid.Row>
      <Grid.Row> 
      <AssessmentJobCard
            currentJob={currentJob2}
            updateStatus={action('Update Status')}
            members={members}
            logs={logs}
            job={currentJob2}
          />
      </Grid.Row>
      <Grid.Row> 
      <AssessmentJobCard
            currentJob={currentJob1}
            updateStatus={action('Update Status')}
            members={members}
            logs={logs}
            job={currentJob1}
          />
      </Grid.Row>
      <Grid.Row> 
      <AssessmentJobCard
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
  }))