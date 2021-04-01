export function seed(id) {
  return id
    ? id
      .toLowerCase()
      .split('')
      .reduce((a, c) => a * 10 + c.charCodeAt(0), 10)
    : 0
}