import React from 'react'
import PropTypes from 'prop-types';
import { Image, Segment } from 'semantic-ui-react'

const AvatarWidget = (props) => {
  return (
    <Segment>
      <Image
        style={{ boxShadow: '0px 2px 3px 3px rgba(0,0,0,.15)' }}
        centered
        size='medium'
        circular
        src={`/images/avatars/${props.value}`}
      />
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: '25px'
      }}
      >
        {
          props.options.enumOptions.map(option =>
            (
              <Image
                circular
                style={{
                  height: "80px",
                  margin: '5px',
                  boxShadow: '0px 2px 2px 1px rgba(0,0,0,.25)',
                  border: (props.value == option.value) ? '5px solid #00ff8d' : 'none',
                  filter: (props.value != option.value) ? 'brightness(80%)' : '',
                  opacity: (props.value != option.value) ? '.75' : '1',
                }}
                size='tiny'
                src={`/images/avatars/${option.value}`}
                onClick={(event) => props.onChange(option.value)}
              />
            )
          )
        }
      </div>
      <input
        hidden
        type='text'
        value={props.value}
        required={props.required}
      />
    </Segment>
  );
}

AvatarWidget.defaultProps = {
  value: 'default.jpg'
};

AvatarWidget.propTypes = {
  options: PropTypes.object.isRequired,
};

export default AvatarWidget