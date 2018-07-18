import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import ServiceList from './assessment-service-list'

storiesOf('Assessment.ServiceList', module)
    .add('Service List', () => (
        <div>
            <ServiceList>    
            </ServiceList>
            <button onClick={action('clicked')}> CLICK ME! 
            </button>
        </div>
    ))