// member-card.stories.js
import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react'
import { specs, describe, it } from 'storybook-addon-specifications'
import { mount } from 'enzyme'
import { expect } from 'chai'
import { BrowserRouter as Router } from 'react-router-dom'

import MemberCardSmall from './member-card-small'

import member from '/imports/test/fake-member'

const STORY_NAME = 'Small'

storiesOf('Member.Card', module).add(STORY_NAME, () => {
  const story = (
    <Router>
      <MemberCardSmall {...member} onCardClick={action('onCardClick')} />
    </Router>
  )
  specs(() =>
    describe(STORY_NAME, () => {
      it('displays the member name', () => {
        const wrapper = mount(story)
        expect(wrapper.find('div.ui.big.label')).to.have.length(1)
      })
      it('displays the member image', () => {
        const wrapper = mount(story)
        expect(wrapper.find('img')).to.have.length(1)
      })
    })
  )
  return story
})
