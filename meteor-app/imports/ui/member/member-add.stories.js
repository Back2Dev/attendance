// member-add.stories.js
import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { Welcome } from '@storybook/react/demo'
import { withInfo } from '@storybook/addon-info'
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react'
import StoryRouter from 'storybook-router'

import { Grid, Container, Segment } from 'semantic-ui-react'
import MemberAdd from './member-add'

storiesOf('Member.Add', module)
  // .addDecorator(withKnobs)
  .addDecorator(StoryRouter())

  .add('MemberAdd', withInfo('Add member')(() => {
    const story = (
      <div><p>Use Knobs to show checked in/out status</p>
        <MemberAdd
        />
      </div>
    )
    specs(() =>
      describe('<MemberAdd />', () => {
        it('displays the add member wizard', () => {
          const wrapper = mount(story)
          expect(wrapper.find('button')).to.have.length(1)
          // expect(wrapper.find('button').props().src).to.contain(avatar.url)
        })
      })
    )
    return story
  }))
