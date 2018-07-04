import React from 'react'
import PropTypes from 'prop-types';
import { Button, Card, Icon, Checkbox, Form, Grid, Header, Message, Modal, Segment } from 'semantic-ui-react'
import MemberCard from '/imports/ui/member/member-card'
import MemberCardLoading from '/imports/ui/member/member-card-loading'
import MemberVisitArrive from '/imports/ui/member/member-visit-arrive';
import MemberVisitPin from '/imports/ui/member/member-visit-pin';
import MemberVisitPinForgot from '/imports/ui/member/member-visit-pin-forgot';
import MemberVisitPinSet from '/imports/ui/member/member-visit-pin-set';
import MemberEdit from '/imports/ui/member/member-edit';
import { Switch, Route } from 'react-router-dom'
import '/imports/ui/member/member-visit.css'
import MemberVisit from '/imports/ui/member/member-visit'

class MemberDash extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      duration: 6,
      showAlertModal: false,
      showForgotPinForm: false,
    }
  }
  updateStatus = (data) => {
    this.props.recordVisit({ duration: this.state.duration })
    this.props.history.goBack()
  }

  setDuration = (e, { value }) => this.setState({ duration: value })

  toggleForgotPinForm = () => this.setState({ showForgotPinForm: !this.state.showForgotPinForm })

  onPinReminderSent = () => {
    this.toggleForgotPinForm()
  }

  componentDidMount() {
    if (!this.props.memberHasOwnPin) {
      this.toggleModal()
    }
  }

  toggleModal = () => {
    this.setState({
      showAlertModal: !this.state.showAlertModal
    })
  }

  componentWillUnmount() {
    this.props.clearPin()
  }

  componentDidMount() {
    this.setState({
      showAlertModal: !this.props.memberHasOwnPin
    })
  }

  onForgotPin = (method, destination) => {
    const message = `Hold tight. We've sent your PIN to ${destination}\nCheck your ${method} inbox.`
    this.props.forgotPin(method, destination)
    this.toggleForgotPinForm()
    alert(message)
  }

  render() {
    this.props.loading && MemberCardLoading

    return (
      <div>
        <Switch>
          <Route 
            path={`${this.props.match.url}/edit`} 
            exact 
            render={(props) => (<MemberEdit {...this.props} />)} 
          />
          <Route 
            path={`${this.props.match.url}`} 
            exact 
            render={(props) => (<MemberVisit {...this.props} />)} 
          />
        </Switch>
      </div>
    )
  }
}

MemberDash.propTypes = {
  member: PropTypes.object,
  cancelClick: PropTypes.func.isRequired,
  recordVisit: PropTypes.func.isRequired,
  memberHasOwnPin: PropTypes.bool.isRequired,
  onSubmitPin: PropTypes.func.isRequired,
  validPin: PropTypes.bool.isRequired,
  clearPin: PropTypes.func.isRequired,
  forgotPin: PropTypes.func.isRequired,
  setPin: PropTypes.func.isRequired,
  setPinSuccess: PropTypes.bool.isRequired,
};

export default MemberDash

{
  /* 
  
  <Grid centered style={{ height: '100%' }} verticalAlign='middle'>
        <Grid.Column>

          <Modal basic open={this.state.showAlertModal}>
            <Header icon='key' content='Looks like you havnt set a PIN yet.' />
            <Modal.Content>
              <p>
                Please set a PIN for managing your profile.
            </p>
            </Modal.Content>
            <Modal.Actions>
              <Button basic color='red' inverted onClick={this.props.cancelClick}>
                <Icon name='arrow left' /> Cancel
            </Button>
              <Button color='green' inverted onClick={this.toggleModal}>
                <Icon name='arrow right' /> Create PIN
            </Button>
            </Modal.Actions>
          </Modal>

          <Card.Group centered>
            <MemberCard
              className='member-visit-card'
              {...this.props.member}
              onCardClick={f => f}
            >
              {
                this.state.showForgotPinForm &&
                <MemberVisitPinForgot
                  member={this.props.member}
                  forgotPin={this.onForgotPin}
                  onPinReminderSent={this.onPinReminderSent}
                />
              }
              {
                !this.state.showForgotPinForm &&
                <div style={{ margin: '40px 0' }}>
                  {
                    !this.props.validPin &&
                    <div>
                      {
                        this.props.memberHasOwnPin &&
                        <MemberVisitPin
                          setPinSuccess={this.props.setPinSuccess}
                          validPin={this.props.validPin}
                          onSubmitPin={this.props.onSubmitPin}
                          forgotPin={this.props.forgotPin}
                          toggleForgotPinForm={this.toggleForgotPinForm}
                        />
                      }
                      {
                        !this.props.memberHasOwnPin &&
                        <MemberVisitPinSet
                          setPin={this.props.setPin}
                        />
                      }
                    </div>
                  }
                  {
                    this.props.validPin &&
                    <MemberVisitArrive
                      member={this.props.member}
                      duration={this.state.duration}
                      setDuration={this.setDuration}
                      updateStatus={this.updateStatus}
                    />
                  }
                </div>
              }
              <Button
                fluid
                size='large'
                onClick={this.props.cancelClick}
              >
                Back
                </Button>
            </MemberCard>
          </Card.Group>
        </Grid.Column>
      </Grid>

  */
}