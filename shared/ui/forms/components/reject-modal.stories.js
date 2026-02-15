import { action } from '@storybook/addon-actions'
import React from 'react'
import RejectModal from './reject-modal'

export default {
  title: 'Pages/Webform',
  component: RejectModal,
  parameters: {
    actions: { argTypesRegex: '^on.*' },
  },
}

export const Reject = {
  args: {
    open: true,
    handleClose: action('close'),
    reject: action('reject'),
  },
}
