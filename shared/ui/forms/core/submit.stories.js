import { action } from '@storybook/addon-actions'
import React from 'react'
import Preview from './preview'
import WebformContext from '../form-context'

import { AccountContext } from '/imports/ui/contexts/account-context'

const vals = {
  formData: {
    client: {},
    property: { 'certificate-volume': '91191', 'certificate-folio': '911' },
  },
  currentRole: 'PART',
  webDoc: {
    type: 'cdc',
    formData: {
      practice: {
        'practice-name': 'Settle Easy VIC',
        'practice-license': '001632L',
        'practice-address': 'Level 6, 530 Collins St, Melbourne, VIC 3000',
        'practice-abn': '20 625 000 651',
      },
      customer: {
        signers: [
          {
            'signers-name': 'Charlie Customer',
            'signers-email': 'charlie.customer@test.com',
            'signers-residential': '1 Easy St, Nirvana VIC 3999, Australia',
          },
          {
            'signers-name': 'Cathy Customer',
            'signers-email': 'cathy.customer@settleeasy.com.au',
            'signers-residential': '1 Easy St, Nirvana VIC 3999, Australia',
          },
        ],
      },
      property: {
        'property-address': '1 Easy St, Nirvana VIC 3999, Australia',
        'certificate-titles': '12345/678',
      },
      costs: {
        'invoice-cost': '600',
        'invoice-gst': '100',
        'invoice-totalCost': '1,100',
        'invoice-disbursements': '400',
      },
    },
    surveyId: 'QWbGTB7DTpHyhqm8Z',
    formStatus: 'progress',
    who: 'E3mpYj8w5SgWtWsbo',
    signatures: [
      {
        userId: 'cG6DwTok7JB8wu59N',
        name: 'Geronimo Yawns',
        signer_role: 'PM1',
      },
    ],
    notes: [],
    status: 'draft',
    docName: 'cdc.pdf',
    url: 'participant_documents/2NXDv5vxvamQAHtgy/cdc.pdf',
  },
  signatures: [
    {
      userId: 'cG6DwTok7JB8wu59N',
      name: 'Geronimo Yawns',
      signer_role: 'PM1',
    },
  ],
  job: {
    propertyAddress: '123 ABC St.,Melbourne, Vic 3000',
    name: 'Test Buyer1',
    email: 'test@email.com',
    mobile: '0400000000',
    doc: {
      status: 'accepted',
      notes: [
        {
          _id: 'abcd',
          name: 'Tester',
          who: 'Conveyancer',
          when: new Date(),
          description: 'Contact detail is missing',
          docType: 'Section 32',
        },
      ],
    },
  },
}

const accVal = {
  incomplete: false,
  viewas: 'PART',
  user: {
    _id: 'user1',
    name: 'Tester',
  },
}
export default {
  title: 'Pages/Webform/Preview',
  component: Preview,
  parameters: {
    actions: { argTypesRegex: '^on.*' },
  },
  decorators: [
    (Story) => (
      <AccountContext.Provider value={{ ...accVal }}>
        <WebformContext.Provider value={{ ...vals }}>
          <Story />
        </WebformContext.Provider>
      </AccountContext.Provider>
    ),
  ],
}

export const AddSig = {
  args: {
    addSignature: action('addSignature'),
    complete: action('complete'),
    fieldTypes: {},
    handleDownload: action('handleDownload'),
    survey: {
      signatures: [
        {
          userId: 'cG6DwTok7JB8wu59N',
          name: 'Geronimo Yawns',
          signer_role: 'PM1',
        },
      ],
    },
    task: { _id: 'abcd' },
    userSigUrl: 'https://sign.example.png',
    template: {},
    reject: action('reject'),
    notes: {},
    backToWebform: action('backToWebform'),
    epilogue: 'Welcome',
    documentList: [],
    submitSignature: action('submitSignature'),
    uploadSignature: action('uploadSignature'),
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
