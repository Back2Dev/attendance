import React from 'react';
import PropTypes from 'prop-types';
import { Container, Header, Image } from 'semantic-ui-react';
import './avatar.css';

function Avatar(props) {
  const {
    _id,
    firstName,
    lastName,
    fileName,
    isCheckedin,
  } = props;

  return (
    <Container className="avatar-wrapper" key={_id} textAlign='center'>
      <Image
        size='small'
        className={isCheckedin ? 'checkedInTrue' : 'checkedInFalse'}
        src={"/images/avatars/" + fileName}
        circular
        centered
        avatar
      />
      <Header as='h3' textAlign='center'>
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