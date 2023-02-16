import fetch from "isomorphic-unfetch";

import type { GasPrice, PolygonNetwork } from "../types";
import { getAsapGasPriceLevel } from "../getAsapGasPriceLevel";

export const GAS_STATION_URL_BY_NETWORK: Record<PolygonNetwork, string> = {
  polygon: "https://gasstation-mainnet.matic.network/v2",
  mumbai: "https://gasstation-mumbai.matic.today/v2",
};

export const DEFAULT_FALLBACK_GAS_PRICE = 50;

interface ResponsePolygonGasPrice {
  estimatedBaseFee: number;
  safeLow: {
    maxPriorityFee: number;
    maxFee: number;
  };
  standard: {
    maxPriorityFee: number;
    maxFee: number;
  };
  fast: {
    maxPriorityFee: number;
    maxFee: number;
  };
}

interface PolygonOptions {
  fallbackGasPrice?: number;
}

export async function getPolygonGasPrice(
  network: PolygonNetwork,
  options: PolygonOptions = {}
): Promise<GasPrice> {
  const { fallbackGasPrice = DEFAULT_FALLBACK_GAS_PRICE } = options;

  try {
    const gasStationUrl = GAS_STATION_URL_BY_NETWORK[network];

    const responsePolygonGasPrice = await fetch(
      gasStationUrl
    ).then<ResponsePolygonGasPrice>((response) => {
      return response.json();
    });

    const asapGasPriceLevel = getAsapGasPriceLevel(
      responsePolygonGasPrice.estimatedBaseFee,
      responsePolygonGasPrice.fast.maxPriorityFee
    );

    return {
      low: {
        maxPriorityFeePerGas: responsePolygonGasPrice.safeLow.maxPriorityFee,
        maxFeePerGas: responsePolygonGasPrice.safeLow.maxFee,
      },
      average: {
        maxPriorityFeePerGas: responsePolygonGasPrice.standard.maxPriorityFee,
        maxFeePerGas: responsePolygonGasPrice.standard.maxFee,
      },
      high: {
        maxPriorityFeePerGas: responsePolygonGasPrice.fast.maxPriorityFee,
        maxFeePerGas: responsePolygonGasPrice.fast.maxFee,
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
