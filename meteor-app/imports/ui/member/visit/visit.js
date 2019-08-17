import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Button, Card, Icon, Grid, Divider, Modal, Segment } from 'semantic-ui-react'
import MemberCard from '../member-card'
import MemberCardLoading from '../member-card-loading'
import MemberVisitArrive from './arrive'
import MemberVisitPin from './pin'
import MemberVisitPinForgot from './pin-forgot'
import MemberVisitPinSet from './pin-set'
import './visit.css'
// import { Meteor } from 'meteor/meteor'

const RenewButton = props => {
  const renew = async function() {
    // await Meteor.call('memberRenew', props.memberId, props.code)
    alert('COmmented out Meteor.call(memberRenew)')
    sessionStorage.setItem('mycart', props.memberId)
    props.history.push(`/shop/checkout`)
  }
  return (
    <Button icon size="mini" floated="right" type="button" color="orange" onClick={renew}>
      <Icon name="dollar" />
      Renew
    </Button>
  )
}
// const RenewButton = props => <span> - </span>

const StatusCard = props => {
  const { _id, code, productName, remaining, expiry } = props
  const renew = expiry && moment(expiry).isBefore(moment().add(3, 'months'))
  return (
    <Card>
      <Card.Content>
        <Card.Header>{productName}</Card.Header>
        <Card.Description>
          {remaining && <div> Remaining: {remaining}</div>}
          Expires: {moment(expiry).format('D MMM YYYY')}
          {renew && <RenewButton code={code} memberId={props.memberId} history={props.history} />}
        </Card.Description>
      </Card.Content>
    </Card>
  )
}
const MemberPurchases = props => {
  return (
    <Card.Group>
      {props.purchases.map(item => (
        <StatusCard {...item} key={item._id} history={props.history} />
      ))}
    </Card.Group>
  )
}
class MemberVisit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      duration: 6,
      showAlertModal: false,
      showForgotPinForm: false
    }
  }
  updatePresence = data => {
    this.props.recordVisit(data)
    this.props.history.goBack()
  }

  setDuration = value => this.setState({ duration: value })

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
    if (document.getElementById('pin1')) document.getElementById('pin1').focus()
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
    this.props.loading && <MemberCardLoading />
    const highlightEdit = !this.props.memberHasPhoneEmail
      ? { positive: 'true', fluid: 'true', size: 'large', style: { border: '2px solid yellow' } }
      : {}
    return (
      <Segment>
        <Grid columns={2} style={{ height: '100%' }} verticalAlign="middle">
          <Grid.Column>
            <Modal basic open={this.state.showAlertModal} centered="false">
              <Modal.Header icon="key" content="Looks like you have not set a PIN yet." />
              <Modal.Content>
                <p>Please set a PIN for managing your profile</p>
              </Modal.Content>
              <Modal.Actions>
                <Button color="red" onClick={this.props.cancelClick}>
                  <Icon name="arrow left" /> Cancel
                </Button>
                <Button id="createPIN" color="green" onClick={this.toggleModal}>
                  <Icon name="arrow right" /> Create PIN
                </Button>
              </Modal.Actions>
            </Modal>
            <Card.Group centered>
              <MemberCard className="member-visit-card" {...this.props.member} onCardClick={f => f} />
            </Card.Group>
          </Grid.Column>
          <Grid.Column>
            {/* {!this.props.memberHasPhoneEmail && (
              <MemberEmailPhone email={this.props.member.email} mobile={this.props.member.mobile} />
            )} */}
            {this.state.showForgotPinForm && (
              <MemberVisitPinForgot
                member={this.props.member}
                forgotPin={this.onForgotPin}
                onPinReminderSent={this.onPinReminderSent}
              />
            )}
            {!this.state.showForgotPinForm && (
              <div style={{ margin: '40px 0' }}>
                {!this.props.validPin && (
                  <div>
                    {this.props.memberHasOwnPin && (
                      <MemberVisitPin
                        setPinSuccess={this.props.setPinSuccess}
                        validPin={this.props.validPin}
                        onSubmitPin={this.props.onSubmitPin}
                        forgotPin={this.props.forgotPin}
                        toggleForgotPinForm={this.toggleForgotPinForm}
                      />
                    )}
                    {!this.props.memberHasOwnPin && <MemberVisitPinSet setPin={this.props.setPin} />}
                  </div>
                )}
                {this.props.validPin && (
                  <div>
                    <Button onClick={() => this.props.history.push(`/edit/${props.member_id}`)} {...highlightEdit}>
                      Edit Your Profile
                    </Button>
                    <MemberPurchases purchases={this.props.purchases} history={this.props.history} />
                    <MemberVisitArrive
                      member={this.props.member}
                      duration={this.state.duration}
                      setDuration={this.setDuration}
                      updatePresence={this.updatePresence}
                      events={this.props.events}
                      purchases={this.props.purchases}
                    />
                  </div>
                )}
              </div>
            )}
            <Button fluid size="large" onClick={this.props.cancelClick}>
              Back
            </Button>
          </Grid.Column>
        </Grid>

        <Divider vertical />
      </Segment>
    )
  }
}

MemberVisit.propTypes = {
  member: PropTypes.object,
  events: PropTypes.array.isRequired,
  purchases: PropTypes.array.isRequired,
  cancelClick: PropTypes.func.isRequired,
  recordVisit: PropTypes.func.isRequired,
  memberHasOwnPin: PropTypes.bool.isRequired,
  onSubmitPin: PropTypes.func.isRequired,
  validPin: PropTypes.bool.isRequired,
  clearPin: PropTypes.func.isRequired,
  forgotPin: PropTypes.func.isRequired,
  setPin: PropTypes.func.isRequired,
  setPinSuccess: PropTypes.bool.isRequired
}

export default MemberVisit
