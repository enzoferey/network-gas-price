import type { GasPrice, Network, Options } from "./types";

import { getEthereumGasPrice, getPolygonGasPrice } from "./networks";

export function getNetworkGasPrice(
  network: Network,
  options: Options = {}
): Promise<GasPrice> {
  if (network === "ethereum" || network === "goerli" || network === "rinkeby") {
    return getEthereumGasPrice(network, {
      apiKey: options.etherscanApiKey,
      fallbackGasPrice: options.fallbackGasPrice?.[network],
    });
  }

  if (network === "polygon" || network === "mumbai") {
    return getPolygonGasPrice(network, {
      fallbackGasPrice: options.fallbackGasPrice?.[network],
    });
  }

  throw new Error("NOT_SUPPORTED_NETWORK");
}
