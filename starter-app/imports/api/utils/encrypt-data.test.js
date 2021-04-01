import { encrypt, decrypt } from './encrypt-data'
import { expect } from 'chai'

describe('changes the string to a encrypted piece of data', () => {
  let encrypted
  let testText = 'iamasecret'

  it('encrypts the data', () => {
    const result = encrypt(testText)
    encrypted = result
    expect(typeof result).to.be.equal('string')
    expect(result.length).to.be.greaterThan(32)
  })

  it('decrypts the data', () => {
    const result = decrypt(encrypted)
    expect(result).to.be.equal(testText)
    expect(typeof result).to.be.equal('string')
  })

  it('fails to decrypt when passed incorrect data', () => {
    const randomString = 'sdfdsfh3423fdsfdsfsdfdsfka432hdfgf43hjhasjdhsagsgfgfdgfddhsa2'
    expect(() => decrypt(randomString)).to.throw('Invalid IV length')
  })

  it('fails to encrypt the data due to data not being a string', () => {
    let badTestData = 1234
    expect(() => encrypt(badTestData)).to.throw('argument is not a string')
  })
})
