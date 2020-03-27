import React from 'react'
import { storiesOf } from '@storybook/react'
import ServiceItemTag from './service-item-tag'
import storiesData from '/imports/test/service-data'
import { action } from '@storybook/addon-actions'

console.log('servicedata from the item-tag stories', storiesData)

storiesOf('Service', module).add('ServiceItemTag', () => {
  return (
    <ServiceItemTag
      tags={storiesData.tags}
      removeTag={action('removeTag')}
      toggleTag={action('toggleTag')}
      majorMinorTotal={action('major/minor total')}
      totalServicePrice={5000}
    />
  )
})
