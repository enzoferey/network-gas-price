import { describe, it, expect } from "vitest";

import { mockFetch } from "./mockFetch";

import {
  GAS_STATION_URL_BY_NETWORK,
  DEFAULT_FALLBACK_GAS_PRICE,
  getEthereumGasPrice,
} from "../getEthereumGasPrice";

describe("getEthereumGasPrice", () => {
  it("should return the Ethereum gas prices per level based on the Ethereum gas station", async () => {
    const lowGasPrice = 100;
    const averageGasPrice = 110;
    const fastGasPrice = 120;

    const mock = mockFetch({
      result: {
        SafeGasPrice: lowGasPrice,
        ProposeGasPrice: averageGasPrice,
        FastGasPrice: fastGasPrice,
      },
    });

    const result = await getEthereumGasPrice("ethereum");

    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith(GAS_STATION_URL_BY_NETWORK.ethereum);

    expect(result).toEqual({
      low: {
        maxPriorityFeePerGas: lowGasPrice,
        maxFeePerGas: lowGasPrice,
      },
      average: {
        maxPriorityFeePerGas: averageGasPrice,
        maxFeePerGas: averageGasPrice,
      },
      high: {
        maxPriorityFeePerGas: fastGasPrice,
        maxFeePerGas: fastGasPrice,
      },
    });
  });
  it("should return the Rinkeby gas prices per level based on the Ethereum gas station", async () => {
    const lowGasPrice = 100;
    const averageGasPrice = 110;
    const fastGasPrice = 120;

    const mock = mockFetch({
      result: {
        SafeGasPrice: lowGasPrice,
        ProposeGasPrice: averageGasPrice,
        FastGasPrice: fastGasPrice,
      },
    });

    const result = await getEthereumGasPrice("rinkeby");

    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith(GAS_STATION_URL_BY_NETWORK.rinkeby);

    expect(result).toEqual({
      low: {
        maxPriorityFeePerGas: lowGasPrice,
        maxFeePerGas: lowGasPrice,
      },
      average: {
        maxPriorityFeePerGas: averageGasPrice,
        maxFeePerGas: averageGasPrice,
      },
      high: {
        maxPriorityFeePerGas: fastGasPrice,
        maxFeePerGas: fastGasPrice,
      },
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
    });
  });
});
