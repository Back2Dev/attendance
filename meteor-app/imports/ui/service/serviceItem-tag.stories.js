import React from 'react'

import { storiesOf } from '@storybook/react'
// import { action } from '@storybook/addon-actions'

import ServiceItemTag from './serviceItem-tag'

const data = [
  { title: 'item1', isMajMin: false },
  { title: 'item2', isMajMin: false },
  { title: 'item3', isMajMin: false },
  { title: 'item4', isMajMin: false },
  { title: 'item5', isMajMin: false },
  { title: 'item6', isMajMin: false },
  { title: 'item6', isMajMin: false },
  { title: 'item7', isMajMin: false },
  { title: 'item8', isMajMin: false },
  { title: 'item9', isMajMin: false },
  { title: 'item10', isMajMin: false },
  { title: 'item11', isMajMin: false },
  { title: 'item12', isMajMin: false },
  { title: 'item13', isMajMin: false },
  { title: 'item14', isMajMin: false },
  { title: 'item15', isMajMin: false },
  { title: 'item16', isMajMin: false },
  { title: 'item17', isMajMin: false },
  {
    title: 'Major Service',
    isMajMin: true,
    items: [
      { title: 'mj1', greyed: false },
      { title: 'mj2', greyed: false },
      { title: 'mj3', greyed: false },
      { title: 'mj4', greyed: false },
      { title: 'mj5', greyed: false },
      { title: 'mj6', greyed: false },
      { title: 'mj7', greyed: false },
      { title: 'mj8', greyed: false },
      { title: 'mj19', greyed: false },
      { title: 'mj10', greyed: false },
      { title: 'mj11', greyed: false },
      { title: 'mj12', greyed: false },
      { title: 'mj13', greyed: false },
      { title: 'mj14', greyed: false },
      { title: 'mj15', greyed: false },
      { title: 'mj16', greyed: false },
      { title: 'mj17', greyed: false },
      { title: 'mj18', greyed: false }
    ]
  },
  {
    title: 'Minor Service',
    isMajMin: true,
    items: [
      { title: 'mn1', greyed: false },
      { title: 'mn2', greyed: false },
      { title: 'mn3', greyed: false },
      { title: 'mn4', greyed: false },
      { title: 'mn5', greyed: false },
      { title: 'mn6', greyed: false },
      { title: 'mn7', greyed: false },
      { title: 'mn8', greyed: false },
      { title: 'mn9', greyed: false },
      { title: 'mn10', greyed: false },
      { title: 'mn11', greyed: false },
      { title: 'mn12', greyed: false },
      { title: 'mn13', greyed: false },
      { title: 'mn14', greyed: false },
      { title: 'mn15', greyed: false },
      { title: 'mn16', greyed: false },
      { title: 'mn17', greyed: false },
      { title: 'mn18', greyed: false },
      { title: 'mn19', greyed: false },
      { title: 'mn20', greyed: false }
    ]
  }
]

storiesOf('ServiceItemTag', module).add('ServiceItemTag', () => <ServiceItemTag data={data} />)
