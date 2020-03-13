import React from 'react'
import { storiesOf } from '@storybook/react'
import ServiceItemTag from './serviceItem-tag'
import storiesData from './service-data-stories'
import { action } from '@storybook/addon-actions'

console.log('servicedata from the item-tag stories', storiesData)

storiesOf('Service', module).add('ServiceItemTag', () => {
  return (
    <ServiceItemTag
      tags={storiesData.tags}
      removeTag={action('removeTag')}
      toggleTag={action('toggleTag')}
      majorMinorTotal={5}
      totalServicePrice={5000}
    />
  )
})
