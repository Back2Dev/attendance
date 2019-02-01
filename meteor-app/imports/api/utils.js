// Shorten names to first name + last initial
export const shorten_name = name => {
  let ans = name || ''
  const words = ans.split(/[ \t]+/)
  if (words.length > 1) {
    const last = words.pop()
    const first = words.shift()
    ans = `${first} ${last.charAt(0).toUpperCase()}`
  }
  return ans
}
