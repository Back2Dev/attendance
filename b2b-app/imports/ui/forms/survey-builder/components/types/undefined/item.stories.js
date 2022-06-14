import React from 'react'
import { Item } from './item'

export default {
  title: 'Survey Builder/Types/Undefined/Inner/Item',
  component: Item,
}

const Template = (args) => <Item {...args} />

export const Default = Template.bind({})
Default.args = {
  showMobileActions: false,
}

export const PrefilledText = Template.bind({})
PrefilledText.args = {
  text: 'Prefilled text',
}

export const MoveUpDisabled = Template.bind({})
MoveUpDisabled.args = {
  disableMove: (direction) => direction === 'up',
}

export const MoveDownDisabled = Template.bind({})
MoveDownDisabled.args = {
  disableMove: (direction) => direction === 'down',
}

export const RemoveDisabled = Template.bind({})
RemoveDisabled.args = {
  disableRemove: true,
}
