import React from 'react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import { Button, Card, Checkbox, Form, Grid, Header, } from 'semantic-ui-react'
import MemberCard from '/imports/ui/member/member-card'
import MemberCardLoading from '/imports/ui/member/member-card-loading'

const MemberVisitArrive = (props) => {
  return (
    <div>
      <Form style={{ padding: '20px 0' }} >
      {
        props.member && !props.member.isHere &&
        <div>
          <Header as='h3'>
            Great to see you!
            <Header.Subheader>
                  How long are you with us for?
            </Header.Subheader>
          </Header>
          <Form.Field>
            <Checkbox
              label='Half Day (~3hrs)'
              name='duration'
              value={3}
              checked={props.duration === 3}
              onChange={props.setDuration}
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              label='Full Day (~6hrs)'
              name='duration'
              value={6}
              checked={props.duration === 6}
              onChange={props.setDuration}
            />
          </Form.Field>
        </div>
      }
      {
        props.member && props.member.isHere &&
        <Header as='h4'>
          See you next time!
      </Header>
      }
        <Button
          onClick={() => props.updateStatus()}
          positive
          fluid
          id="signIn"
          size='large'
        >
          {
            props.member.isHere
              ? 'Sign Out'
              : 'Sign In'
          }
        </Button>
      </Form>
    </div>
  )
}

MemberVisitArrive.propTypes = {
  member: PropTypes.object.isRequired,
  duration: PropTypes.number.isRequired,
  setDuration: PropTypes.func.isRequired,
  updateStatus: PropTypes.func.isRequired,
};

export default MemberVisitArrive