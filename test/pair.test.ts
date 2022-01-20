import { ChainId, Token, Pair, TokenAmount, WETH, Price } from '../src'

describe('Pair', () => {
  const OAVAX = new Token(ChainId.MAINNET, '0x7767f8ed52F9c8AB777512D649006fFD77008882', 18, 'OAVAX', 'USD Coin')
  const WAVAX = new Token(ChainId.MAINNET, '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', 18, 'WAVAX', 'WAVAX Stablecoin')

  describe('constructor', () => {
    it('cannot be used for tokens on different chains', () => {
      expect(() => new Pair(new TokenAmount(OAVAX, '100'), new TokenAmount(WETH[ChainId.MAINNET], '100'))).toThrow(
        'CHAIN_IDS'
      )
    })
  })

  describe('#getAddress', () => {
    it('returns the correct address', () => {
      expect(Pair.getAddress(OAVAX, WAVAX)).toEqual('0xDe449B410d3D4EA783696a7dBE68534645617620')
    })
  })

  describe('#token0', () => {
    it('always is the token that sorts before', () => {
      expect(new Pair(new TokenAmount(OAVAX, '100'), new TokenAmount(WAVAX, '100')).token0).toEqual(WAVAX)
      expect(new Pair(new TokenAmount(WAVAX, '100'), new TokenAmount(OAVAX, '100')).token0).toEqual(WAVAX)
    })
  })
  describe('#token1', () => {
    it('always is the token that sorts after', () => {
      expect(new Pair(new TokenAmount(OAVAX, '100'), new TokenAmount(WAVAX, '100')).token1).toEqual(OAVAX)
      expect(new Pair(new TokenAmount(WAVAX, '100'), new TokenAmount(OAVAX, '100')).token1).toEqual(OAVAX)
    })
  })
  describe('#reserve0', () => {
    it('always comes from the token that sorts before', () => {
      expect(new Pair(new TokenAmount(OAVAX, '100'), new TokenAmount(WAVAX, '101')).reserve0).toEqual(
        new TokenAmount(WAVAX, '101')
      )
      expect(new Pair(new TokenAmount(WAVAX, '101'), new TokenAmount(OAVAX, '100')).reserve0).toEqual(
        new TokenAmount(WAVAX, '101')
      )
    })
  })
  describe('#reserve1', () => {
    it('always comes from the token that sorts after', () => {
      expect(new Pair(new TokenAmount(OAVAX, '100'), new TokenAmount(WAVAX, '101')).reserve1).toEqual(
        new TokenAmount(OAVAX, '100')
      )
      expect(new Pair(new TokenAmount(WAVAX, '101'), new TokenAmount(OAVAX, '100')).reserve1).toEqual(
        new TokenAmount(OAVAX, '100')
      )
    })
  })

  describe('#token0Price', () => {
    it('returns price of token0 in terms of token1', () => {
      expect(new Pair(new TokenAmount(OAVAX, '101'), new TokenAmount(WAVAX, '100')).token0Price).toEqual(
        new Price(WAVAX, OAVAX, '100', '101')
      )
      expect(new Pair(new TokenAmount(WAVAX, '100'), new TokenAmount(OAVAX, '101')).token0Price).toEqual(
        new Price(WAVAX, OAVAX, '100', '101')
      )
    })
  })

  describe('#token1Price', () => {
    it('returns price of token1 in terms of token0', () => {
      expect(new Pair(new TokenAmount(OAVAX, '101'), new TokenAmount(WAVAX, '100')).token1Price).toEqual(
        new Price(OAVAX, WAVAX, '101', '100')
      )
      expect(new Pair(new TokenAmount(WAVAX, '100'), new TokenAmount(OAVAX, '101')).token1Price).toEqual(
        new Price(OAVAX, WAVAX, '101', '100')
      )
    })
  })

  describe('#priceOf', () => {
    const pair = new Pair(new TokenAmount(OAVAX, '101'), new TokenAmount(WAVAX, '100'))
    it('returns price of token in terms of other token', () => {
      expect(pair.priceOf(WAVAX)).toEqual(pair.token0Price)
      expect(pair.priceOf(OAVAX)).toEqual(pair.token1Price)
    })

    it('throws if invalid token', () => {
      expect(() => pair.priceOf(WETH[ChainId.MAINNET])).toThrow('TOKEN')
    })
  })

  describe('#reserveOf', () => {
    it('returns reserves of the given token', () => {
      expect(new Pair(new TokenAmount(OAVAX, '100'), new TokenAmount(WAVAX, '101')).reserveOf(OAVAX)).toEqual(
        new TokenAmount(OAVAX, '100')
      )
      expect(new Pair(new TokenAmount(WAVAX, '101'), new TokenAmount(OAVAX, '100')).reserveOf(OAVAX)).toEqual(
        new TokenAmount(OAVAX, '100')
      )
    })

    it('throws if not in the pair', () => {
      expect(() =>
        new Pair(new TokenAmount(WAVAX, '101'), new TokenAmount(OAVAX, '100')).reserveOf(WETH[ChainId.MAINNET])
      ).toThrow('TOKEN')
    })
  })

  describe('#chainId', () => {
    it('returns the token0 chainId', () => {
      expect(new Pair(new TokenAmount(OAVAX, '100'), new TokenAmount(WAVAX, '100')).chainId).toEqual(ChainId.MAINNET)
      expect(new Pair(new TokenAmount(WAVAX, '100'), new TokenAmount(OAVAX, '100')).chainId).toEqual(ChainId.MAINNET)
    })
  })
  describe('#involvesToken', () => {
    expect(new Pair(new TokenAmount(OAVAX, '100'), new TokenAmount(WAVAX, '100')).involvesToken(OAVAX)).toEqual(true)
    expect(new Pair(new TokenAmount(OAVAX, '100'), new TokenAmount(WAVAX, '100')).involvesToken(WAVAX)).toEqual(true)
    expect(
      new Pair(new TokenAmount(OAVAX, '100'), new TokenAmount(WAVAX, '100')).involvesToken(WETH[ChainId.MAINNET])
    ).toEqual(false)
  })
})
