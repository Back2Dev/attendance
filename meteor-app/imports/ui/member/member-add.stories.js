// member-add.stories.js
import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'
import { withKnobs, number, text } from '@storybook/addon-knobs/react'
// import { specs, describe, it } from 'storybook-addon-specifications'
import { mount } from 'enzyme'
import { BrowserRouter as Router } from 'react-router-dom'
import { expect } from 'chai'

import getSchemas from '/imports/ui/config/member-add-schemas'
import MemberAdd from './member-add'

const STORY_NAME = 'MemberAdd'
const avatar = { url: '/images/avatars/default.jpg' }

storiesOf('Member.Add', module)
  .addDecorator(withInfo)
  .addDecorator(withKnobs)

  .add(
    STORY_NAME,
    () => {
      const story = (
        <Router>
          <div>
            <p>Use Knobs to select step</p>
            <MemberAdd
              step={number('Step', 3)}
              addMember={action('addMember')}
              setMember={action('setMember')}
              error={false}
              success
              message="OK"
              resetId={action('resetId')}
              schemas={getSchemas(text('Custom schema (b2b/pa/...)', 'b2b'))}
            />
          </div>
        </Router>
      )
      // specs(() =>
      //   describe(STORY_NAME, () => {
      //     it('displays the add member wizard', () => {
      //       const wrapper = mount(story)
      //       console.log(wrapper.find('#avatar'))
      //       expect(wrapper.find('#avatar').src).to.contain(avatar.url)
      //       // Something ugly goes on here - first render it's zero, second render it's right
      //       // if (expect(wrapper.find('button')).to) {
      //       //   expect(wrapper.find('button')).to.have.length(1)
      //       // }
      //     })
      //   })
      // )
      return story
    },
    { info: 'Add member' }
  )
