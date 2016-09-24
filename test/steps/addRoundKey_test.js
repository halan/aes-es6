import { expect } from 'chai'
import { addRoundKey } from 'steps'

describe('addRoundKey', () => {
  it('add round key', () => {
    expect(addRoundKey(
      [ 18,  52,  86, 120,
       144, 171, 205, 239,
        18,  52,  86, 120,
       144, 171, 205, 239],
      [ 15,  21, 113, 201,
        71, 217, 232,  89,
        12, 183, 173, 214,
       175, 127, 103, 152]
    )).to.be.deep.equal(
      [ 29,  33,  39, 177,
       215, 114,  37, 182,
        30, 131, 251, 174,
        63, 212, 170, 119]
    )
  })
})
