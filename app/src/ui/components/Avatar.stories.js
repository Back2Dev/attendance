import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { Welcome } from '@storybook/react/demo'
import StoryRouter from 'storybook-router'

import { Link, Router, browserHistory } from 'react-router-dom'
import { Grid, Container, Segment } from 'semantic-ui-react'

import Avatar from './Avatar'

storiesOf('Components', module)
  .addDecorator(StoryRouter())
  // .add('AddVolunteer', () => ( <AddVolunteer /> ))
  .add('Avatar - checked out', () => ( 
    <Avatar 
      _id="aab45bb"
      firstName="Ed"
      lastName="Sheeran"
      fileName="3.jpg"
      isCheckedIn={false}
    /> ))

  .add('Avatar - checked in', () => ( 
    <Avatar 
      _id="aab45bb"
      firstName="Ed"
      lastName="Sheeran"
      fileName="2.jpg"
      isCheckedIn={true}
    /> ))

