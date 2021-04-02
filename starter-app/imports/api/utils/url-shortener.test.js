import urlShort from '/imports/api/utils/url-shortener'
import { expect } from 'chai'

describe('Runs the url shortener function', () => {
  it('successfully shrinks the url', async () => {
    let url = 'https://google.com'
    let result = await urlShort(url)
    expect(typeof result).to.be.equal('string')
    expect(result.length).to.be.equal(7)
  })
})
