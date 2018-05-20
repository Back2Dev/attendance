import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Form from "react-jsonschema-form-semanticui";
import { Button, Icon, Grid, Container, Step } from 'semantic-ui-react'
import Details from './member-add-details'
import Emergency from './member-add-emergency'
import Other from './member-add-other'

class MemberAdd extends Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 1,
      formData: {}
    }
  }

  onSubmit = () => {

  }

  onSubmit = ({formData}) => {
    this.setState({
      formData: {
        ...this.state.formData,
        ...formData,
      },
      step: this.state.step + 1
    })
  }

  backStep = () => {
    this.setState({
      step: this.state.step - 1
    })
  }


  renderStep = () => {
    switch (this.state.step) {
      case 1:
        return <Other formData={this.state.formData} onSubmit={this.onSubmit} />
      case 2:
        return <Details formData={this.state.formData} onSubmit={this.onSubmit} />
      case 3:
        return <Emergency formData={this.state.formData} onSubmit={this.onSubmit} />
      default:
        return <p>Done</p>
        break;
    }
  }
  render() {

    return (
      <Grid>
        <Grid.Row centered>
          <Step.Group ordered>
            <Step completed={(this.state.step > 1)}>
              <Step.Content>
                <Step.Title>Why would you like to join us?</Step.Title>
                <Step.Description>Tell us a bit more about yourself</Step.Description>
              </Step.Content>
            </Step>
            <Step completed={(this.state.step > 2)}>
              <Step.Content>
                <Step.Title>Emergency Contact</Step.Title>
                <Step.Description>Just in case</Step.Description>
              </Step.Content>
            </Step>
            <Step completed={(this.state.step > 3)}>
              <Step.Content>
                <Step.Title>Your Details</Step.Title>
                <Step.Description>Contact Details</Step.Description>
              </Step.Content>
            </Step>
          </Step.Group>
        </Grid.Row>
        <Grid.Row centered>
          <Grid.Column style={{ maxWidth: '500px' }}>

            {
              this.renderStep()
            }
            {
              (this.state.step > 1) &&
              <Button floated='left' onClick={this.backStep}>
                <Icon name='arrow left' />
                Back
              </Button>
            }
            {
              (this.state.step < 3) &&
              <Button floated='right' onClick={this.nextStep} >
                Next
              <Icon name='arrow right' />
              </Button>
            }
            {
              (this.state.step == 3) &&
              <Button floated='right' positive onClick={this.onSubmit}>
                Submit
                </Button>

            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }

}

MemberAdd.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default MemberAdd