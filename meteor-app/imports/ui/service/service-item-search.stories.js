import React, { Component } from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import SearchBar from './service-item-search'

import storiesData from './service-data-stories'

console.log('servicedata from the  search stories', storiesData)

storiesOf('Service', module).add('SearchBar', () => {
  return (
    <>
      Note: Entering text won't do a search, because the parent component is responsible for that
      <SearchBar
        handleResultSelect={action('select result')}
        handleSearchChange={action('search change')}
        results={[]}
        value=""
      />
    </>
  )
})
