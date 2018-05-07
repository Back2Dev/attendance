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

import Avatar from './avatar'

storiesOf('Components | Avatar', module)
  .addDecorator(StoryRouter())
  .addDecorator(withKnobs)

  .add('Avatar', withInfo('Checked in/out')(() => {
    const story = (
      <div><p>Use Knobs to show checked in/out status</p>
        <Avatar 
          _id="aab45bb"
          firstName="Ed"
          lastName="Sheeran"
          fileName="3.jpg"
          isCheckedIn={boolean('Checked in', false)}
        />
      </div>
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

     