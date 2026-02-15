import React from 'react'

import dbg from 'debug'
const debug = dbg('app:ekit-q3')

const fields = 'should spent activity'.split(' ')
// This file only provides a custom validator. (Form is not used)

export const validator = function () {
  // Only pick up one key for this validation
  debug('validating:  ' + this.key)
  if (['activities', 'hours__should'].includes(this.key)) {
    debug(`Validating ekit-q3`)
    const n = [0, 1, 2, 3, 4, 5]
      .map((n) => {
        return fields.every((f) => {
          const key = `activities.${n}.activities__${f}`
          debug(key, this.field(key))
          return this.field(`activities.${n}.activities__${f}`).value
        })
      })
      .filter(Boolean).length
    if (n < 3) {
      const msg = `Please provide at least 3 activities (only ${n} are complete)`
      debug(msg)
      this.addValidationErrors([
        { name: 'activities.2.activities__activity', type: 'minActivities', value: n },
      ])
      // throw new Error(msg)
      return 'minActivities'
    }
  }
}

/**
 *
 * Custom form - will become great!
 *
 */
export const form = (props) => {
  return <span>CUSTOM Q3 FORM GOES HERE</span>
}

// Default export not really necessary
export default { form, validator }
