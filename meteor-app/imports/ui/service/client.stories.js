import React from 'react'
import { storiesOf } from '@storybook/react'
// import { action } from '@storybook/addon-actions'
import { ServiceContextProvider } from './service-context'
import storiesData from './service-data-stories'

import Client from './client'

storiesOf('Service', module).add('client', () => {
  return (
    <ServiceContextProvider {...storiesData}>
      <Client />
    </ServiceContextProvider>
  )
})
