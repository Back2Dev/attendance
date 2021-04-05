const crypto = require('crypto')

const algorithm = 'aes-256-ctr'
const secretKey = Meteor.settings.private.API_SECRET || 'BPNBEMPGOFOWUMHB72265WL3Y04ENQ5X'
const iv = crypto.randomBytes(16)

const encrypt = (text) => {
  if (typeof text !== 'string') throw new Error(`argument is not a string`)
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv)
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()])
  return iv.toString('hex').concat(encrypted.toString('hex'))
}

const decrypt = (hash) => {
  const hashIV = hash.substring(0, 32)
  const hashContent = hash.substring(32)

  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(hashIV, 'hex')
  )

  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(hashContent, 'hex')),
    decipher.final(),
  ])

  return decrpyted.toString()
}

module.exports = {
  encrypt,
  decrypt,
}
