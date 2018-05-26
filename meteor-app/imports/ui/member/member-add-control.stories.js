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
    let step = parseInt(select('Step No',["0","1","2","3"],"3"))
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
          page={number("Page",1)}
          step={step}
          backStep={() => move(-1)}
          nextStep={() => move(1)}
          onSubmit={action("submit")}
          totalSteps={4}
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
