// Inspired from https://www.blocknative.com/blog/eip-1559-fees

import type { GasPriceLevel } from "./types";

// +12.5% is the maximum increase of base fee per block
// This means setting a premium max priority fee bigger by 12.5% of base fee
// means likelyhood of getting into block 2 in a gas spike event is super high
const PREMIUM_BASE_FEE_PERCENTAGE_FOR_MAX_PRIORITY_FEE = 0.125;

export function getAsapGasPriceLevel(
  baseFee: number,
  fastMaxPriorityFee: number
): GasPriceLevel {
  const maxPriorityFeePerGas =
    fastMaxPriorityFee +
    baseFee * PREMIUM_BASE_FEE_PERCENTAGE_FOR_MAX_PRIORITY_FEE;

  // Using baseFee * 2 ensures the transaction will remain marketable for six consecutive 100% full blocks
  const maxFeePerGas = baseFee * 2 + maxPriorityFeePerGas;

  return {
    maxPriorityFeePerGas,
    maxFeePerGas,
  };
}
