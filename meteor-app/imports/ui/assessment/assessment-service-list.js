import React, { Component } from 'react'
import { Header, Grid, Button } from 'semantic-ui-react'
import ServiceCard from '../assessment/assessment-service-card'

class ServiceList extends Component {
    render() {
        const { services } = this.props
        
        const minorServices = services
        .filter(service => service.package === "Minor")
        .map(service => service.name)

        const majorServices = services
            .filter(service => service.package === "Major")
            .map(service => service.name)
        return (
            <>
            <Grid.Row columns={2} centered>
                <Header as="h2" textAlign='center'>
                    Select Base Assessment
                </Header>
                <Grid.Column textAlign='center' tablet={6} computer={6} style={{margin: "0"}}>
                    <ServiceCard
                        onClick={this.props.selectMinor}
                        serviceChoice= {minorServices}
                        serviceTitle= {"Minor Service"}
                        servicePrice= {"60"}
                        cardColor="#00C646"
                    />
                </Grid.Column>
                <Grid.Column textAlign='center' tablet={6} computer={6} style={{margin: "0"}}>
                    <ServiceCard
                        onClick={this.props.selectMajor}
                        serviceChoice= {majorServices}
                        serviceTitle= {"Major Service"}
                        servicePrice= {"120"}
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



