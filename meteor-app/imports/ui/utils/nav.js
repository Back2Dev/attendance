//
// This module acts as a replacement for meteor/session
const sessionStore = {}

const context = {
  get: name => sessionStore[name],
  set: (name, val) => (sessionStore[name] = val),
  clear: name => delete sessionStore[name]
}

const destinations = {
  kiosk: '/kiosk',
  normal: '/volsignin',
  shop: '/shop',
  default: '/'
}

const goHome = () => {
  const mode = context.get('mode')
  const dest = destinations[mode] || destinations.default
  return dest
}

export default context
