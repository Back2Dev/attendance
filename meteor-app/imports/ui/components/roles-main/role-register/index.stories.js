// user.stories.js
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

import Role from './index'

const match = {
	params: {
		id: '12344'
	}
}

const member = {
	_id: '123ASD', 
	firstname: 'Mickey', 
	lastname: 'Mouse', 
	avatar: '2.jpg',
}

storiesOf('Role', module)
  .addDecorator(StoryRouter())
  .addDecorator(withKnobs)

  .add('Attend', withInfo('Checked in/out')(() => {
    const story = (
      <div><p>Use Knobs to show check in state</p>
        <Role 
          loading={boolean('Loading', false)}
          isCheckedin={boolean('Checked in', false)}
          role={member}
        />
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

