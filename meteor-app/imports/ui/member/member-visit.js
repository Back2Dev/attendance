import React from 'react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import { Button, Card, Checkbox, Form, Grid, Header, } from 'semantic-ui-react'
import MemberCard from '/imports/ui/member/member-card'
import MemberCardLoading from '/imports/ui/member/member-card-loading'

class MemberVisit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      duration: 6
    }
  }
  updateStatus = (data) => {
    this.props.recordVisit(data)
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
                {
                  this.props.member && !this.props.member.isHere &&
                  <Form style={{ padding: '20px 0' }}>
                    <Header as='h4'>
                      Great to see you!
                    <Header.Subheader>
                        How long are you with us for?
                    </Header.Subheader>
                    </Header>
                    <Form.Field>
                      <Checkbox
                        label='Half Day (~3hrs)'
                        name='duration'
                        value={4}
                        checked={this.state.duration === 3}
                        onChange={this.setDuration}
                      />
                    </Form.Field>
                    <Form.Field>
                      <Checkbox
                        label='Full Day (~6hrs)'
                        name='duration'
                        value={8}
                        checked={this.state.duration === 6}
                        onChange={this.setDuration}
                      />
                    </Form.Field>
                  </Form>
                }
                {
                  this.props.member && this.props.member.isHere &&
                  <Header as='h4'>
                    See you next time!
                  </Header>
                }
                <Button.Group>
                  <Button onClick={this.cancelClick}>Cancel</Button>
                  <Button.Or />
                  <Button
                    onClick={this.updateStatus.bind(null, this.state)}
                    positive
                    compact
                  >
                    {
                      this.props.member.isHere
                        ? 'Sign Out'
                        : 'Sign In'
                    }
                  </Button>
                </Button.Group>
              </MemberCard>
            }
          </Card.Group>
        </Grid.Column>
      </Grid>
    )
  }

}


MemberVisit.propTypes = {
  // _id: PropTypes.string.isRequired,
  // name: PropTypes.string.isRequired,
  // avatar: PropTypes.string.isRequired,
  // isHere: PropTypes.bool.isRequired,
  // sessions: PropTypes.array.isRequired,
  // lastIn: PropTypes.object,
  recordVisit: PropTypes.func.isRequired,
};

export default MemberVisit