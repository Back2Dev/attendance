import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import TagEdit from './edit'
import { ServiceContextProvider } from './service-context'
import storiesData from '/imports/test/service-data'

console.log('servicedata from the item-tag stories', storiesData)

storiesOf('Service', module).add('Edit', () => {
  return (
    <ServiceContextProvider {...storiesData}>
      <TagEdit />
    </ServiceContextProvider>
  )
})
