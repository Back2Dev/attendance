import { Avatar, Button, ButtonGroup, IconButton } from '@material-ui/core'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import DeleteIcon from '@material-ui/icons/Delete'
import React from 'react'
import { Navbar } from './navbar'

export default {
  title: 'Survey Builder/Layouts/Mobile/Navbar',
  component: Navbar,
  subcomponents: { 'Navbar.Button': Navbar.Button },
  parameters: {
    viewport: {
      defaultViewport: 'iphone6',
    },
    layout: 'fullscreen',
  },
}

const Template = (args) => <Navbar {...args} />

export const Default = Template.bind({})
Default.args = {
  onBack: null,
}

export const Title = Template.bind({})
Title.args = {
  ...Default.args,
  middle: 'title',
}

export const Right = Template.bind({})
Right.args = {
  ...Default.args,
  right: <Navbar.Button align="right">Right</Navbar.Button>,
}

export const Back = Template.bind({})
Back.args = {
  backTitle: 'root',
  onBack: () => {},
}

export const Custom = Template.bind({})
Custom.args = {
  left: <Avatar>H</Avatar>,
  middle: (
    <ButtonGroup color="primary" size="small">
      <Button>One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
    </ButtonGroup>
  ),
  right: (
    <>
      <IconButton size="small">
        <ArrowDownwardIcon />
      </IconButton>
      <IconButton size="small">
        <DeleteIcon />
      </IconButton>
    </>
  ),
}
