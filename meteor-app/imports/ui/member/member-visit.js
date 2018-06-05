import React from 'react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import { Button, Card, Checkbox, Form, Grid, Header, } from 'semantic-ui-react'
import MemberCard from '/imports/ui/member/member-card'
import MemberCardLoading from '/imports/ui/member/member-card-loading'
import MemberVisitArrive from '/imports/ui/member/member-visit-arrive';
import MemberVisitPin from '/imports/ui/member/member-visit-pin';
import '/imports/ui/member/member-visit.css'

class MemberVisit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      duration: 6,
      pin: '',
    }
  }
  updateStatus = (data) => {
    this.props.recordVisit({ duration: this.state.duration })
    this.props.history.goBack()
  }

  setDuration = (e, { value }) => this.setState({ duration: value })

  componentDidUpdate(prevProps, prevState) {
    if (this.state.pin.length >= 4) {
      this.props.checkPin(this.state.pin)
    }
  }

  componentWillUnmount() {
    this.props.clearPin()
  }

  onPinInput = (e) => {
    const input = e.target.value
    this.setState((prevState) => {
      return {
        pin: input
      }
    })
  }

  render() {
    return (
      <Grid centered style={{ height: '100%' }} verticalAlign='middle'>
        <Grid.Column>
          <Card.Group centered>
            {
              this.props.loading &&
              <MemberCardLoading />
            }
            {
              (!this.props.loading && this.props.member) &&
              <MemberCard
                className='member-visit-card'
                {...this.props.member}
                onCardClick={f => f}
              >

                {
                  (!this.props.validPin && !this.props.isDefaultPin) &&
                  <div>
                    <MemberVisitPin
                      onPinInput={this.onPinInput}
                      pin={this.state.pin}
                    />
                    {
                      !this.props.isDefaultPin &&
                      <div>Forgotten your PIN?</div>
                    }
                  </div>
                }
                {
                  this.props.isDefaultPin &&
                  <div>
                    Looks like you havnt set your PIN yet.
                    <Button>Make one now.</Button>
                  </div>
                }
                
                {
                  this.props.validPin &&
                  <MemberVisitArrive
                    member={this.props.member}
                    setDuration={this.setDuration}
                    updateStatus={this.updateStatus}

                    duration={this.state.duration}
                  />
                }
                <Button
                  fluid
                  size='large'
                  onClick={this.props.cancelClick}>Cancel</Button>
              </MemberCard>
            }
          </Card.Group>
        </Grid.Column>
      </Grid>
    )
  }
}

MemberVisit.propTypes = {
  member: PropTypes.object,
  clearPin: PropTypes.func.isRequired,
  recordVisit: PropTypes.func.isRequired,
  checkPin: PropTypes.func.isRequired,
  validPin: PropTypes.bool.isRequired,
  isDefaultPin: PropTypes.bool.isRequired,
};

export default MemberVisit