const crypto = require('crypto')

/**
* All the supported hash algorithms
*/
const supportedHashAlgo = [
  'md5',
  'sha1',
  'sha256',
  'sha512',
  'ripemd160'
]

class SECHash {
  constructor (hashalgo) {
    if (supportedHashAlgo.indexOf(hashalgo) < 0) {
      throw new TypeError('Expected a supported hash algorithm')
    }
    this.hashalgo = hashalgo
  }

  /**
  * hash
  * @desc Returns hash result
  * @param {String} data - Data for hash calculation
  * @param {String} hashalgo - Hash algorithm, must match "supportedHashAlgo"
  * @return {String}
  * @example
  * const hash = digest("sha256", 'a')
  */
  hash (data) {
    return crypto.createHash(this.hashalgo).update(data).digest('hex')
  }

  getHashLength () {
    if (this.hashalgo === 'md5') {
      return 32 // byte
    } else if (this.hashalgo === 'sha1') {
      return 40 // byte
    } else if (this.hashalgo === 'sha256') {
      return 64 // byte
    } else if (this.hashalgo === 'sha512') {
      return 128 // byte
    } else if (this.hashalgo === 'ripemd160') {
      return 40 // byte
    } else {
      throw TypeError('Wrong hash algorithm')
    }
  }
}

module.exports = SECHash