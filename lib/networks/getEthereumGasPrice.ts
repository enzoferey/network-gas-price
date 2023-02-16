import fetch from "isomorphic-unfetch";
import type { EthereumNetwork, GasPrice } from "../types";
import { getAsapGasPriceLevel } from "../getAsapGasPriceLevel";

// Note this API is rate limited if no API key is passed, we allow callers to pass theirs
// More info at https://docs.etherscan.io/support/rate-limits
export const GAS_STATION_URL_BY_NETWORK: Record<EthereumNetwork, string> = {
  ethereum: "https://api.etherscan.io/api?module=gastracker&action=gasoracle",
  goerli:
    "https://api-goerli.etherscan.io/api?module=gastracker&action=gasoracle",
  sepolia:
    "https://api-sepolia.etherscan.io/api?module=gastracker&action=gasoracle",
  rinkeby:
    "https://api-rinkeby.etherscan.io/api?module=gastracker&action=gasoracle",
};

export const DEFAULT_FALLBACK_GAS_PRICE = 80;

interface ResponseEthereumGasPrice {
  result: {
    suggestBaseFee: number;
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
    )
      .then((response) => {
        return response.json();
      })
      .then<ResponseEthereumGasPrice>((response) => {
        return {
          result: {
            suggestBaseFee: parseFloat(response.result.suggestBaseFee),
            SafeGasPrice: parseFloat(response.result.SafeGasPrice),
            ProposeGasPrice: parseFloat(response.result.ProposeGasPrice),
            FastGasPrice: parseFloat(response.result.FastGasPrice),
          },
        };
      });

    const lowMaxPriorityFee =
      responseEthereumGasPrice.result.SafeGasPrice -
      responseEthereumGasPrice.result.suggestBaseFee;

    const averageMaxPriorityFee =
      responseEthereumGasPrice.result.ProposeGasPrice -
      responseEthereumGasPrice.result.suggestBaseFee;

    const fastMaxPriorityFee =
      responseEthereumGasPrice.result.FastGasPrice -
      responseEthereumGasPrice.result.suggestBaseFee;

    const asapGasPriceLevel = getAsapGasPriceLevel(
      responseEthereumGasPrice.result.suggestBaseFee,
      fastMaxPriorityFee
    );

    return {
      low: {
        maxPriorityFeePerGas: lowMaxPriorityFee,
        maxFeePerGas: responseEthereumGasPrice.result.SafeGasPrice,
      },
      average: {
        maxPriorityFeePerGas: averageMaxPriorityFee,
        maxFeePerGas: responseEthereumGasPrice.result.ProposeGasPrice,
      },
      high: {
        maxPriorityFeePerGas: fastMaxPriorityFee,
        maxFeePerGas: responseEthereumGasPrice.result.FastGasPrice,
      },
      asap: asapGasPriceLevel,
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
