import React from 'react'
import { storiesOf } from '@storybook/react'
import Tag from './tag'
import storiesData from '/imports/test/service-data'
import { action } from '@storybook/addon-actions'

console.log('servicedata from the item-tag stories', storiesData)

storiesOf('Service', module).add('Tag', () => {
  return (
    <Tag
      tags={storiesData.tags}
      removeTag={action('removeTag')}
      toggleTag={action('toggleTag')}
      majorMinorTotal={action('major/minor total')}
      totalPrice={storiesData.totalPrice}
    />
  )
})
