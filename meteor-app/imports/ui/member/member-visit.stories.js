// member-visit.stories.js
import React from 'react'
import ReactDOM from 'react-dom'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { Welcome } from '@storybook/react/demo'
import StoryRouter from 'storybook-router'
import { withInfo } from '@storybook/addon-info'
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react'

import { Link, Router, browserHistory } from 'react-router-dom'
import { Grid, Container, Segment } from 'semantic-ui-react'
import member from '/imports/test/fake-member'

import MemberVisit from './member-visit'

const match = {
  params: {
    id: '12344'
  }
}

const updateMember = () => {
  const options = {
    isHere: boolean('Present', false),
    isSuper: boolean('Is Supervisor', true),
    sessionCount: boolean('Is Newbie', true) ? 1 : 25,
  }
  return Object.assign(member, options)
}

console.log('running storbyook')



storiesOf('Member.Session', module)
  .addDecorator(StoryRouter())
  .addDecorator(withKnobs)

  .add('Attend', withInfo('Here/Absent')(() => {
    const story = (
      <div>
      <p>When component is unmounted, the <code>clearPin</code> function should run.</p>
        {
          boolean('mounted', true) &&
          <MemberVisit
            loading={boolean('Loading', false)}
            member={updateMember()}
            validPin={boolean('valid pin', false)}
            recordVisit={action('record visit')}
            clearPin={() => alert('clearing pin')}
            checkPin={(pin) => action('checking PIN: ' + pin)()}
            cancelClick={action('cancel')}
            isDefaultPin={boolean('hasnt set their own pin', false)}
            setCustomPin={(pin) => action('setting custom pin ', pin)()}
          />
        }
      </div>
    )
    // specs(() =>
    //   describe('<User avatar={avatar} />', () => {
    //     it('displays an User', () => {
    //       const wrapper = mount(story);
    //       expect(wrapper.find('img')).to.have.length(1);
    //       expect(wrapper.find('img').props().src).to.contain(avatar.url);
    //     });
    //   })
    // );
    return story;
  }))

