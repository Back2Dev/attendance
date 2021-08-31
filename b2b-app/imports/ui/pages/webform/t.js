import React from 'react'
import AccountBox from '@material-ui/icons/AccountBox'
import { makeTranslator, createMap } from '@ui-schema/ui-schema'
import * as en from '@ui-schema/dictionary/en'
import * as de from '@ui-schema/dictionary/de'

const icons = {
  AccountBox: () => <AccountBox />,
}

const dicEN = createMap({
  error: en.errors,
  labels: { ...en.labels, ...en.richText, ...en.dnd },
  widget: {
    stepper: {
      'step-1': {
        surname: { title: 'Surname' },
      },
    },
    qty: { title: 'Quantity' },
  },
  icons,
})

const dicDE = createMap({
  error: de.errors,
  labels: { ...de.labels, ...de.richText, ...de.dnd },
  widget: {
    stepper: {
      'step-1': {
        surname: { title: 'Nachname' },
      },
    },
    headline: { title: 'Überschrift' },
    qty: { title: 'Anzahl' },
    length: { title: 'Länge' },
  },
  icons,
})

const tEN = makeTranslator(dicEN, 'en')
const tDE = makeTranslator(dicDE, 'de')

const browserT = (text, context, schema) => {
  const locale = window.localStorage.getItem('locale') || navigator.language
  return locale === 'de' ? tDE(text, context, schema) : tEN(text, context, schema)
}

export { browserT }
