const SECUtil = require('@sec-block/secjs-util')
const SECTokenBlockModel = require('../model/tokenchain-block-model')

class SECTokenBlock {
  /**
    * create a token chain block with config
    * @param {*} config
    *
    */
  constructor (config = {}) {
    this.config = config
    this.block = SECTokenBlockModel
    this.blockBuffer = []
    this.blockHeader = {}
    this.blockHeaderBuffer = []
    this.blockHeaderPOWBuffer = []
    this.blockBody = []
    this.blockBodyBuffer = []
    this.hasHeader = false
    this.hasBody = false
    if (Object.keys(config).length !== 0) {
      this._generateBlock()
    }
  }

  setBlockchain (tokenBlockchain) {
    this.tokenBlockchain = tokenBlockchain
  }

  getBlock () {
    return this.block
  }

  getBlockBuffer () {
    return this.blockBuffer
  }

  setBlock (block) {
    this.block = Object.assign({}, block)
    this.blockBody = block.Transactions
    this.blockHeader = Object.assign({}, block)
    delete this.blockHeader.Beneficiary
    delete this.blockHeader.Hash
    delete this.blockHeader.Transactions
    this._generateBlockBuffer()
    this._generateBlockHeaderBuffer()
    this._generateBlockBodyBuffer()
    this.hasHeader = true
    this.hasBody = true
  }

  setBlockFromBuffer (blockBuffer) {
    this.blockBuffer = blockBuffer.slice(0)
    this.block.Number = SECUtil.bufferToInt(blockBuffer[0])
    this.block.TransactionsRoot = blockBuffer[1].toString('hex')
    this.block.ReceiptRoot = blockBuffer[2].toString('hex')
    this.block.LogsBloom = blockBuffer[3].toString('hex')
    this.block.MixHash = blockBuffer[4].toString('hex')
    this.block.StateRoot = blockBuffer[5].toString('hex')
    this.block.TimeStamp = SECUtil.bufferToInt(blockBuffer[6])
    this.block.ParentHash = blockBuffer[7].toString('hex')
    this.block.Difficulty = SECUtil.bufferToInt(blockBuffer[8])
    this.block.GasUsed = SECUtil.bufferToInt(blockBuffer[9])
    this.block.GasLimit = SECUtil.bufferToInt(blockBuffer[10])
    this.block.ExtraData = blockBuffer[11].toString()
    this.block.Nonce = blockBuffer[12].toString('hex')
    this.blockHeader = Object.assign({}, this.block)
    delete this.blockHeader.Beneficiary
    delete this.blockHeader.Hash
    delete this.blockHeader.Transactions
    this._generateBlockHeaderBuffer()
    this.hasHeader = true
    this.block.Hash = blockBuffer[13].toString('hex')
    this.block.Beneficiary = blockBuffer[14].toString()
    this.block.Transactions = JSON.parse(blockBuffer[15].toString())
    this.blockBody = this.block.Transactions.slice(0)
    this._generateBlockBodyBuffer()
    this.hasBody = true
  }

  setBlockHeader (block) {
    for (let key in block) {
      this.block[key] = block[key]
    }
    this.blockHeader = Object.assign({}, block)
    delete this.blockHeader.Beneficiary
    delete this.blockHeader.Hash
    delete this.blockHeader.Transactions
    this._generateBlockHeaderBuffer()
    this.hasHeader = true
  }

  setBlockHeaderFromBuffer (blockHeaderBuffer) {
    this.blockHeaderBuffer = blockHeaderBuffer.slice(0)
    this.block.Number = SECUtil.bufferToInt(blockHeaderBuffer[0])
    this.block.TransactionsRoot = blockHeaderBuffer[1].toString('hex')
    this.block.ReceiptRoot = blockHeaderBuffer[2].toString('hex')
    this.block.LogsBloom = blockHeaderBuffer[3].toString('hex')
    this.block.MixHash = blockHeaderBuffer[4].toString('hex')
    this.block.StateRoot = blockHeaderBuffer[5].toString('hex')
    this.block.TimeStamp = SECUtil.bufferToInt(blockHeaderBuffer[6])
    this.block.ParentHash = blockHeaderBuffer[7].toString('hex')
    this.block.Difficulty = SECUtil.bufferToInt(blockHeaderBuffer[8])
    this.block.GasUsed = SECUtil.bufferToInt(blockHeaderBuffer[9])
    this.block.GasLimit = SECUtil.bufferToInt(blockHeaderBuffer[10])
    this.block.ExtraData = blockHeaderBuffer[11].toString()
    this.block.Nonce = blockHeaderBuffer[12].toString('hex')
    this.blockHeader = Object.assign({}, this.block)
    delete this.blockHeader.Beneficiary
    delete this.blockHeader.Hash
    delete this.blockHeader.Transactions
    this.hasHeader = true
  }

  getBlockHeader () {
    return this.blockHeader
  }

  getBlockHeaderBuffer () {
    return this.blockHeaderBuffer
  }

  getBlockHeaderPOWBuffer () {
    this._generateBlockHeaderPOWBuffer()
    return this.blockHeaderPOWBuffer
  }

  getBlockHeaderPOWHashBuffer () {
    this._generateBlockHeaderPOWBuffer()
    return SECUtil.rlphash(this.blockHeaderPOWBuffer)
  }

  getBlockHeaderHash () {
    return SECUtil.rlphash(this.blockHeaderBuffer).toString('hex')
  }

  setBlockBody (body) {
    this.blockBody = body
    this.block.Transactions = this.blockBody
    this._generateBlockBodyBuffer()
    this.hasBody = true
  }

  setBlockBodyFromBuffer (bodyBuffer) {
    this.blockBodyBuffer = bodyBuffer.slice(0)
    this.blockBodyBuffer.forEach(txBuffer => {
      this.blockBody.push(JSON.parse(txBuffer.toString()))
    })
    this.block.Transactions = this.blockBody.slice(0)
    this.hasBody = true
  }

  getBlockBody () {
    return this.blockBody
  }

  getBlockBodyBuffer () {
    return this.blockBodyBuffer
  }

  getBlockBodyHash () {
    return SECUtil.rlphash(this.blockBodyBuffer).toString('hex')
  }

  isHeaderEmpty () {
    return !this.hasHeader
  }

  isBodyEmpty () {
    return !this.hasBody
  }

  /**
    * assign value to block header
    */
  _generateBlock () {
    // Header
    this.blockHeader.Number = this.tokenBlockchain ? parseInt(this.tokenBlockChain.getCurrentHeight()) + 1 : this.config.Number || 0
    this.blockHeader.TransactionsRoot = this.config.TransactionsRoot
    this.blockHeader.ReceiptRoot = this.config.ReceiptRoot
    this.blockHeader.LogsBloom = this.config.LogsBloom
    this.blockHeader.MixHash = this.config.MixHash
    this.blockHeader.StateRoot = this.config.StateRoot
    this.blockHeader.TimeStamp = this.config.TimeStamp || SECUtil.currentUnixTimeSecond()
    this.blockHeader.ParentHash = this.config.ParentHash
    this.blockHeader.Difficulty = this.config.Difficulty
    this.blockHeader.GasUsed = this.config.GasUsed
    this.blockHeader.GasLimit = this.config.GasLimit
    this.blockHeader.ExtraData = this.config.ExtraData
    this.blockHeader.Nonce = this.config.Nonce

    this.block = Object.assign({}, this.blockHeader)
    this.block.Beneficiary = this.config.Beneficiary
    this._generateBlockHeaderBuffer()
    this.block.Hash = SECUtil.rlphash(this.blockHeaderBuffer).toString('hex')

    // Body
    this.blockBody = this.config.Transactions
    this.block.Transactions = this.blockBody
    this._generateBlockBodyBuffer()
    this.hasHeader = true
    this.hasBody = true
    this._generateBlockBuffer()
  }

  _generateBlockBuffer () {
    this.blockBuffer = [
      SECUtil.intToBuffer(this.block.Number),
      Buffer.from(this.block.TransactionsRoot, 'hex'),
      Buffer.from(this.block.ReceiptRoot, 'hex'),
      Buffer.from(this.block.LogsBloom, 'hex'),
      Buffer.from(this.block.MixHash, 'hex'),
      Buffer.from(this.block.StateRoot, 'hex'),
      SECUtil.intToBuffer(this.block.TimeStamp),
      Buffer.from(this.block.ParentHash, 'hex'),
      SECUtil.intToBuffer(this.block.Difficulty),
      SECUtil.intToBuffer(this.block.GasUsed),
      SECUtil.intToBuffer(this.block.GasLimit),
      Buffer.from(this.block.ExtraData),
      Buffer.from(this.block.Nonce, 'hex'),
      Buffer.from(this.block.Hash, 'hex'),
      Buffer.from(this.block.Beneficiary),
      Buffer.from(JSON.stringify(this.block.Transactions))
    ]
  }

  _generateBlockHeaderBuffer () {
    this.blockHeaderBuffer = [
      SECUtil.intToBuffer(this.blockHeader.Number),
      Buffer.from(this.blockHeader.TransactionsRoot, 'hex'),
      Buffer.from(this.blockHeader.ReceiptRoot, 'hex'),
      Buffer.from(this.blockHeader.LogsBloom, 'hex'),
      Buffer.from(this.blockHeader.MixHash, 'hex'),
      Buffer.from(this.blockHeader.StateRoot, 'hex'),
      SECUtil.intToBuffer(this.blockHeader.TimeStamp),
      Buffer.from(this.blockHeader.ParentHash, 'hex'),
      SECUtil.intToBuffer(this.blockHeader.Difficulty),
      SECUtil.intToBuffer(this.blockHeader.GasUsed),
      SECUtil.intToBuffer(this.blockHeader.GasLimit),
      Buffer.from(this.blockHeader.ExtraData),
      Buffer.from(this.blockHeader.Nonce, 'hex')
    ]
  }

  _generateBlockHeaderPOWBuffer () {
    this.blockHeaderPOWBuffer = [
      SECUtil.intToBuffer(this.blockHeader.Number),
      Buffer.from(this.blockHeader.StateRoot, 'hex'),
      SECUtil.intToBuffer(this.blockHeader.Difficulty),
      SECUtil.intToBuffer(this.blockHeader.GasLimit),
      Buffer.from(this.blockHeader.ExtraData),
      Buffer.from(this.blockHeader.Nonce, 'hex')
    ]
  }

  _generateBlockBodyBuffer () {
    if (this.blockBody.length !== 0) {
      this.blockBody.forEach(tx => {
        this.blockBodyBuffer.push(Buffer.from(JSON.stringify(tx)))
      })
    }
  }
}

module.exports = SECTokenBlock
