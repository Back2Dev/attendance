import { action } from '@storybook/addon-actions'
import React from 'react'
import SignatureModal from './signature-modal'

export default {
  title: 'Pages/Webform/SignModal',
  component: SignatureModal,
  parameters: {
    actions: { argTypesRegex: '^on.*' },
  },
}

export const WithSign = {
  args: {
    handleClose: action('handleClose'),
    open: true,
    addSignature: action('addSignature'),
    verbiage: { paragraphs: [''] },
    userSigUrl: 'https://sign.example.png',
    signer: {
      name: 'signer',
      role: 'user',
    },
    getSMSCode: (...params) => {
      action('getSMSCode')(...params)
      return { status: 'success', message: '1234' }
    },
    checkSMSCode: (...params) => {
      action('checkSMSCode')(...params)
      return true
    },
    invalidateSMSCodes: action('invalidateSMSCodes'),
  },
}

export const NoSign = {
  args: {
    handleClose: action('handleClose'),
    open: true,
    addSignature: action('addSignature'),
    verbiage: { paragraphs: [] },
    userSigUrl: '',
    signer: {
      name: 'signer',
      role: 'user',
    },
    getSMSCode: (...params) => {
      action('getSMSCode')(...params)
      return { status: 'success', message: '1234' }
    },
    checkSMSCode: (...params) => {
      action('checkSMSCode')(...params)
      return true
    },
    invalidateSMSCodes: action('invalidateSMSCodes'),
  },
}
export const WithVerbiage = {
  args: {
    handleClose: action('handleClose'),
    open: true,
    addSignature: action('addSignature'),
    verbiage: { paragraphs: ['I am a test verbiage1'] },
    userSigUrl: 'http://abcd.example.png',
    signer: {
      name: 'signer',
      role: 'user',
    },
    getSMSCode: (...params) => {
      action('getSMSCode')(...params)
      return { status: 'success', message: '1234' }
    },
    checkSMSCode: (...params) => {
      action('checkSMSCode')(...params)
      return true
    },
    invalidateSMSCodes: action('invalidateSMSCodes'),
  },
}
