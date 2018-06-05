import React from 'react'
import PropTypes from 'prop-types';
import { Card, Header } from 'semantic-ui-react'
import * as _ from 'lodash'

const MemberList = (props) => {
  const { members, title, Component, Loader, style, onCardClick } = props

  return (
    <div style={style}>

      {React.Children.map(props.children, (child) => child)}

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          height: '100%',
          alignContent: 'center',
          justifyContent: 'center'
        }}
      >
        {
          props.loading &&
          _.times(15, i => _.constant(<Loader key={i} />)())
        }

        {
          (!props.loading && members) &&
          members.map(member => (
            <Component className={props.componentClassName} key={member._id} {...member} onCardClick={onCardClick} style={{ padding: '5px' }} />
          ))
        }
      </div>
    </div>
  )
}

MemberList.propTypes = {
  Component: PropTypes.func.isRequired,
  componentClassName: PropTypes.string,
  Loader: PropTypes.func.isRequired,
  onCardClick: PropTypes.func.isRequired,
  members: PropTypes.array,
  title: PropTypes.string,
};

export default MemberList