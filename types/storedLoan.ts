export interface StoredLoan {
  collateralToken: string;
  collateralAmount: number;
  collateralUsdValueAtLoan: number;
  collateralUsdPriceAtLoan: number;
  ethLent: number;
  ethLentUsd: number;
  duration: number;
  status: "PENDING" | "EXPIRED" | "PAID";
}
