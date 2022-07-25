import { describe, it, expect } from "vitest";

import { mockFetch } from "./mockFetch";

import {
  GAS_STATION_URL_BY_NETWORK,
  DEFAULT_FALLBACK_GAS_PRICE,
  ASAP_PERCENTAGE,
  getPolygonGasPrice,
} from "../getPolygonGasPrice";

describe("getPolygonGasPrice", () => {
  it("should return the Polygon gas prices per level based on the Polygon gas station", async () => {
    const lowGasPrice = 100;
    const averageGasPrice = 110;
    const fastGasPrice = 120;

    const mock = mockFetch({
      safeLow: {
        maxPriorityFee: lowGasPrice,
        maxFee: lowGasPrice,
      },
      standard: {
        maxPriorityFee: averageGasPrice,
        maxFee: averageGasPrice,
      },
      fast: {
        maxPriorityFee: fastGasPrice,
        maxFee: fastGasPrice,
      },
    });

    const result = await getPolygonGasPrice("polygon");

    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith(GAS_STATION_URL_BY_NETWORK.polygon);

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
      asap: {
        maxPriorityFeePerGas: (fastGasPrice * ASAP_PERCENTAGE) / 100,
        maxFeePerGas: (fastGasPrice * ASAP_PERCENTAGE) / 100,
      },
    });
  });
  it("should return the Mumbai gas prices per level based on the Polygon gas station", async () => {
    const lowGasPrice = 100;
    const averageGasPrice = 110;
    const fastGasPrice = 120;

    const mock = mockFetch({
      safeLow: {
        maxPriorityFee: lowGasPrice,
        maxFee: lowGasPrice,
      },
      standard: {
        maxPriorityFee: averageGasPrice,
        maxFee: averageGasPrice,
      },
      fast: {
        maxPriorityFee: fastGasPrice,
        maxFee: fastGasPrice,
      },
    });

    const result = await getPolygonGasPrice("mumbai");

    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith(GAS_STATION_URL_BY_NETWORK.mumbai);

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
      asap: {
        maxPriorityFeePerGas: (fastGasPrice * ASAP_PERCENTAGE) / 100,
        maxFeePerGas: (fastGasPrice * ASAP_PERCENTAGE) / 100,
      },
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
});
