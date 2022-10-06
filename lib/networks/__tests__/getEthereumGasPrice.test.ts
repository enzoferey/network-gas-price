import { describe, it, expect } from "vitest";

import { mockFetch } from "./mockFetch";

import {
  GAS_STATION_URL_BY_NETWORK,
  DEFAULT_FALLBACK_GAS_PRICE,
  getEthereumGasPrice,
} from "../getEthereumGasPrice";

import { getAsapGasPriceLevel } from "../../getAsapGasPriceLevel";

describe("getEthereumGasPrice", () => {
  it("should return the Ethereum gas prices per level based on the Ethereum gas station", async () => {
    const suggestBaseFee = 100;

    const mock = mockFetch({
      result: {
        suggestBaseFee: String(suggestBaseFee),
        SafeGasPrice: "100",
        ProposeGasPrice: "110",
        FastGasPrice: "120",
      },
    });

    const result = await getEthereumGasPrice("ethereum");

    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith(GAS_STATION_URL_BY_NETWORK.ethereum);

    expect(result).toEqual({
      low: {
        maxPriorityFeePerGas: 0,
        maxFeePerGas: 100,
      },
      average: {
        maxPriorityFeePerGas: 10,
        maxFeePerGas: 110,
      },
      high: {
        maxPriorityFeePerGas: 20,
        maxFeePerGas: 120,
      },
      asap: getAsapGasPriceLevel(suggestBaseFee, 20),
    });
  });
  it("should return the Goerli gas prices per level based on the Ethereum gas station", async () => {
    const suggestBaseFee = 100;

    const mock = mockFetch({
      result: {
        suggestBaseFee: String(suggestBaseFee),
        SafeGasPrice: "100",
        ProposeGasPrice: "110",
        FastGasPrice: "120",
      },
    });

    const result = await getEthereumGasPrice("goerli");

    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith(GAS_STATION_URL_BY_NETWORK.goerli);

    expect(result).toEqual({
      low: {
        maxPriorityFeePerGas: 0,
        maxFeePerGas: 100,
      },
      average: {
        maxPriorityFeePerGas: 10,
        maxFeePerGas: 110,
      },
      high: {
        maxPriorityFeePerGas: 20,
        maxFeePerGas: 120,
      },
      asap: getAsapGasPriceLevel(suggestBaseFee, 20),
    });
  });
  it("should return the Sepolia gas prices per level based on the Ethereum gas station", async () => {
    const suggestBaseFee = 100;

    const mock = mockFetch({
      result: {
        suggestBaseFee: String(suggestBaseFee),
        SafeGasPrice: "100",
        ProposeGasPrice: "110",
        FastGasPrice: "120",
      },
    });

    const result = await getEthereumGasPrice("sepolia");

    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith(GAS_STATION_URL_BY_NETWORK.sepolia);

    expect(result).toEqual({
      low: {
        maxPriorityFeePerGas: 0,
        maxFeePerGas: 100,
      },
      average: {
        maxPriorityFeePerGas: 10,
        maxFeePerGas: 110,
      },
      high: {
        maxPriorityFeePerGas: 20,
        maxFeePerGas: 120,
      },
      asap: getAsapGasPriceLevel(suggestBaseFee, 20),
    });
  });
  it("should return the Rinkeby gas prices per level based on the Ethereum gas station", async () => {
    const suggestBaseFee = 100;

    const mock = mockFetch({
      result: {
        suggestBaseFee: String(suggestBaseFee),
        SafeGasPrice: "100",
        ProposeGasPrice: "110",
        FastGasPrice: "120",
      },
    });

    const result = await getEthereumGasPrice("rinkeby");

    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith(GAS_STATION_URL_BY_NETWORK.rinkeby);

    expect(result).toEqual({
      low: {
        maxPriorityFeePerGas: 0,
        maxFeePerGas: 100,
      },
      average: {
        maxPriorityFeePerGas: 10,
        maxFeePerGas: 110,
      },
      high: {
        maxPriorityFeePerGas: 20,
        maxFeePerGas: 120,
      },
      asap: getAsapGasPriceLevel(suggestBaseFee, 20),
    });
  });
  it("should include the API key if provided for Ethereum", async () => {
    const mock = mockFetch(null);

    await getEthereumGasPrice("ethereum", { apiKey: "testApiKey" });

    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith(
      `${GAS_STATION_URL_BY_NETWORK.ethereum}&apiKey=testApiKey`
    );
  });
  it("should include the API key if provided for Goerli", async () => {
    const mock = mockFetch(null);

    await getEthereumGasPrice("goerli", { apiKey: "testApiKey" });

    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith(
      `${GAS_STATION_URL_BY_NETWORK.goerli}&apiKey=testApiKey`
    );
  });
  it("should include the API key if provided for Sepolia", async () => {
    const mock = mockFetch(null);

    await getEthereumGasPrice("sepolia", { apiKey: "testApiKey" });

    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith(
      `${GAS_STATION_URL_BY_NETWORK.sepolia}&apiKey=testApiKey`
    );
  });
  it("should include the API key if provided for Rinkeby", async () => {
    const mock = mockFetch(null);

    await getEthereumGasPrice("rinkeby", { apiKey: "testApiKey" });

    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith(
      `${GAS_STATION_URL_BY_NETWORK.rinkeby}&apiKey=testApiKey`
    );
  });
  it("should return the fallback gas price if there an issue fetching from the Ethereum gas station", async () => {
    mockFetch(undefined, { ok: false });

    const withDefaultFallbackValue = await getEthereumGasPrice("ethereum");

    expect(withDefaultFallbackValue).toEqual({
      low: {
        maxPriorityFeePerGas: DEFAULT_FALLBACK_GAS_PRICE,
        maxFeePerGas: DEFAULT_FALLBACK_GAS_PRICE,
      },
      average: {
        maxPriorityFeePerGas: DEFAULT_FALLBACK_GAS_PRICE,
        maxFeePerGas: DEFAULT_FALLBACK_GAS_PRICE,
      },
      high: {
        maxPriorityFeePerGas: DEFAULT_FALLBACK_GAS_PRICE,
        maxFeePerGas: DEFAULT_FALLBACK_GAS_PRICE,
      },
      asap: {
        maxPriorityFeePerGas: DEFAULT_FALLBACK_GAS_PRICE,
        maxFeePerGas: DEFAULT_FALLBACK_GAS_PRICE,
      },
    });

    const fallbackGasPrice = 100;
    const withFallbackValue = await getEthereumGasPrice("ethereum", {
      fallbackGasPrice,
    });

    expect(withFallbackValue).toEqual({
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
    });
  });
});
