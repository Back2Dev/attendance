/* eslint-disable global-require */
import * as rxMeteorMock from './rx-meteor';
import * as meteorMock from './meteor';
import * as mongoMock from './mongo';
import * as sAlertMock from './s-alert';
import Router from './router';
import BlazeReactComponent from './BlazeReactComponent';
import logger from '/imports/lib/client/log';

const mocks = {
  '/imports/api/util-rx-meteor': rxMeteorMock,
  'meteor/meteor': meteorMock,
  'meteor/mongo': mongoMock,
  'meteor/juliancwirko:s-alert': sAlertMock,
  'meteor/iron:router': Router,
  'meteor/gadicc:blaze-react-component': BlazeReactComponent,
  '/imports/lib/log': logger,
};


export default mocks;
