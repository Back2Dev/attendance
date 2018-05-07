import React from 'react';
import PropTypes from 'prop-types';
import { Container, Header, Image } from 'semantic-ui-react';

function Avatar(props) {
  const {
    _id,
    firstName,
    lastName,
    fileName,
    isCheckedin
  } = props;

  return (
    <Container className="avcontainer" key={_id} textAlign='center'>
      <Image
        size='small'
        style={{ border: '5px solid ' + isCheckedin ? 'limegreen' : 'grey' }}
        src={"/images/avatars/" + fileName}
        circular
        centered
      />
      <Header textAlign='center'>
        {firstName} {lastName}
      </Header>
    </Container>
  );
}

Avatar.propTypes = {
  _id: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  isCheckedin: PropTypes.bool.isRequired
};

export default Avatar;