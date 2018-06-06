import React from 'react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import { Button, Card, Checkbox, Form, Grid, Header, Message} from 'semantic-ui-react'
import MemberCard from '/imports/ui/member/member-card'
import MemberCardLoading from '/imports/ui/member/member-card-loading'
import MemberVisitArrive from '/imports/ui/member/member-visit-arrive';
import MemberVisitPin from '/imports/ui/member/member-visit-pin';
import MemberVisitPinSet from '/imports/ui/member/member-visit-pin-set';
import '/imports/ui/member/member-visit.css'

class MemberVisit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      duration: 6,
    }
  }
  updateStatus = (data) => {
    this.props.recordVisit({ duration: this.state.duration })
    this.props.history.goBack()
  }

  setDuration = (e, { value }) => this.setState({ duration: value })

  componentDidUpdate(prevProps, prevState) {
  }

  componentWillUnmount() {
    this.props.clearPin()
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
              !this.props.loading &&
              <MemberCard
                className='member-visit-card'
                {...this.props.member}
                onCardClick={f => f}
              >

                {
                  !this.props.validPin &&
                  <div>
                  
                    {
                      this.props.memberHasOwnPin &&
                      <MemberVisitPin
                        setPinSuccess={this.props.setPinSuccess}
                        validPin={this.props.validPin}
                        onSubmitPin={this.props.onSubmitPin}
                      />
                    }
                    {
                      !this.props.memberHasOwnPin &&
                      <MemberVisitPinSet
                        onSubmitPin={this.props.onSubmitPin}
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
  recordVisit: PropTypes.func.isRequired,
  memberHasOwnPin: PropTypes.bool.isRequired,
  onSubmitPin: PropTypes.func.isRequired,
  validPin: PropTypes.bool.isRequired,
  clearPin: PropTypes.func.isRequired,
  forgotPin: PropTypes.func.isRequired,
  setPinSuccess: PropTypes.bool.isRequired
};

export default MemberVisit