import { action } from '@storybook/addon-actions'
import React from 'react'
import ReviewNotes from './review-notes-modal'

export default {
  title: 'Pages/Webform',
  component: ReviewNotes,
  parameters: {
    actions: { argTypesRegex: '^on.*' },
  },
}

export const NotesReview = {
  args: {
    open: true,
    handleClose: action('close'),
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
}
