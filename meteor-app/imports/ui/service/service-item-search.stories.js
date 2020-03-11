import React, { Component } from 'react'
import { storiesOf } from '@storybook/react'
import SearchBar from './service-item-search'

import { storiesData } from './service-data-stories'

console.log('servicedata from the  search stories', storiesData)

storiesOf('SearchBar', module).add('SearchBar', () => <SearchBar data={data} />)
