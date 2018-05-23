import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react'
import { Session } from 'meteor/session'
import Steps from '/imports/ui/member/member-add-steps'
import Form from "react-jsonschema-form-semanticui";
import schemas from '/imports/ui/member/member-add-schemas'
import Control from '/imports/ui/member/member-add-control'

class MemberAdd extends Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 0,
      formData: {}
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const finalStep = schemas.length == this.state.step
    if (finalStep) {
      this.props.addMember(this.state.formData)
    }
  }

  onSubmit = ({ formData }) => {
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
      <Control backStep={this.backStep} step={this.state.step} />
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
          />
        </Grid.Row>
        <Grid.Row centered>
          <Grid.Column style={{ maxWidth: '500px' }}>
            {
              finalStep &&
              <div>
                Confirmation Message:
                {this.props.errorMessage}
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
  addMember: PropTypes.func.isRequired
};

export default MemberAdd