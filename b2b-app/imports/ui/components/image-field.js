import React, { Fragment } from 'react';
import {  connectField } from 'uniforms';
import { Box } from '@material-ui/core'


const ImageField = ({ value }) => {
  return (
    <div style={{
        display: 'flex'
    }}>
        {value.map(value => (
            <div key={value}   >
            <input type="radio" id="huey" name="drone" value={value} />
              <img
                alt=""
                style={{  width: '100px', height: '100px' }}
                src={value || 'https://picsum.photos/150?grayscale'}
              />
            </div>
        ))}
    </div>
  );
}

export default connectField(ImageField);