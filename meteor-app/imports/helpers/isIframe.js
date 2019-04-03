function isIframe(item) {
  if (window.parent.location === window.location) return false
  const reg = new RegExp(item + '$')
  if (window.location.href.match(reg)) return true
}

export default isIframe
