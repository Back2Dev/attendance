import React from 'react'
import PropTypes from 'prop-types';
import { Card, Header } from 'semantic-ui-react'
import * as _ from 'lodash'

const MemberList = (props) => {
  const { members, title, Component, Loader, style, onCardClick } = props



  return (
    //renders list of users signed in OR out
    <div style={style}>
      <Header
        dividing
        as={'h1'}
        textAlign={'center'}
        content={title}
      />
      
      {React.Children.map(props.children, (child) => child)}
      
      <Card.Group centered>
        {
          props.loading &&
          _.times(15, _.constant(<Loader />))
        }

        {
          (!props.loading && members) &&
          members.map(member => (
            <Component key={member._id} {...member} onCardClick={onCardClick} />
          ))
        }
      </Card.Group>
    </div>
  )
}

MemberList.propTypes = {
  members: PropTypes.array,
  title: PropTypes.string,
};

export default MemberList