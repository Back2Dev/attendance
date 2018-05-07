import React from 'react';
import PropTypes from 'prop-types';
import Avatar from './avatar';


CheckedInList.propTypes = {
  loading: PropTypes.bool.isRequired,
  ppl: PropTypes.array.isRequired, 
};

function CheckedInList(props) {
  const {
    loading,
    ppl,
  } = props;

  if (loading) {
    return (
      <p>Loading...</p>
    );
  }

  if (ppl.length === 0) {
    return (
      <p>No one has checked in yet!</p>
    );
  }

  // const isCheckedIn = true;
  return (
    <div 
      className={'three wide column'}
      style={{backgroundColor: 'WhiteSmoke'}} 
    >
      <h2>Checked In Today</h2>
      <div className={'ui relaxed list flow'}        >
        {ppl.map(({ _id, firstname, surname, avatar, isCheckedIn}) => (
          <div key={_id}>
            <Avatar
              _id={_id}
              firstName={firstname}
              lastName={surname}
              isCheckedIn={isCheckedIn}
              fileName={avatar}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CheckedInList;