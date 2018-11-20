import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import Form from "react-jsonschema-form-semanticui";
import Alert from 'react-s-alert';
import Steps from '/imports/ui/member/member-add-steps'
import schemas from '/imports/ui/config/member-add-schemas'
import Control from '/imports/ui/member/member-add-control'
import MemberAddReview from '/imports/ui/member/member-add-review'
import widgets from '/imports/ui/member/member-add-widgets'
import fields from '/imports/ui/member/member-add-fields'

const mapSchemaToState = schema => (
  schema
    .reduce((state, step) => {
      Object.keys(step.schema.properties)
        .forEach(prop => state[prop] = undefined)
      return state
    }, {})
)

class MemberAdd extends Component {
  constructor(props) {
    super(props)
    this.state = {
      step: (props.step) ? props.step : 0,
      formData: mapSchemaToState(schemas),
      progress: 0,
    }
  }

componentDidMount(){
  if(this.props.member){
    this.setState({
      formData: {...this.props.member},
      step: 4,
      progress: 4,
    })
  }
}

  componentDidUpdate(prevProps, prevState) {
    window.scrollTo(0, 0)

    const finalStep = schemas.length == this.state.step
    if (finalStep && this.props.newId) {
      Alert.success(this.props.message);
      this.props.history.push(
        this.props.isIframe
          ? `/success/${this.props.newId}`
          : '/'
      )
    }
    if (finalStep && this.props.error) {
      Alert.error(this.props.message);
    }
  }

  componentWillUnmount() {
    // prevents id from persisting between adding users
      this.props.resetId()
  }

  onSubmit = ({ formData }) => {
    const finalStep = schemas.length == this.state.step
    if (finalStep) {
      this.props.setMember(this.state.formData)
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
  validate = (formData, errors) => {
    if(this.props.member != null){
      return true
    }
    if (formData.pin && formData.pin.length < 4) {
      errors.pin.addError("PIN number must be at least 4 digits long.");
    }
    if (formData.pin !== formData.pinConfirm) {
      errors.pinConfirm.addError("PIN numbers don't match");
    }
    return errors;
  }
  renderForm = () => {
    return <Form
      schema={schemas[this.state.step].schema}
      uiSchema={schemas[this.state.step].uiSchema}
      formData={this.state.formData}
      onSubmit={this.onSubmit}
      validate={this.validate}
      widgets={widgets}
      fields={fields}
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
    const finalStep = schemas.length == this.state.step
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
              finalStep &&
              // this needs refactoring
              <div>
                <MemberAddReview
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
              !finalStep &&
              this.renderForm()
            }
          </Grid.Column>
        </Grid.Row>
      </Grid >
    )
  }
}

MemberAdd.propTypes = {
  setMember: PropTypes.func.isRequired,
  resetId: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
}

export default withRouter(MemberAdd)