import { Meteor } from 'meteor/meteor'

import React from 'react'
import { createRoot } from 'react-dom/client'

import App from '/imports/ui/app'

Meteor.startup(() => {
  const container = document.getElementById('root')
  if (container) {
    const root = createRoot(container)
    root.render(<App />)
  }
})
