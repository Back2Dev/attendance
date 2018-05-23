import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react'
import Details from '/imports/ui/member/member-add-details'
import Emergency from '/imports/ui/member/member-add-emergency'
import Other from '/imports/ui/member/member-add-other'
import Steps from '/imports/ui/member/member-add-steps'

class MemberAdd extends Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 1,
      formData: {}
    }
  }

  onSubmit = ({ formData }) => {
    this.setState({
      formData: {
        ...this.state.formData,
        ...formData,
      },
      step: this.state.step + 1
    })
    // if on final step
    // call props.addMember()
  }

  onChange = ({ formData }) => {
    this.setState({
      formData: {
        ...this.state.formData,
        ...formData,
      }
    })
  }

  backStep = () => {
    this.setState({
      step: this.state.step - 1
    })
  }

  // This is some wet code. Am looking at ways to refactor this...
  renderStep = () => {
    switch (this.state.step) {
      case 1:
        return <Other formData={this.state.formData} onChange={this.onChange} step={this.state.step} onSubmit={this.onSubmit} backStep={this.backStep} />
      case 2:
        return <Details formData={this.state.formData} onChange={this.onChange} step={this.state.step} onSubmit={this.onSubmit} backStep={this.backStep} />
      case 3:
        return <Emergency formData={this.state.formData} onChange={this.onChange} step={this.state.step} onSubmit={this.onSubmit} backStep={this.backStep} />
      default:
        return <p>Done</p>
        break
    }
  }

  render() {
    return (
      <Grid>
        <Grid.Row centered>
          <Steps step={this.state.step} />
        </Grid.Row>
        <Grid.Row centered>
          <Grid.Column style={{ maxWidth: '500px' }}>
            {
              this.renderStep()
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

MemberAdd.propTypes = {
  addMember: PropTypes.func.isRequired
};

export default MemberAdd