export class Helper {
  // Make requests to CryptoCompare API
  async makeApiRequest(path: string) {
    try {
      const response = await fetch(`https://min-api.cryptocompare.com/${path}`);
      return response.json();
    } catch (error: any) {
      throw new Error(`CryptoCompare request error: ${error.status}`);
    }
  }

  // Generate a symbol ID from a pair of the coins
  generateSymbol(exchange: any, fromSymbol: any, toSymbol: any) {
    const short = `${fromSymbol}/${toSymbol}`;
    return {
      short,
      full: `${exchange}:${short}`,
    };
  }

  parseFullSymbol(fullSymbol: any) {
    const match = fullSymbol.match(/^(\w+):(\w+)\/(\w+)$/);
    if (!match) {
      return null;
    }

    return {
      exchange: match[1],
      fromSymbol: match[2],
      toSymbol: match[3],
    };
  }
}
