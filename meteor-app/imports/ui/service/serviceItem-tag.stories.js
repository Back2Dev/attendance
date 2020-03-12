import React from 'react'

import { storiesOf } from '@storybook/react'

import ServiceItemTag from './serviceItem-tag'

import { storiesData } from './service-data-stories'

console.log('servicedata from the item-tag stories', storiesData)

storiesOf('ServiceItemTag', module).add('ServiceItemTag', () => <ServiceItemTag data={data} />)
