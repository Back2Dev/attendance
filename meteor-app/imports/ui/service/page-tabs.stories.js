import React from './react'

import { storiesOf } from './@storybook/react'
// import { action } from '@storybook/addon-actions'

import TabbedPages from './page-tabs'

storiesOf('TabbedPages', module).add('TabbedPages', () => <TabbedPages />)
