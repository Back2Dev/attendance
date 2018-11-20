// member-add.stories.js
import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { Welcome } from '@storybook/react/demo'
import { withInfo } from '@storybook/addon-info'
import { withKnobs, number, boolean, select } from '@storybook/addon-knobs/react'
import StoryRouter from 'storybook-router'

import schemas from '/imports/ui/config/member-add-schemas'
import MemberAddControl from './member-add-control'

storiesOf('Member.Add', module)
  .addDecorator(withKnobs)
  .addDecorator(StoryRouter())

  .add('MemberAddControl', (() => {
// NB Select control only works with strings
    let step = number("Step",1)
//
// This event handler fires ok, but doesn't update the control
// I tried looking at the knobs code, but couldn't work out what
// to call to trigger the update.
//
    const move = (delta) => {
      try {
        action("move")(delta)
  // Updating the step does cause a refresh, methinks it should
        step = step + delta
      } catch(error) {
        console.log("Error", error)
      }
    }
    const story = (
      <div><p>Use Knobs to select step, currently on step {step}</p>
        <MemberAddControl
          step={step}
          backStep={() => move(-1)}
          nextStep={() => move(1)}
          onSubmit={action("submit")}
          totalSteps={4}
          resetId={action("resetId")}
        />
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
  }))
