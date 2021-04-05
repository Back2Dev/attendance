import { Meteor } from 'meteor/meteor'
const debug = require('debug')('b2b:meteorCall')

function useMeteor() {
  const meteorCall = async (method, description, params, slow) => {
    try {
      if (slow) debug(description || `Calling ${method}`)
      const s = await Meteor.callAsync(method, params)
      if (s)
        if (s.status === 'success') {
          if (description && s.message) debug(s.message)
        } else {
          debug(`Error ${s.message}`)
        }
      return s
    } catch (e) {
      debug(`Error ${e.message}`)
      return { status: 'failed', message: e.message }
    }
  }

  return {
    meteorCall,
  }
}

export default useMeteor
