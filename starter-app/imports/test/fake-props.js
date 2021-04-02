import faker from 'faker'
import CONSTANTS from '/imports/api/constants'
import { seed } from '/imports/lib/'

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

const randomId = () => {
  const UNMISTAKABLE_CHARS = '23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz'
  const digits = []
  for (var i = 0; i < 17; i++) {
    const ix = getRandomInt(UNMISTAKABLE_CHARS.length)
    digits[i] = UNMISTAKABLE_CHARS[ix]
  }
  return digits.join('')
}

const seededRandomId = (input) => {
  faker.seed(input)
  const UNMISTAKABLE_CHARS = '23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz'
  const digits = []
  for (var i = 0; i < 17; i++) {
    const ix = faker.random.number({
      min: 0,
      max: UNMISTAKABLE_CHARS.length - 1,
    })
    digits[i] = UNMISTAKABLE_CHARS[ix]
  }
  return digits.join('')
}

faker.seed(123)

export function generate(times, cb) {
  let result = []
  for (let i = 0; i < times; i++) {
    result.push(cb({}))
  }
  return result
}
