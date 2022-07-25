import type { GasPrice, Network, Options } from "./types";

import { getEthereumGasPrice, getPolygonGasPrice } from "./networks";

export function getNetworkGasPrice(
  network: Network,
  options: Options = {}
): Promise<GasPrice> {
  if (network === "ethereum" || network === "rinkeby") {
    return getEthereumGasPrice(network, {
      apiKey: options.etherscanApiKey,
      fallbackGasPrice:
        network === "ethereum"
          ? options.fallbackGasPrice?.ethereum
          : options.fallbackGasPrice?.rinkeby,
    });
  }

  if (network === "polygon" || network === "mumbai") {
    return getPolygonGasPrice(network, {
      fallbackGasPrice:
        network === "polygon"
          ? options.fallbackGasPrice?.polygon
          : options.fallbackGasPrice?.mumbai,
    });
  }

  throw new Error("NOT_SUPPORTED_NETWORK");
}
