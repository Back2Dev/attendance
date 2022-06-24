import React from 'react'
import { Item } from './item'

export default {
  title: 'Survey Builder/Types/Single/Inner/Item',
  component: Item,
}

const Template = (args) => <Item {...args} />

export const Default = Template.bind({})
Default.args = {
  showMobileActions: false,
  // text: 'Single',
  placeholder: 'Placeholder',
  label: 'Label',
  isIdChecked: false,
  // actions: ['remove'],
  type: 'answer',
  // showMore: true,
}

export const QuestionField = Template.bind({})
QuestionField.args = {
  ...Default.args,
  showMore: true,
  actions: ['add', 'remove', 'upload'],
  type: 'question',
}

export const AnswerField = Template.bind({})
AnswerField.args = {
  ...Default.args,
  actions: ['add', 'remove', 'upload'],
  type: 'answer',
}

export const OptionField = Template.bind({})
OptionField.args = {
  ...Default.args,
  actions: ['deleteOption'],
  type: 'option',
}

// export const PrefilledText = Template.bind({})
// PrefilledText.args = {
//   ...Default.args,
//   text: 'Prefilled text',
// }

// export const MoveUpDisabled = Template.bind({})
// MoveUpDisabled.args = {
//   ...Default.args,
//   disableMove: (direction) => direction === 'up',
// }

// export const MoveDownDisabled = Template.bind({})
// MoveDownDisabled.args = {
//   ...Default.args,
//   disableMove: (direction) => direction === 'down',
// }

// export const RemoveDisabled = Template.bind({})
// RemoveDisabled.args = {
//   ...Default.args,
//   disableRemove: true,
// }
