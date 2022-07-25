import type { EthereumNetwork, GasPrice } from "../types";

// Note this API is rate limited if no API key is passed, we allow callers to pass theirs
// More info at https://docs.etherscan.io/support/rate-limits
export const GAS_STATION_URL_BY_NETWORK: Record<EthereumNetwork, string> = {
  ethereum: "https://api.etherscan.io/api?module=gastracker&action=gasoracle",
  rinkeby:
    "https://api-rinkeby.etherscan.io/api?module=gastracker&action=gasoracle",
};

export const DEFAULT_FALLBACK_GAS_PRICE = 80;
export const ASAP_PERCENTAGE = 120; // 120%

interface ResponseEthereumGasPrice {
  result: {
    SafeGasPrice: number;
    ProposeGasPrice: number;
    FastGasPrice: number;
  };
}

interface EthereumOptions {
  apiKey?: string;
  fallbackGasPrice?: number;
}

export async function getEthereumGasPrice(
  network: EthereumNetwork,
  options: EthereumOptions = {}
): Promise<GasPrice> {
  const { apiKey, fallbackGasPrice = DEFAULT_FALLBACK_GAS_PRICE } = options;

  try {
    const gasStationUrl = GAS_STATION_URL_BY_NETWORK[network];

    const responseEthereumGasPrice = await fetch(
      apiKey !== undefined ? `${gasStationUrl}&apiKey=${apiKey}` : gasStationUrl
    ).then<ResponseEthereumGasPrice>((response) => {
      return response.json();
    });

    return {
      low: {
        maxPriorityFeePerGas: responseEthereumGasPrice.result.SafeGasPrice,
        maxFeePerGas: responseEthereumGasPrice.result.SafeGasPrice,
      },
      average: {
        maxPriorityFeePerGas: responseEthereumGasPrice.result.ProposeGasPrice,
        maxFeePerGas: responseEthereumGasPrice.result.ProposeGasPrice,
      },
      high: {
        maxPriorityFeePerGas: responseEthereumGasPrice.result.FastGasPrice,
        maxFeePerGas: responseEthereumGasPrice.result.FastGasPrice,
      },
      asap: {
        maxPriorityFeePerGas:
          (responseEthereumGasPrice.result.FastGasPrice * ASAP_PERCENTAGE) /
          100,
        maxFeePerGas:
          (responseEthereumGasPrice.result.FastGasPrice * ASAP_PERCENTAGE) /
          100,
      },
    };
  } catch (error) {
    return {
      low: {
        maxPriorityFeePerGas: fallbackGasPrice,
        maxFeePerGas: fallbackGasPrice,
      },
      average: {
        maxPriorityFeePerGas: fallbackGasPrice,
        maxFeePerGas: fallbackGasPrice,
      },
      high: {
        maxPriorityFeePerGas: fallbackGasPrice,
        maxFeePerGas: fallbackGasPrice,
      },
      asap: {
        maxPriorityFeePerGas: fallbackGasPrice,
        maxFeePerGas: fallbackGasPrice,
      },
    };
  }
}
