import React from 'react'
import html2react from 'html-react-parser'

export default html2r = (str) => {
  try {
    const buf = html2react(str)
    if (['function', 'string'].includes(typeof buf) || Array.isArray(buf)) return buf
    console.log(buf)
    return <span>Invalid HTML?</span>
  } catch (e) {
    return <span>I could not parse the HTML properly in ${str}</span>
  }
}
