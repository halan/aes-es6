const { expect } = require('chai')
const { mixColumns, mixColumnsInv } = require('aes/rounds')

describe('mixColumns', () => {
  it('mix columns', () => {
    expect(mixColumns(
      [164,  64,  15, 245,
        14, 236, 172, 200,
       114,  72, 204,  78,
       117, 253,  63, 228]
    )).to.be.deep.equal(
      [105, 192, 254,  73,
        87, 234, 226, 217,
       190, 227, 107, 142,
        45,  49, 193, 142]
    )
  })

  it('mix columns inverse', () => {
    expect(mixColumnsInv(
      [105, 192, 254,  73,
        87, 234, 226, 217,
       190, 227, 107, 142,
        45,  49, 193, 142]
    )).to.be.deep.equal(
      [164,  64,  15, 245,
        14, 236, 172, 200,
       114,  72, 204,  78,
       117, 253,  63, 228]
    )
  })

  it('mix columns could be reverted by mix columns reverse', () => {
    expect(mixColumns(mixColumnsInv(
      [164,  64,  15, 245,
        14, 236, 172, 200,
       114,  72, 204,  78,
       117, 253,  63, 228]
    ))).to.be.deep.equal(
      [164,  64,  15, 245,
        14, 236, 172, 200,
       114,  72, 204,  78,
       117, 253,  63, 228]
    )

    expect(mixColumnsInv(mixColumns(
      [164,  64,  15, 245,
        14, 236, 172, 200,
       114,  72, 204,  78,
       117, 253,  63, 228]
    ))).to.be.deep.equal(
      [164,  64,  15, 245,
        14, 236, 172, 200,
       114,  72, 204,  78,
       117, 253,  63, 228]
    )
  })
})

