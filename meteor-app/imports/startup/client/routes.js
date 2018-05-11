import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Attendance from '/imports/ui/layouts/attendance';

export const renderRoutes = () => (
  <Router>
      <Attendance />
  </Router>
);