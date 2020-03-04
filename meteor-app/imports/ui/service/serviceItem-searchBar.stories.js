import React, { Component } from './react'
import { storiesOf } from './@storybook/react'
import { action } from './@storybook/addon-actions'
import SearchBar from './serviceItem-searchBar'
import faker from 'faker'

export const task = {
  id: '1123',
  title: 'Test task',
  state: 'TASK_INBOX',
  updateAt: new Date(2018, 0, 1, 9, 0)
}

export const actions = {
  onPinTask: action('onPinTask123'),
  onArchiveTask: action('onArchiveTask')
}

const source = _.times(5, () => ({
  title: faker.company.companyName(),
  description: faker.company.catchPhrase(),
  image: faker.internet.avatar(),
  price: faker.finance.amount(0, 100, 2, '$')
}))

storiesOf('task', module).add('default', () => <SearchBar source={source} />)
