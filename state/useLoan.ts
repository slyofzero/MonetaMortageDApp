import { useAtom, atom } from "jotai";

export interface LoanFromState {
  collateralToken: string;
  collateralAmount: number | string | null;
  collateralUsdValueAtLoan: number | null;
  collateralUsdPriceAtLoan: number | null;
  ethLent: number | string | null;
  ethLentUsd: number | null;
  duration: number;
}

export const defaultLoanDuration = 4;

const defaultLoan: LoanFromState = {
  collateralToken: "",
  collateralAmount: null,
  collateralUsdPriceAtLoan: null,
  collateralUsdValueAtLoan: null,
  duration: defaultLoanDuration,
  ethLent: null,
  ethLentUsd: null,
};
const loanAtom = atom<LoanFromState>(defaultLoan);

export function useLoan() {
  const [loan, setLoan] = useAtom(loanAtom);
  return { loan, setLoan };
}
