import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { Card } from 'semantic-ui-react'
import PunchCard from './punch-card'

storiesOf('Punch-card', module).add('Punchcard', () => <PunchCard />)
