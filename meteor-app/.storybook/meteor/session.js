const s = {}

export const Session = {
  get: name => s[name],
  set: (name, val) => (s[name] = val),
  clear: name => delete s[name]
}
