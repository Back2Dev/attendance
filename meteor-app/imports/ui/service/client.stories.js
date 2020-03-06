import React from 'react'

import { storiesOf } from '@storybook/react'
// import { action } from '@storybook/addon-actions'

import client from './clientOP2'

storiesOf('TabbedPages', module).add('client', () => <client />)
