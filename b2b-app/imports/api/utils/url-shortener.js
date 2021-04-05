const urlShort = (url) => {
  /**
   * Pass in a url
   * get back string of 7
   */
  return new Promise((resolver, reject) => {
    if (url) {
      let h = 0
      let l = url.length
      let i = 0
      if (l > 0) while (i < l) h = ((h << 5) - h + url.charCodeAt(i++)) | 0
      // resolver(h < 0 ? h - 1 : h).toString(58)
      resolver((h < 0 ? h - 1 : h).toString(36))
    } else {
      reject(new Error('Invalid param received !'))
    }
  })
}
export default urlShort
