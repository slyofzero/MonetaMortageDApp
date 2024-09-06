export interface StoredLoan {
  id?: string;
  collateralToken: string;
  collateralAmount: number;
  collateralUsdValueAtLoan: number;
  collateralUsdPriceAtLoan: number;
  ethLent: number;
  ethLentUsd: number;
  duration: number;
  status: "PENDING" | "EXPIRED" | "PAID";
  user: string;
  collateralDepositTxn?: string;
  ethLentTxn?: string;
}
