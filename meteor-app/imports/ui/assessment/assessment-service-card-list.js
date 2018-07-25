import React, { Component } from 'react'
import { Header, Grid, Button } from 'semantic-ui-react'
import ServiceCard from '../assessment/assessment-service-card'

class ServiceList extends Component {
    render() {
        const minorService = ["Check functionality/adjust brakes & gears", "Check hubs for wear/play", "Remove, clean & oil chain", "Clean rear cassette", "Check tyre pressure", "Lube deraileurs", "Check/tighten bolts on cranks, headset, wheels and bottom bracket", "Check/tighten bolts on cranks, headset, wheels and bottom bracket" ]

        const majorService = ["Check wheels are true", "Clean and re-grease wheel bearings", "Clean and re-grease headset", "Clean and re-grease bottom bracket", "Clean and re-grease seat post & clamps"]

        const minorServiceTitle = "Minor Serivce"
        const minorServicePrice = "60"
        const majorServiceTitle = "Major Serivce"
        const majorServicePrice = "120"

        return (
            <>
            <Grid.Row columns={2} centered>
                <Header as="h2" textAlign='center'>
                    Select Base Assessment
                </Header>
                <Grid.Column textAlign='center' tablet={6} computer={6} style={{margin: "0"}}>
                    <ServiceCard
                        onClick={this.props.selectMinor}
                        serviceChoice= {minorService}
                        serviceTitle= {minorServiceTitle}
                        servicePrice= {minorServicePrice}
                        cardColor="#00C646"
                    />
                </Grid.Column>
                <Grid.Column textAlign='center' tablet={6} computer={6} style={{margin: "0"}}>
                    <ServiceCard
                        onClick={this.props.selectMajor}
                        serviceChoice= {majorService}
                        serviceTitle= {majorServiceTitle}
                        servicePrice= {majorServicePrice}
                        cardColor="#0081D3"
                    />
                </Grid.Column>
                <Grid.Column width={6}>
                    <Button size='big' fluid secondary onClick={this.props.selectCustomService}>Custom Service</Button>
                </Grid.Column>
            </Grid.Row>
            </>
        )
    }

}

export default ServiceList
