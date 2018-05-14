import React from 'react'
import PropTypes from 'prop-types';
import { Card, Grid, Header } from 'semantic-ui-react'
import RoleCard from '../role-card'

const RolesList = (props) => {
  const { roles, title } = props
  return (
    //renders list of users signed in OR out
    <div>
      <Header as={'h2'} content={title} />
      <div>
        <Card.Group>
          {
            roles.map(role => (
              <RoleCard key={role._id} {...role} />
            ))
          }
        </Card.Group>
      </div>
    </div>
  )
}

RolesList.propTypes = {
  roles: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};

export default RolesList