import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Header } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import Form from "react-jsonschema-form-semanticui";
import Alert from 'react-s-alert';

import schemas from '/imports/ui/config/bike-assessment-schemas'
import Steps from '/imports/ui/assessment/assessment-add-steps'
import Control from '/imports/ui/assessment/assessment-add-control'
import ServiceList from '/imports/ui/assessment/assessment-service-list'

import AssessmentAddReview from '/imports/ui/assessment/assessment-add-review'

const mapSchemaToState = schema => (
  schema
    .reduce((state, step) => {
      Object.keys(step.schema.properties)
        .forEach(prop => state[prop] = undefined)
      return state
    }, {})
)

class AssessmentAdd extends Component {
  constructor(props) {
    super(props)
    this.state = {
      step: (props.step) ? props.step : 0,
      formData: mapSchemaToState(schemas),
      progress: 0,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    window.scrollTo(0, 0)

    const reviewStep = this.state.step == 3
    if (reviewStep && this.props.newId) {
      Alert.success(this.props.message);
      this.props.history.push(
        this.props.isIframe
          ? `/success/${this.props.newId}`
          : '/'
      )
    }
    if (reviewStep && this.props.error) {
      Alert.error(this.props.message);
    }
  }

  componentWillUnmount() {
    // prevents id from persisting between adding assessments
      this.props.resetId()
  }

  onSubmit = ({ formData }) => {
    const lastStep = this.state.step == 4
    
    if (lastStep) {
      const totalServiceCost = this.props.services
        .map(key => {
          return formData.services.includes(key.name) ? key.price : 0
        })
        .reduce((a, b) => a + b) || 0
      const totalPartsCost = this.props.serviceItems
        .map(key => {
          return formData.parts.includes(key.name) ? key.price : 0
        })
        .reduce((a, b) => a + b) || 0
      const totalCost = totalServiceCost + totalPartsCost + (formData.additionalFee || 0)

      const serviceItem = this.props.services
        .filter(key => {
          return formData.services.includes(key.name)
        })
        .map(key => {
          return {
            name: key.name, 
            price: key.price, 
            package: key.package
          }
        })
      const partsItem = this.props.serviceItems
        .filter(key => {
          return formData.parts.includes(key.name)
        })
        .map(key => {
          return {
            name: key.name, 
            price: key.price
          }
        })
      const search = formData.b2bRefurbish ? 
        'Refurbished Bike' : 
        (formData.name + formData.email + formData.bikeMake + formData.bikeColor)

      const formResult = {
        customerDetails: {
          name: formData.name || '',
          phone: formData.phone || '',
          email: formData.email || '',
          refurbishment: formData.b2bRefurbish || false,
        },
        bikeDetails: {
          make: formData.bikeMake || '',
          model: formData.bikeModel || '',
          color: formData.bikeColor || '',
          bikeValue: formData.approxBikeValue || '',
          sentimentValue: formData.sentimentalValue || false,
        },
        services: {
          serviceItem: serviceItem || [],
          totalServiceCost: totalServiceCost || 0,
        },
        parts: {
          partsItem: partsItem || [],
          totalPartsCost: totalPartsCost || 0,
        },
        additionalFees: formData.additionalFee || 0,
        totalCost: totalCost,
        dropoffDate: new Date().toLocaleDateString(),
        pickupDate: new Date(formData.pickUpDate).toLocaleDateString() || '',
        urgent: formData.requestUrgent || false,
        assessor: formData.assessor || '',
        mechanic: '',
        comment: formData.comment || '',
        temporaryBike: formData.replacementBike || false,
        status: 1,
        search: search,
      }
      console.log(formResult)
      this.props.setAssessment(formResult)
      return
    }
    this.setState((prevState, props) => {
      return {
        formData: {
          ...prevState.formData,
          ...formData,
        },
        step: prevState.step + 1,
        progress: prevState.progress + 1,
      }
    })
  }

  backStep = () => {
    this.setState({
      step: this.state.step - 1
    })
  }

  forwardStep = () => {
    this.setState({
      step: this.state.step + 1,
      progress: this.state.progress + 1
    })
  }

  goToStep = (step) => {
    if (step <= this.state.progress) {
      this.setState({
        step,
      })
    }
  }

  renderForm = () => {
    schemas[1].schema.properties.services.items.enum = this.props.services.map(key => key.name)
    schemas[2].schema.properties.parts.items.enum = this.props.serviceItems.map(key => key.name)
    console.log(this.state.step)
    return <Form
      schema={schemas[this.state.step].schema}
      uiSchema={schemas[this.state.step].uiSchema}
      formData={this.state.formData}
      onSubmit={this.onSubmit}
      showErrorList={false} 
      liveValidate={true}
    >
      <Control
        backStep={this.backStep}
        step={this.state.step}
        totalSteps={schemas.length}
        onSubmit={f => f}
      />
    </Form>
  }

  render() {

    const reviewStep = this.state.step == 3
    const finalStep = this.state.step == 5
    const serviceSelectorStep = this.state.step == 0
    return (
    <Grid divided='vertically' stackable>
      <Grid.Row centered>
        <Steps
          step={this.state.step}
          steps={schemas}
          goToStep={this.goToStep}
          progress={this.state.progress}
        />
      </Grid.Row>
        {
          serviceSelectorStep &&
            <ServiceList 
            onClick={this.forwardStep}
            />   
        }
        {
          reviewStep &&
          // this needs refactoring
          <Grid.Row centered>
            <Grid.Column mobile={14} style={{ maxWidth: '600px' }}>
              <AssessmentAddReview
                formData={this.state.formData}
                steps={schemas}
                goToStep={this.goToStep}
              />
              <Control
                backStep={this.backStep}
                forwardStep={this.forwardStep}
                step={this.state.step}
                totalSteps={schemas.length}
                onSubmit={this.onSubmit}
              />
            </Grid.Column>
          </Grid.Row>
        }
        {
          finalStep &&
          <div>
            Submitted
          </div>
        }
        {
          !finalStep && !reviewStep && !serviceSelectorStep &&
          <Grid.Row centered>
            <Grid.Column mobile={14} style={{ maxWidth: '600px' }}>
              {this.renderForm()}
            </Grid.Column>
          </Grid.Row>
        }
    </Grid>
    )
  }
}

AssessmentAdd.propTypes = {
  setAssessment: PropTypes.func.isRequired,
  resetId: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
}

export default withRouter(AssessmentAdd)