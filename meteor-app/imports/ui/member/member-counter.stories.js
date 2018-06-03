// member-card.stories.js
import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { Welcome } from '@storybook/react/demo'
import { withInfo } from '@storybook/addon-info'
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react'
import StoryRouter from 'storybook-router'

import MemberCounter from './member-counter'

storiesOf('Member.List', module)
  .add('Member Counter', (() => {
    const story = (
      <MemberCounter
        count='12'
      />
    )
    // specs(() =>
    //   describe('<Avatar avatar={avatar} />', () => {
    //     it('displays an avatar', () => {
    //       const wrapper = mount(story);
    //       expect(wrapper.find('img')).to.have.length(1);
    //       expect(wrapper.find('img').props().src).to.contain(avatar.url);
    //     });
    //   })
    // );
    return story;
  }))
