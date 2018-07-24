import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Header, Container } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import Form from "react-jsonschema-form-semanticui";
import Alert from 'react-s-alert';


import schemas from '/imports/ui/config/bike-assessment-schemas'
import Steps from '/imports/ui/assessment/assessment-add-steps'
import Control from '/imports/ui/assessment/assessment-add-control'
import ServiceList from '/imports/ui/assessment/assessment-service-list'
import Congratulations from '/imports/ui/assessment/assessment-congratulations'

import AssessmentAddReview from '/imports/ui/assessment/assessment-add-review'

const mapSchemaToState = schema => {
  // Filter through json form schema to filter out just the form fields
  return schema.reduce((state, step) => {
    Object.keys(step.schema.properties)
      .forEach(prop => {
        const type = Object.values(step.schema.properties[prop].type).join('')
        switch(type) {
          case 'string': 
            state[prop] = '';
            break;
          case 'integer':
            state[prop] = 0;
            break;
          case 'array':
            state[prop] = [];
            break;
          case 'boolean':
            state[prop] = false;
            break;
          default:
            state[prop] = null;
        }
      })
    return state
  }, {})
}

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

  onSubmit = async ({ formData }) => {
    const lastStep = this.state.step == 4

    const totalServiceCost = this.props.services
      .map(key => {
        if (!formData) { return 0 }
        return formData.services.includes(key.name) ? key.price : 0
      })
      .reduce((a, b) => a + b)
    const totalPartsCost = this.props.serviceItems
      .map(key => {
        if (!formData) { return 0 }
        return formData.parts.includes(key.name) ? key.price : 0
      })
      .reduce((a, b) => a + b)
    const totalCost = totalServiceCost + totalPartsCost + (formData ? formData.additionalFee * 100 : 0)
        
    if (lastStep) {
      const serviceItem = this.props.services
        .filter(key => {
          if (!formData) { return 0 }
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
          if (!formData) { return 0 }
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
      // Structuring form submission to match collection schema
      const formResult = {
        customerDetails: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          refurbishment: formData.b2bRefurbish,
        },
        bikeDetails: {
          make: formData.bikeMake,
          model: formData.bikeModel,
          color: formData.bikeColor,
          bikeValue: formData.approxBikeValue * 100, // Value in cents
          sentimentValue: formData.sentimentalValue,
        },
        services: {
          serviceItem: serviceItem,
          totalServiceCost: totalServiceCost,
        },
        parts: {
          partsItem: partsItem,
          totalPartsCost: totalPartsCost,
        },
        additionalFees: formData.additionalFee * 100, // Value in cents
        totalCost: totalCost,
        dropoffDate: new Date(),
        pickupDate: new Date(formData.pickUpDate),
        urgent: formData.requestUrgent,
        assessor: formData.assessor,
        mechanic: '',
        comment: formData.comments,
        temporaryBike: formData.replacementBike,
        status: 1, // Default to 1: New Order
        search: search,
      }

      await this.props.setAssessment(formResult)
      this.setState({
        step: this.state.step + 1
      })
      return
    }
    this.setState((prevState, props) => {
      return {
        formData: {
          ...prevState.formData,
          ...formData,
          serviceCost: totalServiceCost,
          partsCost: totalPartsCost,
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

  selectMinor = () => {
    const formData = mapSchemaToState(schemas)
    const minorServices = this.props.services
      .filter(item => {
        return item.package === 'Minor'
      })
      .map(key => {
        return key.name
      })
    this.setState({
      formData: {
        ...formData,
        services: minorServices,
        package: "Minor Service Package"
      },
      step: this.state.step + 1,
      progress: this.state.progress + 1
    })
  }

  selectMajor = () => {
    const formData = mapSchemaToState(schemas)
    const majorServices = this.props.services
      .filter(item => {
        return item.package === 'Major' || item.package === 'Minor'
      })
      .map(key => {
        return key.name
      })
    this.setState({
      formData: {
        ...formData,
        services: majorServices,
        package: "Major Service Package"
      },
      step: this.state.step + 1,
      progress: this.state.progress + 1
    })
  }

  selectCustomService = () => {
    const formData = mapSchemaToState(schemas)
    console.log(this.formData)
    this.setState({
      formData: {
        ...formData,
        services: [],
        package: "Custom Services"
      },
      step: this.state.step + 1,
      progress: this.state.progress + 1
    })
    console.log(this.formData)
  }

  goToStep = (step) => {
    // TODO: Might need to fix the next button & progress bug
    if (step <= this.state.progress) {
      this.setState({
        step,
      })
    }
  }

  renderForm = () => {
    schemas[1].schema.properties.services.items.enum = this.props.services.map(key => key.name)
    schemas[2].schema.properties.parts.items.enum = this.props.serviceItems.map(key => key.name)

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
    const serviceSelectorStep = this.state.step == 0
    const orderSubmittedStep = this.state.step == 5
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
            formData={this.state.formData}
            selectMinor={this.selectMinor}
            selectMajor={this.selectMajor}
            selectCustomService={this.selectCustomService}
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
          orderSubmittedStep &&
            <Congratulations />
        }
        {
          (!reviewStep && !serviceSelectorStep && !orderSubmittedStep) &&
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