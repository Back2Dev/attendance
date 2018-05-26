import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import Steps from '/imports/ui/member/member-add-steps'
import Form from "react-jsonschema-form-semanticui";
import schemas from '/imports/ui/config/member-add-schemas'
import Control from '/imports/ui/member/member-add-control'
import Alert from 'react-s-alert';
import MemberAddReview from '/imports/ui/member/member-add-review'

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
      step: 0,
      formData: mapSchemaToState(schemas),
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const finalStep = schemas.length == this.state.step
    if (finalStep && this.props.success) {
      Alert.success(this.props.message);
      this.props.history.push('/')
    }
    if (finalStep && this.props.error) {
      Alert.error(this.props.message);
    }
  }

  onSubmit = ({ formData }) => {
    const finalStep = schemas.length == this.state.step
    if (finalStep) {
      this.props.addMember(this.state.formData)
      return
    }
    this.setState((prevState, props) => {
      return {
        formData: {
          ...prevState.formData,
          ...formData,
        },
        step: prevState.step + 1,
      }
    })
  }

  backStep = () => {
    this.setState({
      step: this.state.step - 1
    })
  }

  renderForm = () => {
    return <Form
      schema={schemas[this.state.step].schema}
      uiSchema={schemas[this.state.step].uiSchema}
      formData={this.state.formData}
      onChange={this.onChange}
      onSubmit={this.onSubmit}
    >
      <Control
        backStep={this.backStep}
        step={this.state.step}
        totalSteps={schemas.length}
        onSubmit={f => f}
      />
    </Form>
  }

  loadSampleFormData = () => {
    const formData = { addressPostcode: 3000, addressState: "VIC", addressStreet: "7 Lucky Avenue", addressSuburb: "Pleasantville", bikesHousehold: 5, email: "matt@gmail.com", emergencyContact: "Tiz Notari", emergencyEmail: "tiz@gmail.com", emergencyMobile: "0468734226", emergencyPhone: "0468734226", mobile: "0468734226", name: "Matt Wiseman", phone: "0468734226", primaryBike: "Mountain", reasons: "These are some of my reasons", workStatus: "Part Time", }
    this.setState({ formData })
  }

  render() {
    const finalStep = schemas.length == this.state.step
    return (
      <Grid>

        <Grid.Row centered>
          <Steps
            step={this.state.step}
            steps={schemas}
          />
          <Button onClick={this.loadSampleFormData}>
            Load Sample Data
          </Button>
        </Grid.Row>
        <Grid.Row centered>
          <Grid.Column style={{ maxWidth: '500px' }}>
            {
              finalStep &&
              // this needs refactoring
              <div>
                <MemberAddReview
                  formData={this.state.formData}
                  steps={schemas}
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
  addMember: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
}

export default withRouter(MemberAdd)