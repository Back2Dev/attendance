import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import Form from "react-jsonschema-form-semanticui";
import Alert from 'react-s-alert';

import schemas from '/imports/ui/config/bike-assessment-schemas'
import Steps from '/imports/ui/assessment/assessment-add-steps'
import Control from '/imports/ui/assessment/assessment-add-control'

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

componentDidMount(){
  if(this.props.assessment){
    this.setState({
      formData: {...this.props.assessment},
      step: 4,
      progress: 4,
    })
  }
}

  componentDidUpdate(prevProps, prevState) {
    window.scrollTo(0, 0)

    const reviewStep = schemas.length == this.state.step
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
    const reviewStep = schemas.length == this.state.step
    if (reviewStep) {
      this.props.setAssessment(this.state.formData)
      return
    }
    this.setState((prevState, props) => {
      return {
        formData: {
          ...prevState.formData,
          ...formData,
        },
        step: prevState.step + 1,
        progress: prevState.step + 1,
      }
    })
  }

  backStep = () => {
    this.setState({
      step: this.state.step - 1
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
    return (
    <Grid>
        <Grid.Row centered>
          <Steps
            step={this.state.step}
            steps={schemas}
            goToStep={this.goToStep}
            progress={this.state.progress}
          />
        </Grid.Row>
        <Grid.Row centered>
          <Grid.Column style={{ maxWidth: '600px' }}>
            {
              reviewStep &&
              // this needs refactoring
              <div>
                <AssessmentAddReview
                  formData={this.state.formData}
                  steps={schemas}
                  goToStep={this.goToStep}
                />
                <Control
                  backStep={this.backStep}
                  step={this.state.step}
                  totalSteps={schemas.length}
                  onSubmit={this.onSubmit}
                />
              </div>
            }
            {
              !reviewStep &&
              this.renderForm()
            }
          </Grid.Column>
        </Grid.Row>
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