const { expect } = require('chai')
const debug = require('debug')('-cache')
/*
 * Results cache - used in testing to make it easier to write integration tests
 *
 * Why?
 *  Mocha does things in a strange way. It appears to parse the Javascript code,
 * and execute parts of it. It stacks up the calls to `describe()`, `it()` and `expect()`, and
 * executes these afterwards. This makes it immensely difficult to do any kind of
 * complicated logic unless you put it all in one `it()` block. That would work, but
 * you lose the granularity of seeing all the expect calls made.
 *
 * How it works:
 *
 * At the beginning of the describe block, initialise a results cache,
 *   const cache = resultsCache.INIT('Result run')
 *
 * and then perform whatever operations you want with code as normal. This code
 * will be run by Mocha before the "official tests".
 *
 * Intersperse you code with calls to `expecting()` like this:
 *   cache.expecting('2nd one (success)', v2, 'equal', '345')
 *
 * These are test cases that are saved into the cache.
 *
 * Once you are done with the logic, just call cache.showResults()
 *
 * - this will then call the Mocha `it()` method repeatedly
 * - and you will see your test results as you expect
 */
const _expecting = (result) => (description, value, comparator, expected) => {
  const info = {
    step: result.step || '',
    value,
    comparator,
    expected,
    when: new Date(),
    description,
  }
  result.items.push(info)
}

const _showResults = (result) => (res2) => {
  const res = res2 ? res2 : result
  let step = ''
  // Group the results by step...
  const stacks = {}
  res.items.forEach((r) => {
    const key = r.step || ''
    if (!stacks[key]) stacks[key] = []
    stacks[key].push(r)
  })
  // Add a describe block around them:
  Object.keys(stacks).forEach((stack) => {
    describe(stack, () => {
      stacks[stack].forEach((r) => {
        it(r.description, () => {
          switch (r.comparator) {
            case 'equal':
              expect(r.value).to.be.equal(r.expected)
              break
            case 'ne':
              expect(r.value).to.be.not.equal(r.expected)
              break
            case 'match':
              expect(r.value).to.be.match(r.expected)
              break
            case 'be.an':
              expect(r.value).to.be.an(r.expected)
              break
            default:
              console.error(`Unsupported comparison: ${r.comparator}`)
          }
        })
      })
    })
  })
}

// Trick to pass in to the curried function
const runResults = (result) => {
  describe(result.name, () => {
    _showResults()(result)
  })
}

// Report to debug channel
const _debugResults = (result) => () => {
  result.items.forEach((r) => {
    debug(`${result.name} - ${r.description}`)
    switch (r.comparator) {
      case 'equal':
        if (r.value !== r.expected) debug(`Expected ${r.value} to equal ${r.expected}`)
        break
      case 'ne':
        if (r.value === r.expected)
          debug(`Expected ${r.value} to not equal ${r.expected}`)
        break
      case 'match':
        if (r.value.match(r.expected)) debug(`Expected ${r.value} to match ${r.expected}`)
        expect(r.value).to.be.match(r.expected)
        break
      case 'be.an':
        if (typeof r.value !== r.expected)
          debug(`Expected ${r.value} to be an ${r.expected}`)
        break
      default:
        console.error(`Unsupported comparison: ${r.comparator}`)
    }
  })
}

const resultsCache = {
  INIT: (name) => {
    const result = { name, items: [], when: new Date() }
    // Send the results to mocha for pretty output
    const showResults = () => {
      return _showResults(result)()
    }
    // Return the raw data for reporting later 'Ron
    const dumpResults = () => {
      return result
    }
    const debugResults = () => {
      return _debugResults(result)()
    }

    const expecting = (description, value, comparator, expected) => {
      return _expecting(result)(description, value, comparator, expected)
    }

    const describe = (step) => {
      // Replace the description of the step
      result.step = step
    }

    return {
      result,
      describe,
      showResults,
      dumpResults,
      debugResults,
      expecting,
    }
  },
}

module.exports = resultsCache
module.exports.runResults = runResults
