import { action } from '@storybook/addon-actions'
import React from 'react'
import SignatureDialog from './draw-signature-dialog'

export default {
  title: 'Pages/Webform',
  component: SignatureDialog,
  parameters: {
    layout: 'fullscreen',
    actions: { argTypesRegex: '^on.*' },
  },
}

export const SignDialog = {
  args: {
    open: true,
    handleClose: action('close'),
    submitSignature: action('submit'),
    uploadSignature: action('uploadSignature'),
  },
}
