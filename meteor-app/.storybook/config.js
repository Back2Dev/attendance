import { configure } from '@storybook/react';
import { storiesOf, action, linkTo } from '@storybook/react';
import { specs, describe, it } from 'storybook-addon-specifications';
import 'semantic-ui-css/semantic.min.css'

// import '/client/stylesheets/newstyle/_style.scss';

// //THIS IS NEEDED ONLY IF YOU ARE USING MOCHA AS A TEST RUNNER

  global.storiesOf = storiesOf;
  global.action = action;
  global.linkTo = linkTo;
  global.specs = specs;
  global.describe = describe;
  global.it = it;

  // END OF SPECIFIC MOCHA CONF

// stories live in the codebase as {component-name}.stories.js
const req = require.context('../imports/ui', true, /.stories.js$/);

const loadStories = () => req.keys().forEach(filename => req(filename));

configure(loadStories, module);
