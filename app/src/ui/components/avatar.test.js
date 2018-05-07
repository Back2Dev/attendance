import React from 'react';
import ReactDOM from 'react-dom';
import Avatar from './avatar';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Avatar
          _id="aab45bb"
          firstName="Ed"
          lastName="Sheeran"
          fileName="3.jpg"
          isCheckedIn={false}
   />, div);
  ReactDOM.unmountComponentAtNode(div);
});
