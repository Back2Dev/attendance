import React from 'react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import { Button, Card, Checkbox, Form, Grid, Header, } from 'semantic-ui-react'
import MemberCard from '/imports/ui/member/member-card'
import MemberCardLoading from '/imports/ui/member/member-card-loading'
import MemberVisitArrive from '/imports/ui/member/member-visit-arrive';

class MemberVisit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      duration: 6
    }
  }
  updateStatus = (data) => {
    this.props.recordVisit({duration: this.state.duration})
    this.props.history.goBack()
  }

  cancelClick = () => {
    this.props.history.goBack()
  }

  setDuration = (e, { value }) => this.setState({ duration: value })


  render() {
    return (
      <Grid centered style={{ height: '100%' }} verticalAlign='middle' textAlign='center'>
        <Grid.Column>
          <Card.Group centered>
            {
              this.props.loading &&
              <MemberCardLoading />
            }
            {
              (!this.props.loading && this.props.member) &&
              <MemberCard {...this.props.member} onCardClick={f => f}>

                <MemberVisitArrive
                  member={this.props.member}
                  setDuration={this.setDuration}
                  updateStatus={this.updateStatus}
                  cancelClick={this.cancelClick}
                  duration={this.state.duration}
                />


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
};

export default MemberVisit