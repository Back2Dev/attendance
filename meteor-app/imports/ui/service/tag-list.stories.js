import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import storiesData from '/imports/test/service-data'
import TagList from './tag-list'

// const { tags } = storiesData
const tags = [
  { name: 'Major Service', price: 20, code: 'O', category: 'service' },
  { name: 'Rear Tyre (second hand)', price: 5, code: 'R', category: 'tyre', used: true }
]

storiesOf('Service', module).add('Tag List', () => (
  <TagList
    removeTag={id => action('removeTag')(id)}
    toggleTag={id => action('toggleTag')(id)}
    tags={tags}
    majorMinorTotal={id => action('majorMinorTotal')(id)}
    totalPrice={199}
    toggleExpand={id => action('toggleExpand')(id)}
  />
))
