import React from 'react';
import PropTypes from 'prop-types';
import Avatar from './avatar';
import { Grid, Header } from 'semantic-ui-react'

function CheckedInList(props) {
  const { loading, ppl } = props;

  return (
    <Grid.Column width={4} style={{ backgroundColor: 'WhiteSmoke' }}>
      <Header
        as='h2'
        textAlign='center'
        content='Whos here:' />

      {
        loading &&
        <p>Loading...</p>
      }
      {
        ppl.length === 0 &&
        <p>No one has checked in yet!</p>
      }
      {
        ppl.length > 1 &&
          ppl.map(({ _id, firstname, surname, avatar, isCheckedin }) => (
              <Avatar
                _id={_id}
                firstName={firstname}
                lastName={surname}
                isCheckedin={isCheckedin}
                fileName={avatar}
              />
          ))
      }
    </Grid.Column>
  );
}

CheckedInList.propTypes = {
  loading: PropTypes.bool.isRequired,
  ppl: PropTypes.array.isRequired,
};

export default CheckedInList;