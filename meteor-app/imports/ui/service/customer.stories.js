import React from 'react'
import { storiesOf } from '@storybook/react'
// import { action } from '@storybook/addon-actions'
import { ServiceContextProvider } from './service-context'
import storiesData from '/imports/test/service-data'

import Client from './customer'

storiesOf('Service', module).add('Customer details', () => {
  return (
    <ServiceContextProvider {...storiesData}>
      <Client key="customer-form" />
    </ServiceContextProvider>
  )
})
