// member-add.stories.js
import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { Welcome } from '@storybook/react/demo'
import { withInfo } from '@storybook/addon-info'
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react'
import StoryRouter from 'storybook-router'

import schemas from '/imports/ui/config/member-add-schemas'
import MemberAddReview from './member-add-review'
const formData = {
  avatar: 'default.jpg',
  addressPostcode: 3000,
  addressState: "VIC",
  addressStreet: "7 Lucky Avenue",
  addressSuburb: "Pleasantville",
  bikesHousehold: 5,
  email: "matt@gmail.com",
  emergencyContact: "Tiz Notari",
  emergencyEmail: "tiz@gmail.com",
  emergencyMobile: "0468734226",
  emergencyPhone: "0468734226",
  mobile: "0468734226",
  name: "Matt Wiseman",
  phone: "0468734226",
  primaryBike: "Mountain",
  reasons: "These are some of my reasons",
  workStatus: "Part Time",
}
storiesOf('Member.Add', module)
.addDecorator(StoryRouter())

  .add('MemberAddReview', (() => {
    const story = (
      <div><p>Use Knobs to show checked in/out status</p>
        <MemberAddReview
          formData={formData}
          steps={schemas}
        />
      </div>
    )
    // specs(() =>
    //   describe('<MemberAdd />', () => {
    //     it('displays the add member wizard', () => {
    //       const wrapper = mount(story)
    //       expect(wrapper.find('button')).to.have.length(1)
    //       // expect(wrapper.find('button').props().src).to.contain(avatar.url)
    //     })
    //   })
    // )
    return story
  }))
