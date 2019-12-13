// member-card.stories.js
import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'
import { withKnobs, boolean, text, number } from '@storybook/addon-knobs/react'

import Card from './member-card'

import member from '/imports/test/fake-member'

const STORY_NAME = 'Regular'

storiesOf('Member.Card nosnap', module)
  .addDecorator(withKnobs)
  .addDecorator(withInfo)
  .add(
    'Card',
    () => {
      const story = (
        <div>
          <p>Use Knobs to show checked in/out status</p>
          <Card
            {...member}
            name={text('Name', 'Homer Simpson')}
            isSuper={boolean('Is Supervisor', false)}
            isSlsa={boolean('SLSA?', false)}
            sessionCount={number('Session Count', 4)}
            onCardClick={action('onCardClick')}
          />
        </div>
      )
      // specs(() =>
      //   describe(STORY_NAME, () => {
      //     it('displays the member name', () => {
      //       const wrapper = mount(story)
      //       expect(wrapper.find('div.header')).to.have.length(1)
      //     })
      //     it('is called "Orie Kautzer"', () => {
      //       const wrapper = mount(story)
      //       expect(wrapper.find('div.header').text()).to.equal(' Orie Kautzer ')
      //     })
      //     it('displays the member image', () => {
      //       const wrapper = mount(story)
      //       expect(wrapper.find('img')).to.have.length(1)
      //     })
      //   })
      // )
      return story
    },
    { info: 'Checked in/out' }
  )
