import { Session } from 'meteor/session'

const destinations = {
  kiosk: '/kiosk',
  normal: '/volsignin',
  shop: '/shop',
  default: '/'
}

const goHome = () => {
  const mode = Session.get('mode')
  const dest = destinations[mode] || destinations.default
  return dest
}

export default goHome