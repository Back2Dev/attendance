import React, { Component } from 'react'
import { storiesOf } from '@storybook/react'
import { ServiceContextProvider } from './service-context'
import Search from './search'

import storiesData from '/imports/test/service-data'

console.log('servicedata from the  search stories', storiesData)

storiesData.serviceItems = storiesData.data

storiesOf('Service', module).add('Search', () => {
  return (
    <ServiceContextProvider {...storiesData}>
      <Search></Search>
    </ServiceContextProvider>
  )
})
