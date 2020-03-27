import React, { Component } from 'react'
import { storiesOf } from '@storybook/react'
import { ServiceContextProvider } from './service-context'
import SearchBar from './service-item-search-container'

import storiesData from '/imports/test/service-data'

console.log('servicedata from the  search stories', storiesData)

storiesOf('Service', module).add('SearchBar', () => {
  return (
    <ServiceContextProvider {...storiesData}>
      <SearchBar></SearchBar>
    </ServiceContextProvider>
  )
})
