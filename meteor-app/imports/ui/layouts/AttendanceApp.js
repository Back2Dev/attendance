import React from 'react';
import PropTypes from 'prop-types';
import CheckinContainer from '../containers/CheckinContainer';
import CheckedInContainer from '../containers/CheckedInContainer';
import { withRouter } from 'react-router'

function AttendanceApp() {
  return (
    <div className={'ui grid container'}>
      <h1 className={'row equal width centered'}>Back-2-Bikes Attendance</h1>
      <div className={'row'}>
        <CheckinContainer />
        <CheckedInContainer />
      </div> 
    </div>
  );
}

export default withRouter(AttendanceApp);
