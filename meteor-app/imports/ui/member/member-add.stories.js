// member-add.stories.js
import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { Welcome } from '@storybook/react/demo'
import { withInfo } from '@storybook/addon-info'
import { withKnobs, number, boolean, select } from '@storybook/addon-knobs/react'
import { specs, describe, it } from 'storybook-addon-specifications'
import { mount } from 'enzyme';
import StoryRouter from 'storybook-router'
import { BrowserRouter as Router } from 'react-router-dom'

import { Grid, Container, Segment } from 'semantic-ui-react'
import MemberAdd from './member-add'

storiesOf('Member.Add', module)
  .addDecorator(withKnobs)
  .addDecorator(StoryRouter())

  .add('MemberAdd', withInfo('Add member')(() => {
    const story = (
      <Router>
        <div><p>Use Knobs to select step</p>
          <MemberAdd
            step={number("Step",3)}
            addMember={action("addMember")}
            error={false}
            success={true}
            message="OK"
            resetId={action("resetId")}
          />
        </div>
      </Router>
    )
    specs(() =>
      describe('<MemberAdd />', () => {
        it('displays the add member wizard', () => {
          const wrapper = mount(story)
// Something ugly goes on here - first render it's zero, second render it's right
          expect(wrapper.find('button')).to.have.length(1)
          // expect(wrapper.find('button').props().src).to.contain(avatar.url)
        })
      })
    )
    return story
  }))
