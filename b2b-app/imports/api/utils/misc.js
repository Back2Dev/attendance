export const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max))
}

export const randomId = (n = 17) => {
  const UNMISTAKABLE_CHARS = '23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz'
  const digits = []
  for (var i = 0; i < n; i++) {
    const ix = getRandomInt(UNMISTAKABLE_CHARS.length)
    digits[i] = UNMISTAKABLE_CHARS[ix]
  }
  return digits.join('')
}

export const getSlugFromString = (str) => {
  const regex = /\W+/
  return str.replace(regex, '-')
}
