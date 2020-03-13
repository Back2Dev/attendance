import React from 'react'

import { storiesOf } from '@storybook/react'
// import { action } from '@storybook/addon-actions'

import Client from './client'

storiesOf('Service.client', module).add('client', () => <Client />)
