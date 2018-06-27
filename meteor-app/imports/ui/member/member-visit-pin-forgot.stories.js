// member-visit.stories.js
import React from 'react'
import ReactDOM from 'react-dom'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { Welcome } from '@storybook/react/demo'
import StoryRouter from 'storybook-router'
import { withInfo } from '@storybook/addon-info'
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react'

import { Link, Router, browserHistory } from 'react-router-dom'
import { Grid, Container, Segment } from 'semantic-ui-react'
import member from '/imports/test/fake-member'

import MemberVisitPinForgot from './member-visit-pin-forgot'

storiesOf('Member.Session.ForgotPin', module)
  .addDecorator(StoryRouter())
  .addDecorator(withKnobs)

  .add('Attend', withInfo('Here/Absent')(() => {
    const story = (
      <div style={{maxWidth: '280px'}}>
          <MemberVisitPinForgot
          onPinReminderSent={action('sent PIN reminder')}
          forgotPin={action('forgotten PIN')}
          />
      </div>
    )
    // specs(() =>
    //   describe('<User avatar={avatar} />', () => {
    //     it('displays an User', () => {
    //       const wrapper = mount(story);
    //       expect(wrapper.find('img')).to.have.length(1);
    //       expect(wrapper.find('img').props().src).to.contain(avatar.url);
    //     });
    //   })
    // );
    return story;
  }))

