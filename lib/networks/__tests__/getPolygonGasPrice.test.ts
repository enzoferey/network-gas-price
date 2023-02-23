import { describe, it, expect, vi } from "vitest";

import { mockFetch } from "./mockFetch";

import {
  GAS_STATION_URL_BY_NETWORK,
  DEFAULT_FALLBACK_GAS_PRICE,
  getPolygonGasPrice,
} from "../getPolygonGasPrice";

import { getAsapGasPriceLevel } from "../../getAsapGasPriceLevel";

describe("getPolygonGasPrice", () => {
  it("should return the Polygon gas prices per level based on the Polygon gas station", async () => {
    const estimatedBaseFee = 100;

    const mock = mockFetch({
      estimatedBaseFee,
      safeLow: {
        maxPriorityFee: 0,
        maxFee: 100,
      },
      standard: {
        maxPriorityFee: 1,
        maxFee: 110,
      },
      fast: {
        maxPriorityFee: 2,
        maxFee: 120,
      },
    });

    const result = await getPolygonGasPrice("polygon");

    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith(GAS_STATION_URL_BY_NETWORK.polygon);

    expect(result).toEqual({
      low: {
        maxPriorityFeePerGas: 0,
        maxFeePerGas: 100,
      },
      average: {
        maxPriorityFeePerGas: 1,
        maxFeePerGas: 110,
      },
      high: {
        maxPriorityFeePerGas: 2,
        maxFeePerGas: 120,
      },
      asap: getAsapGasPriceLevel(estimatedBaseFee, 2),
    });
  });
  it("should return the Mumbai gas prices per level based on the Polygon gas station", async () => {
    const estimatedBaseFee = 100;

    const mock = mockFetch({
      estimatedBaseFee,
      safeLow: {
        maxPriorityFee: 0,
        maxFee: 100,
      },
      standard: {
        maxPriorityFee: 1,
        maxFee: 110,
      },
      fast: {
        maxPriorityFee: 2,
        maxFee: 120,
      },
    });

    const result = await getPolygonGasPrice("mumbai");

    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith(GAS_STATION_URL_BY_NETWORK.mumbai);

    expect(result).toEqual({
      low: {
        maxPriorityFeePerGas: 0,
        maxFeePerGas: 100,
      },
      average: {
        maxPriorityFeePerGas: 1,
        maxFeePerGas: 110,
      },
      high: {
        maxPriorityFeePerGas: 2,
        maxFeePerGas: 120,
      },
      asap: getAsapGasPriceLevel(estimatedBaseFee, 2),
    });
  });
  it("should return the fallback gas price if there an issue fetching from the Polygon gas station", async () => {
    mockFetch(undefined, { ok: false });

    const withDefaultFallbackValue = await getPolygonGasPrice("polygon");

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
    const withFallbackValue = await getPolygonGasPrice("polygon", {
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
  it("should return the fallback gas price function return value if there an issue fetching from the Polygon gas station", async () => {
    mockFetch(undefined, { ok: false });

    const gasPrice = 100;

    const fallbackGasPrice = vi.fn(async () => {
      return gasPrice;
    });

    const withFallbackFunctionValue = await getPolygonGasPrice("polygon", {
      fallbackGasPrice,
    });

    expect(fallbackGasPrice).toHaveBeenCalledTimes(1);

    expect(withFallbackFunctionValue).toEqual({
      low: {
        maxPriorityFeePerGas: gasPrice,
        maxFeePerGas: gasPrice,
      },
      average: {
        maxPriorityFeePerGas: gasPrice,
        maxFeePerGas: gasPrice,
      },
      high: {
        maxPriorityFeePerGas: gasPrice,
        maxFeePerGas: gasPrice,
      },
      asap: {
        maxPriorityFeePerGas: gasPrice,
        maxFeePerGas: gasPrice,
      },
    });
  });
});
