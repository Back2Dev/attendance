import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Grid, Segment } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import Form from "react-jsonschema-form-semanticui"
import Alert from 'react-s-alert'

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
        if (prop === 'pickUpDate') return // Prevent this from showing in initial state to allow default value
        const type = step.schema.properties[prop].type
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
      costData: {
        serviceCost: 0,
        partsCost: 0,
        additionalCost: 0,
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.step - prevState.step > 0) {
      window.scrollTo(0, 0)
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
        const formattedParts = formData.parts.map(item => item.replace(/ \(\$\w+\)/, '').trim())
        return formattedParts.includes(key.name) ? key.price : 0 // Think about how to refactor this
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
          const formattedParts = formData.parts.map(item => item.replace(/ \(\$\w+\)/, '').trim())
          return formattedParts.includes(key.name) ? key.price : 0
        })
        .map(key => {
          return {
            name: key.name, 
            price: key.price
          }
        })
      const custName = formData.b2bRefurbish ? 'back2bikes' : formData.name.toLowerCase()
      const search = custName + formData.email + formData.bikeMake.toLowerCase() + formData.bikeColor.toLowerCase()
      // Structuring form submission to match collection schema
      const formResult = {
        customerDetails: {
          name: custName,
          phone: formData.phone,
          email: formData.email,
          refurbishment: formData.b2bRefurbish,
        },
        bikeDetails: {
          make: formData.bikeMake.toLowerCase(),
          model: formData.bikeModel.toLowerCase(),
          color: formData.bikeColor.toLowerCase(),
          bikeValue: formData.approxBikeValue * 100, // Value in cents
          sentimentValue: formData.sentimentalValue,
        },
        services: {
          serviceItem: serviceItem,
          totalServiceCost: totalServiceCost,
          baseService: formData.package,
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
        comment: formData.comments.toLowerCase(),
        temporaryBike: formData.replacementBike,
        status: 1, // Default to 1: New Order
        search: search,
      }

      await this.props.setAssessment(formResult)
      this.setState({
        step: this.state.step + 1,
        progress: this.state.progress + 1
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
        step: prevState.step === prevState.progress || prevState.step < prevState.progress  ? this.state.step + 1 : prevSate.step,
        progress: prevState.progress === prevState.step ? this.state.progress + 1 : prevState.progress,
      }
    })
  }

  backStep = () => {
    this.setState({
      step: this.state.step - 1
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
    const minorServicesCost = this.props.services
    .filter(item => {
      return item.package === 'Minor'
    })
    .map(key => {
      return key.price
    })
    .reduce((a, b) => a + b)
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        services: minorServices,
        package: "Minor Service Package"
      },
      costData: {
        serviceCost: minorServicesCost,
        partsCost: prevState.costData.partsCost,
        additionalCost: prevState.costData.additionalCost,
        estBikeValue: prevState.formData.approxBikeValue
      },
      step: prevState.step === prevState.progress || prevState.step < prevState.progress  ? this.state.step + 1 : prevSate.step,
      progress: prevState.progress === prevState.step ? this.state.progress + 1 : prevState.progress,
    }))
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
    const majorServicesCost = this.props.services
    .filter(item => {
      return item.package === 'Major' || item.package === 'Minor'
    })
    .map(key => {
      return key.price
    })
    .reduce((a, b) => a + b)
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        services: majorServices,
        package: "Major Service Package"
      },
      costData: {
        serviceCost: majorServicesCost,
        partsCost: prevState.costData.partsCost,
        additionalCost: prevState.costData.additionalCost,
        estBikeValue: prevState.formData.approxBikeValue
      },
      step: prevState.step === prevState.progress || prevState.step < prevState.progress  ? this.state.step + 1 : prevSate.step,
      progress: prevState.progress === prevState.step ? this.state.progress + 1 : prevState.progress,
    }))
  }

  selectCustomService = () => {
    const formData = mapSchemaToState(schemas)
    this.setState((prevState) => ({
      formData: {
        ...formData,
        services: [],
        package: "Custom Services"
      },
      costData: {
        serviceCost: 0,
        partsCost: prevState.costData.partsCost,
        additionalCost: prevState.costData.additionalCost,
        estBikeValue: prevState.formData.approxBikeValue
      },
      step: prevState.step === prevState.progress || prevState.step < prevState.progress  ? this.state.step + 1 : prevSate.step,
      progress: prevState.progress === prevState.step ? this.state.progress + 1 : prevState.progress,
    }))
  }

  goToStep = (step) => {
    if (step <= this.state.progress) {
      this.setState({
        step
      })
    }
  }

  handleFormChange = data => {
    const formData = data.formData
    const totalServiceCost = this.props.services
      .map(key => {
        return formData.services.includes(key.name) ? key.price : 0
      })
      .reduce((a, b) => a + b)
    const totalPartsCost = this.props.serviceItems
      .map(key => {
        const formattedParts = formData.parts.map(item => item.replace(/ \(\$\w+\)/, '').trim())
        return formattedParts.includes(key.name) ? key.price : 0
      })
      .reduce((a, b) => a + b)
    this.setState({
      formData: {
        ...formData
      },
      costData: {
        serviceCost: totalServiceCost,
        partsCost: totalPartsCost,
        additionalCost: formData.additionalFee,
        estBikeValue: formData.approxBikeValue
      }
    })
  }
  
  forwardStep = () => {
    this.setState({
      step: this.state.step + 1,
      progress: this.state.progress + 1
    })
  }

  renderForm = () => {
    schemas[1].schema.properties.services.items.enum = this.props.services.map(key => key.name)
    schemas[1].schema.properties.assessor.enum = this.props.members.map(key => key.name)
    schemas[2].schema.properties.parts.items.enum = this.props.serviceItems.map(key => `${key.name} ($${key.price/100})`)

    // Default one week later for pickup date
    const date = new Date()
    const dateOneWeekLater = new Date(date.setDate(date.getDate() + 7))
    const formattedDate = moment(dateOneWeekLater).format('YYYY-MM-DD')
    schemas[2].schema.properties.pickUpDate.default = formattedDate
    const data = this.state.costData
    const showPrice = this.state.step === 1 || this.state.step === 2

    return (
      <>
        {
          showPrice &&
          <Segment padded='very' >
            <h2>
              Total Price
            </h2>
            <div>
              <div><strong>Estimated Bike Value: ${data.estBikeValue || 0}</strong></div>
              <div>Total Service Cost: ${data.serviceCost/100}</div>
              <div>Total Parts Cost: ${data.partsCost/100}</div>
              <div>Additional Fee: ${data.additionalCost}</div>
              <div style={{borderTop: "1px solid black", margin: "5px 0px", padding: "5px 0px"}}><strong>Total Price = ${(data.serviceCost/100) + (data.partsCost/100) + (data.additionalCost)}</strong></div>
            </div>
          </Segment>
        }
        <Form
          schema={schemas[this.state.step].schema}
          uiSchema={schemas[this.state.step].uiSchema}
          formData={this.state.formData}
          onSubmit={this.onSubmit}
          showErrorList={false} 
          onChange={this.handleFormChange}
        >
          <Control
            backStep={this.backStep}
            step={this.state.step}
            totalSteps={schemas.length}
            onSubmit={f => f}
          />
        </Form>
      </>)
  }

  render() {
    const reviewStep = this.state.step == 3
    const serviceSelectorStep = this.state.step == 0
    const orderSubmittedStep = this.state.step == 5
    return (
    <Grid divided='vertically' stackable>
      <Alert stack={{limit: 3}} />
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
            services={this.props.services}
            />   
        }
        {
          reviewStep &&
          <Grid.Row centered>
            <Grid.Column mobile={14} style={{ maxWidth: '600px' }}>
              <AssessmentAddReview
                formData={this.state.formData}
                steps={schemas}
                goToStep={this.goToStep}
              />
              <Control
                backStep={this.backStep}
                step={this.state.step}
                totalSteps={schemas.length}
                forwardStep={this.forwardStep}
              />
            </Grid.Column>
          </Grid.Row>
        }
        {
          orderSubmittedStep &&

            <Congratulations
            formData={this.state.formData}
            assessmentLastSaved={this.props.assessmentLastSaved}
            />
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