import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import Steps from '/imports/ui/member/member-add-steps'
import Form from "react-jsonschema-form-semanticui";
import schemas from '/imports/ui/member/member-add-schemas'
import Control from '/imports/ui/member/member-add-control'

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
      error: false,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const finalStep = schemas.length == this.state.step
    if (finalStep && this.props.success) {
      // flash success message
      this.props.history.push('/')
      alert('success!')
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

  onFinalSubmit = () => {
    const result = this.props.addMember(this.state.formData)
    console.log(result)
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
          />
          <div>
            {JSON.stringify(this.props.success)}
            {JSON.stringify(this.props.error)}
          </div>
        </Grid.Row>
        <Grid.Row centered>
          <Grid.Column style={{ maxWidth: '500px' }}>
            {
              finalStep &&
              <div>
                Review your details:
                <p>{JSON.stringify(this.state.formData)}</p>
                <Button onClick={this.onFinalSubmit} content='Submit' />
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

export default withRouter(MemberAdd)