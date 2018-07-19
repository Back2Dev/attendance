import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Card, List, Icon, Button } from 'semantic-ui-react'

class ServiceCard extends Component {

render(){
    const { serviceTitle, serviceChoice, servicePrice, cardColor, onClick } = this.props
    return (
        <Button style={{backgroundColor: "white", minWidth: "100%"}}>
        <Card style={{backgroundColor: cardColor, color: "white", minWidth: "100%"}}>
             
            <Card.Content style={{width: "100%", minHeight: "460px"}} onClick={() => onClick()}>
                <Card.Header style={{color: "white", paddingTop: "15px", fontSize: "1.5em"}} >
                    {`${serviceTitle} $${servicePrice}`}
                </Card.Header>
                
                {
                serviceTitle == "Major Serivce" &&
                <div> 
                    <List.Item style={{paddingTop: "10px", color: "white"}}>
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
            </Button>
    )
}
