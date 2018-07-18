
import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Card, List, Icon } from 'semantic-ui-react'

class ServiceCard extends Component {
    
render(){
    const { serviceTitle, serviceChoice} = this.props
    return (
        <Card>
            <Card.Content>
                <Card.Header >
                    {serviceTitle}
                </Card.Header>
                
                {
                serviceTitle == "Major Serivce" &&
                <div> 
                    <List.Item style={{paddingTop: "10px"}}>
                        <Icon name="star outline"/>
                        Includes everything from a minor service 
                    </List.Item>
                    <List.Item style={{textAlign: "center"}} as='h3'>
                        PLUS
                    </List.Item>
                </div>
                } 

                <List>
                    {serviceChoice.map(service =>
                        <List.Item style={{padding: "10px"}}>
                            <Icon name="wrench"/>{service}
                        </List.Item> 
                    )}
                </List>    
            </Card.Content>
        </Card >
    )
}

}
ServiceCard.propTypes = {
    serviceTitle: PropTypes.string.isRequired,
    serviceChoice: PropTypes.array.isRequired
};

export default ServiceCard