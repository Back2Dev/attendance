// role-add.stories.js
import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { Welcome } from '@storybook/react/demo'
import StoryRouter from 'storybook-router'
import { withInfo } from '@storybook/addon-info'
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react'

import { Link, Router, browserHistory } from 'react-router-dom'
import { Grid, Container, Segment } from 'semantic-ui-react'

import MemberAdd from './member-add'

storiesOf('Member', module)
  .addDecorator(StoryRouter())
  .addDecorator(withKnobs)

  .add('Add', withInfo('New volunteer form')(() => {
    const story = (
      <MemberAdd
      onSubmit={action('onClick')}
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

