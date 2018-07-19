import { configure } from '@storybook/react';
import { storiesOf, action, linkTo } from '@storybook/react'
import { specs, describe, it } from 'storybook-addon-specifications'
import { expect } from 'chai';
import { setOptions } from '@storybook/addon-options'
import 'semantic-ui-css/semantic.min.css'
import TestUtils from 'react-dom/test-utils'
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

// import '/client/stylesheets/newstyle/_style.scss'

// //THIS IS NEEDED ONLY IF YOU ARE USING MOCHA AS A TEST RUNNER

global.storiesOf = storiesOf;
global.action = action;
global.linkTo = linkTo;
global.specs = specs;
global.describe = describe;
global.it = it;
global.mount = Enzyme.mount
global.expect = expect

// END OF SPECIFIC MOCHA CONF

setOptions({
  hierarchySeparator: /\./,
  name: ' B A C K 2 B I K E S '
});
// stories live in the codebase as {component-name}.stories.js
const req = require.context('../imports/ui', true, /.stories.js$/);

const loadStories = () => req.keys().forEach(filename => req(filename));

configure(loadStories, module);