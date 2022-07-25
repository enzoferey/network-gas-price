import { describe, it, expect, vi, Mock } from "vitest";

import { getEthereumGasPrice } from "../networks/getEthereumGasPrice";
import { getPolygonGasPrice } from "../networks/getPolygonGasPrice";

import { getNetworkGasPrice } from "../getNetworkGasPrice";

vi.mock("../networks/getEthereumGasPrice");
vi.mock("../networks/getPolygonGasPrice");

describe("getNetworkGasPrice", () => {
  it("should return the Ethereum gas price for Ethereum", async () => {
    const gasPrice = 1;
    (getEthereumGasPrice as Mock).mockImplementationOnce(async () => {
      return gasPrice;
    });

    const result = await getNetworkGasPrice("ethereum");

    expect(result).toBe(gasPrice);
  });
  it("should return the Ethereum gas price for Rinkeby", async () => {
    const gasPrice = 1;
    (getEthereumGasPrice as Mock).mockImplementationOnce(async () => {
      return gasPrice;
    });

    const result = await getNetworkGasPrice("rinkeby");

    expect(result).toBe(gasPrice);
  });
  it("should return the Polygon gas price for Polygon", async () => {
    const gasPrice = 1;
    (getPolygonGasPrice as Mock).mockImplementationOnce(async () => {
      return gasPrice;
    });

    const result = await getNetworkGasPrice("polygon");

    expect(result).toBe(gasPrice);
  });
  it("should return the Polygon gas price for Mumbai", async () => {
    const gasPrice = 1;
    (getPolygonGasPrice as Mock).mockImplementationOnce(async () => {
      return gasPrice;
    });

    const result = await getNetworkGasPrice("mumbai");

    expect(result).toBe(gasPrice);
  });
  it("should pass the Ethereum options", async () => {
    const options = {
      etherscanApiKey: "testApiKey",
      fallbackGasPrice: { ethereum: 1 },
    };

    await getNetworkGasPrice("ethereum", options);

    expect(getEthereumGasPrice).toHaveBeenCalledWith("ethereum", {
      apiKey: options.etherscanApiKey,
      fallbackGasPrice: options.fallbackGasPrice.ethereum,
    });
  });
  it("should pass the Rinkeby options", async () => {
    const options = {
      etherscanApiKey: "testApiKey",
      fallbackGasPrice: { rinkeby: 1 },
    };

    await getNetworkGasPrice("rinkeby", options);

    expect(getEthereumGasPrice).toHaveBeenCalledWith("rinkeby", {
      apiKey: options.etherscanApiKey,
      fallbackGasPrice: options.fallbackGasPrice.rinkeby,
    });
  });
  it("should pass the Polygon options", async () => {
    const options = {
      fallbackGasPrice: { polygon: 1 },
    };

    await getNetworkGasPrice("polygon", options);

    expect(getPolygonGasPrice).toHaveBeenCalledWith("polygon", {
      fallbackGasPrice: options.fallbackGasPrice.polygon,
    });
  });
  it("should return the Mumbai options", async () => {
    const options = {
      fallbackGasPrice: { mumbai: 1 },
    };

    await getNetworkGasPrice("mumbai", options);

    expect(getPolygonGasPrice).toHaveBeenCalledWith("mumbai", {
      fallbackGasPrice: options.fallbackGasPrice.mumbai,
    });
  });
  it("should throw if the network is not supported", async () => {
    const notSupportedNetwork = "some not supported network";

    await expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- required to bypass type checker
      getNetworkGasPrice(notSupportedNetwork as any);
    }).toThrow("NOT_SUPPORTED_NETWORK");
  });
});