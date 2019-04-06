import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'
import MemberCardLoading from '/imports/ui/member/member-card-loading'
import MemberEdit from '/imports/ui/member/member-edit'
import MemberVisit from '/imports/ui/member/member-visit'
import './member-visit.css'

class MemberDash extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      duration: 6,
      showAlertModal: false,
      showForgotPinForm: false
    }
  }
  updateStatus = data => {
    this.props.recordVisit({ duration: this.state.duration })
    this.props.history.goBack()
  }

  setDuration = (e, { value }) => this.setState({ duration: value })

  toggleForgotPinForm = () => this.setState({ showForgotPinForm: !this.state.showForgotPinForm })

  onPinReminderSent = () => {
    this.toggleForgotPinForm()
  }

  componentDidMount() {
    if (!this.props.memberHasOwnPin || !memberHasPhoneEmail) {
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
    if (this.props.loading) return <MemberCardLoading />

    return (
      <div>
        <Switch>
          <Route path={`${this.props.match.url}/edit`} exact render={props => <MemberEdit {...this.props} />} />
          <Route path={`${this.props.match.url}`} exact render={props => <MemberVisit {...this.props} />} />
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
  memberHasPhoneEmail: PropTypes.bool.isRequired,
  onSubmitPin: PropTypes.func.isRequired,
  validPin: PropTypes.bool.isRequired,
  clearPin: PropTypes.func.isRequired,
  forgotPin: PropTypes.func.isRequired,
  setPin: PropTypes.func.isRequired,
  setPinSuccess: PropTypes.bool.isRequired
}

export default MemberDash
