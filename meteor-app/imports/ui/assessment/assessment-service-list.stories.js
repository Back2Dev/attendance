import React from 'react'
import { Header, Grid, Button } from 'semantic-ui-react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import ServiceList from './assessment-service-list'
import ServiceCard from './assessment-service-card'


const minorService = ["Check functionality/adjust brakes & gears", "Check hubs for wear/play", "Remove, clean & oil chain", "Clean rear cassette", "Check tyre pressure", "Lube deraileurs", "Check/tighten bolts on cranks, headset, wheels and bottom bracket", "Check/tighten bolts on cranks, headset, wheels and bottom bracket" ]

const majorService = ["Check wheels are true", "Clean and re-grease wheel bearings", "Clean and re-grease headset", "Clean and re-grease bottom bracket", "Clean and re-grease seat post & clamps"]

const minorServiceTitle = "Minor Serivce"
const minorServicePrice = "60"
const majorServiceTitle = "Major Serivce"
const majorServicePrice = "120"


storiesOf('Assessment.ServiceList', module)

    .add('Service List', (() => {

        const story = (
        <div>
            <Header as="h2" textAlign='center'>
                Select Base Assessment
            </Header>

            <Grid divided='vertically'>
                <Grid.Row columns={2} stretched>
                <Grid.Column textAlign='center' tablet={5} computer={5} floated='right'>
                    <ServiceCard
                        serviceChoice= {minorService}
                        serviceTitle= {minorServiceTitle}
                        servicePrice= {minorServicePrice}
                        cardColor="#00C646"
                    />
                </Grid.Column>
                <Grid.Column textAlign='center' tablet={5} computer={5} floated='left'>
                    <ServiceCard
                        serviceChoice= {majorService}
                        serviceTitle= {majorServiceTitle}
                        servicePrice= {majorServicePrice}
                        cardColor="#0081D3"
                    />
                </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={1} centered>
                    <Grid.Column width={6}>
                        <Button size='big' fluid secondary>Custom Service</Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>   
        </div>
        )
        return story
    }))