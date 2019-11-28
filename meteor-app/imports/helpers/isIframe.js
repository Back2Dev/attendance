function isIframe(reg) {
  if (window.parent.location === window.location) return false
  if (window.location.href.match(reg)) return true
}

export default isIframe
