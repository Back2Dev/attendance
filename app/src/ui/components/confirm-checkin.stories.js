// confirm-checkin.stories.js
import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { Welcome } from '@storybook/react/demo'
import StoryRouter from 'storybook-router'
import { withInfo } from '@storybook/addon-info'
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react'

import { Link, Router, browserHistory } from 'react-router-dom'
import { Grid, Container, Segment } from 'semantic-ui-react'

import ConfirmCheckin from './confirm-checkin'

const match = {
	params: {
		id: '1234'
	}
}

const person = {
	id: '123ASD', 
	name: 'Mickey', 
	surname: 'Mouse', 
	avatar: '2.jpg',
}

storiesOf('Components | Confirm checkin', module)
  .addDecorator(StoryRouter())
  .addDecorator(withKnobs)

  .add('ConfirmCheckin', withInfo('Checked in/out')(() => {
    const story = (
      <div><p>Use Knobs to show check in confirmation</p>
        <ConfirmCheckin 
          loading={boolean('Loading', false)}
					isCheckedIn={boolean('Checked in', false)}
        	person={person}
        />
      </div>
    )
    // specs(() =>
    //   describe('<ConfirmCheckin avatar={avatar} />', () => {
    //     it('displays an ConfirmCheckin', () => {
    //       const wrapper = mount(story);
    //       expect(wrapper.find('img')).to.have.length(1);
    //       expect(wrapper.find('img').props().src).to.contain(avatar.url);
    //     });
    //   })
    // );
    return story;
  }))

