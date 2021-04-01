import React from 'react'
import { storiesOf } from '@storybook/react'
import Service from './service'
import storiesData from '/imports/test/service-data'

storiesOf('Service', module).add('Service', () => {
  return <Service tags={[]} serviceOptions={storiesData.data} totalPrice={0} />
})
