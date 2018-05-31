/* eslint-disable global-require */
import * as meteorMock from './meteor';
import * as mongoMock from './mongo';
import * as sAlertMock from './s-alert';
import BlazeReactComponent from './BlazeReactComponent';
import logger from '/imports/lib/client/log';

const mocks = {
  'meteor/meteor': meteorMock,
  'meteor/mongo': mongoMock,
  'meteor/juliancwirko:s-alert': sAlertMock,
  'meteor/gadicc:blaze-react-component': BlazeReactComponent,
  '/imports/lib/log': logger,
};


export default mocks;
