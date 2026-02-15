import { expect } from 'chai'
import headerFns from '/imports/ui/forms/utils/header-fns'
const debug = require('debug')('app:header-fns')

describe('Utilities: header-functions', () => {
  it(`computes the api-auth-sig for unleashed `, () => {
    expect(() => {
      const headers = { 'Content-Type': 'application/json' } // Provide an simple object for headers
      headerFns.unleashed(
        headers,
        'name=Company Name&address=My Street',
        'xHVU8jzQ8o0AJWG1R1cG8xJnKj1NhhTekhchUQ9NEA4YE5LSVGE91zmUAKbyRvZ1q9k3K9V38JqFWWjPwWQ'
      )
      debug({ headers })
    }).not.to.throw()
  })
})
