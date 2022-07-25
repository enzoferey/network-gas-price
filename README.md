# network-gas-price

![Tests](https://github.com/enzoferey/network-gas-price/actions/workflows/test.yml/badge.svg)
[![npm version](https://badge.fury.io/js/@enzoferey%2Fnetwork-gas-price.svg)](https://badge.fury.io/js/@enzoferey%2Fnetwork-gas-price)
[![codecov](https://codecov.io/gh/enzoferey/network-gas-price/branch/main/graph/badge.svg?token=9amQLrkrar)](https://codecov.io/gh/enzoferey/network-gas-price)

Query accurate gas prices on every blockchain network ⛽️

## Highlights

- Zero dependencies 🧹
- Lightweight (0.75 KiB gzipped) 📦
- Simple to use ⚡️
- Ethereum and Polygon networks 🚀

## Why

Gas price is constantly changing on every blockchain network based on demand to run transactions. When sending a transaction to the network, it's important to set an accurate gas price in order to avoid stuck transactions or pay too much gas fees.

## Getting started

1. Install the package

```sh
yarn install @enzoferey/network-gas-price
```

2. Get network prices

```ts
import { getNetworkGasPrice } from "@enzoferey/network-gas-price";

const networkGasPrice = await getNetworkGasPrice("ethereum");

// networkGasPrice is an object with the following shape:
//
// {
//   low: {
//     maxPriorityFeePerGas: number;
//     maxFeePerGas: number;
//   },
//   average: {
//     maxPriorityFeePerGas: number;
//     maxFeePerGas: number;
//   },
//   high: {
//     maxPriorityFeePerGas: number;
//     maxFeePerGas: number;
//   }
// }

// NOTE: All prices are returned in Gwei units
```

> 💡 The price level ("low", "average", "high", "asap") you should use depends on your type of application. Most use cases will do okay with "average" or "high". If your application has background transactions support and execution is not time critical, you could use "low". If your application has a strong need to execute transactions as soon as possible, we recommend using the
> "asap" option that adds 20% on top of the "high" reported gas price.

> 🌐 The package currently supports the Ethereum and Polygon networks (both mainnet and testnet). If you would like to add support for a new network, please open an issue or pull request.

3. Use gas prices (with [Ethers.js](https://github.com/ethers-io/ethers.js/) as an example):

```ts
import { ethers, BigNumber } from "ethers";

function getGweiEthers(gweiAmount: number): BigNumber {
  return ethers.utils.parseUnits(Math.ceil(gweiAmount).toString(), "gwei");
}

try {
  const transaction = await someContract.someMethod(someArgument, {
    maxPriorityFeePerGas: getGweiEthers(
      networkGasPrice.high.maxPriorityFeePerGas
    ),
    maxFeePerGas: getGweiEthers(networkGasPrice.high.maxFeePerGas),
  });
  await transaction.wait();
} catch (error) {
  // Handle error
  // -> You could use my package https://github.com/enzoferey/ethers-error-parser for that 😉
}
```
