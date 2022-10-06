import { describe, expect, it } from "vitest";

import { getAsapGasPriceLevel } from "../getAsapGasPriceLevel";

describe("getAsapGasPriceLevel", () => {
  it("should return the asap gas price level", () => {
    const result = getAsapGasPriceLevel(100, 20);

    expect(result).toEqual({
      maxPriorityFeePerGas: 32.5,
      maxFeePerGas: 232.5,
    });
  });
});
