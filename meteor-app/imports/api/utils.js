// Shorten names to first name + last initial
export const shorten_name = (name) => {
  let ans = name || ''
  const words = ans.split(/\s+/)
  if (words.length > 1) {
    const last = words.pop()
    const first = words.shift()
    ans = `${first} ${last.charAt(0).toUpperCase()}`
  }
  return ans
}

export const accessByPath = (obj, path) => {
  if (typeof path !== 'string') return ''
  const paths = path.split('.')
  return paths.reduce((acc, path) => {
    if (!acc) return ''
    if (acc[path]) return acc[path] || ''
    return ''
  }, obj)
}

// Pruning
export const pruneByPath = (obj, path) => {
  if (typeof path !== 'string') return ''
  const paths = path.split('.')
  return paths.reduce((acc, path, ix) => {
    if (!acc) return ''
    if (ix === paths.length - 1) {
      const pruned = acc[path]
      delete acc[path]
      return pruned
    }
    if (acc[path]) return acc[path] || ''
    return ''
  }, obj)
}
