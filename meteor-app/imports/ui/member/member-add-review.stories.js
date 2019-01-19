// member-add.stories.js
import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import StoryRouter from 'storybook-router'
import formData from '/imports/test/fake-member'

import getSchemas from '/imports/ui/config/member-add-schemas'
import MemberAddReview from './member-add-review'

const schemas = getSchemas('b2b')
storiesOf('Member.Add', module)
  .addDecorator(StoryRouter())

  .add('MemberAddReview', () => {
    const schemas = getSchemas('b2b')
    const story = (
      <div>
        <p>Use Knobs to show checked in/out status</p>
        <MemberAddReview formData={formData} steps={schemas} resetId={action('resetId')} goToStep={action('submit')} />
      </div>
    )
    // specs(() =>
    //   describe('<MemberAddReview />', () => {
    //     it('displays the add member wizard', () => {
    //       const wrapper = mount(story)
    //       expect(wrapper.find('button')).to.have.length(1)
    //       // expect(wrapper.find('button').props().src).to.contain(avatar.url)
    //     })
    //   })
    // )
    return story
  })
