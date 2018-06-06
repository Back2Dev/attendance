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
      pinConfirm: '',
      showPinSettingInput: false,
      showConfirm: false,
    }
  }
  updateStatus = (data) => {
    this.props.recordVisit({ duration: this.state.duration })
    this.props.history.goBack()
  }

  setDuration = (e, { value }) => this.setState({ duration: value })

  componentDidUpdate(prevProps, prevState) {
    if(this.state.pin == this.state.pinConfirm && this.state.showConfirm){
      this.props.setCustomPin(this.props.member._id,this.state.pin)
      this.setState({
        pin: '',
        pinConfirm: '',
        showPinSettingInput: false,
        showConfirm: false,
      })
      return
    }
    if (this.state.pin.length >= 4 && !this.state.isDefaultPin) {
      this.props.checkPin(this.state.pin)
    }
  }

  componentWillUnmount() {
    this.props.clearPin()
  }

  onPinInput = (e) => {
    const input = e.target.value
    // user is setting their own pin.
    if(this.state.showPinSettingInput){
      // once they've input 4 digit pin, show the second input to confirm.
      if(input.length >= 4){
        this.setState({
          showConfirm: true,
        })
      }
    }
    // if theyre on second screen,
    this.setState((prevState) => {
      if(this.state.showConfirm){
        return {
          pinConfirm: input
        }
      } else {
        return {
          pin: input
        }
      }
      
    })
  }

  onSetPinClick = () => {
    this.setState({
      showPinSettingInput: !this.showPinSettingInput
    })
  }

  render() {
    return (
      <Grid centered style={{ height: '100%' }} verticalAlign='middle'>
        <Grid.Column>
        {
          this.props.isDefaultPin &&
          <p>Is default pin</p>
        }
          <Card.Group centered>
            {
              this.props.loading &&
              <MemberCardLoading />
            }
            {
              !this.props.loading &&
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
                      <Button as='a'>Forgotten your PIN?</Button>
                    }
                  </div>
                }
                {
                  (this.props.isDefaultPin && !this.state.showPinSettingInput) &&
                  <div>
                    <h3>Looks like you havnt set your PIN yet.</h3>
                    <Button onClick={this.onSetPinClick}>Make one now.</Button>
                  </div>
                }
                {
                  this.state.showPinSettingInput && !this.state.showConfirm &&
                  <div>
                    <h3>Set your PIN now:</h3>
                  <MemberVisitPin
                      onPinInput={this.onPinInput}
                      pin={this.state.pin}
                    />

                  </div>
                }
                {
                  this.state.showConfirm &&
                  <div>
                    <h3>Confirm your PIN now:</h3>
                  <MemberVisitPin
                      onPinInput={this.onPinInput}
                      pin={this.state.pinConfirm}
                    />

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
                PIN{this.state.pin}
                PINCONFIRM:{this.state.pinConfirm}
                <Button
                  fluid
                  size='large'
                  onClick={this.props.cancelClick}
                >
                  Back
                </Button>
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
  setCustomPin: PropTypes.func.isRequired,
};

export default MemberVisit