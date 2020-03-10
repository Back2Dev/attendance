import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Grid } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import Form from 'react-jsonschema-form-semanticui'
import Alert from '/imports/ui/utils/alert'
import Steps from '/imports/ui/member/member-add-steps'
import Control from '/imports/ui/member/member-add-control'
import EditControl from '/imports/ui/member/member-edit-control'
import MemberEditReview from '/imports/ui/member/member-edit-review'
import widgets from '/imports/ui/member/member-add-widgets'
import fields from '/imports/ui/member/member-add-fields'

const mapSchemaToState = schema => {
  return schema.reduce((state, step) => {
    Object.keys(step.schema.properties).forEach(prop => (state[prop] = undefined))
    return state
  }, {})
}

class MemberEditForm extends Component {
  constructor(props) {
    super(props)
    this.schemas = props.schemas
    this.state = {
      step: props.step ? props.step : 0,
      formData: mapSchemaToState(props.schemas),
      progress: 0
    }
  }

  componentDidMount() {
    if (this.props.member) {
      this.setState({
        formData: { ...this.props.member },
        step: this.schemas.length,
        progress: this.schemas.length
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    window.scrollTo(0, 0)
    const finalStep = this.schemas.length == this.state.step
    if (finalStep && this.props.error) {
      Alert.error(this.props.message)
    }
  }

  componentWillUnmount() {
    // prevents id from persisting between adding users
    this.props.resetId()
  }

  onSubmit = ({ formData }) => {
    this.setState(() => {
      return {
        formData: { formData }.formData
      }
    })
    this.props.setMember(formData)
    this.setState(() => {
      return {
        step: 5
      }
    })
  }

  stepFive = () => {
    this.setState({
      step: 5
    })
  }

  goToStep = step => {
    if (step <= this.state.progress) {
      this.setState({
        step
      })
    }
  }

  validate = (formData, errors) => {
    if (this.props.member != null) {
      return true
    }
    if (formData.name && formData.name.trim().split(' ').length === 1) {
      errors.name.addError('Please enter your full name')
    }
    return errors
  }
  renderForm = () => {
    return (
      <Form
        schema={this.schemas[this.state.step].schema}
        uiSchema={this.schemas[this.state.step].uiSchema}
        formData={this.state.formData}
        onSubmit={this.onSubmit}
        validate={this.validate}
        widgets={widgets}
        fields={fields}
        showErrorList={false}
        liveValidate={true}
      >
        <EditControl
          reviewStep={this.stepFive}
          step={this.state.step}
          totalSteps={this.schemas.length}
          onSubmit={f => f}
        />
      </Form>
    )
  }

  render() {
    const finalStep = this.schemas.length == this.state.step
    return (
      <Grid>
        <Grid.Row centered></Grid.Row>
        <Grid.Row centered>
          <Grid.Column style={{ maxWidth: '600px' }}>
            {finalStep && (
              <div>
                <MemberEditReview formData={this.state.formData} steps={this.schemas} goToStep={this.goToStep} />
              </div>
            )}
            {!finalStep && this.renderForm()}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

MemberEditForm.propTypes = {
  setMember: PropTypes.func.isRequired,
  resetId: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired
}

export default withRouter(MemberEditForm)
