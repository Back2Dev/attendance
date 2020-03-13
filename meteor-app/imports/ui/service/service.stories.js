import React from 'react'
import { storiesOf } from '@storybook/react'
import Service from './service'
import storiesData from './service-data-stories'

storiesOf('Service', module).add('Service', () => {
  return <Service tags={[]} data={storiesData.data} totalServicePrice={0} />
})
