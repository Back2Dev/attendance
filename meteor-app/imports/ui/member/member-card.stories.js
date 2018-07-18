// member-card.stories.js
import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { Welcome } from '@storybook/react/demo'
import { withInfo } from '@storybook/addon-info'
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react'
import member from '/imports/test/fake-member'

import Card from './member-card'


storiesOf('Member.Card', module)
  .addDecorator(withKnobs)
  .add('Card', withInfo('Checked in/out')(() => {
    const story = (
      <div><p>Use Knobs to show checked in/out status</p>
        <Card
          {...member}
          isSuper={boolean('Is Supervisor', false)}
          sessionCount={number('Session Count', 4)}
          onCardClick={action('onCardClick')}
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
