import { Meteor } from 'meteor/meteor'
import 'meteor/aldeed:collection2'
import 'meteor/aldeed:collection2/main'

import React from 'react'
import { createRoot } from 'react-dom/client'

import '/imports/startup/patch-uniforms'
import App from '/imports/ui/app'

Meteor.startup(() => {
  if (module.hot) {
    module.hot.decline()
  }
  const container = document.getElementById('root')
  if (container) {
    const root = createRoot(container)
    root.render(<App />)
  }
})
