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
          (!props.loading && members) &&
          members.map(member => (
            <div key={member._id} onClick={() => onCardClick(member._id)}>
              <Component className={props.componentClassName}  {...member} style={{ padding: '5px' }} />
            </div>
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
  members: PropTypes.array,
  title: PropTypes.string,
};

export default MemberList