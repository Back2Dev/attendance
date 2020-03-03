import React, { Component } from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import SearchBar from './serviceItem-searchBar'

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

storiesOf('task', module).add('default', () => <SearchBar />)
