import { Meteor } from 'meteor/meteor'
import React from 'react'

/** This is the container for plugins.
 *   To add a plugin, simply import a plugin wrapper from here,
 *      and render it below.
 *   To replace a plugin, change the import statement (easy as that)
 */
import Toast from './toast'
// import Chat from  './drift'

// Render the plugins
const Plugins = () => (
  <span>
    <Toast />
    {/* <Chat settings={Meteor.settings.public} /> */}
  </span>
)

export default Plugins
