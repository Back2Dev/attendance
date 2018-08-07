
import React from 'react'
import { Button } from 'semantic-ui-react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import printJobCard from './assessment-print-job'


storiesOf('Assessment.PrintJobCard', module)

  .add('Print Job Card', (() => {

    const story = (
      <div>
        <Button
          onClick={ action("Print Job Card")}> Print Job </Button> 
      </div>
    )
    return story
  }))