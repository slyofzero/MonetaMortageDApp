import { useAtom, atom } from "jotai";

interface Loan {
  collateralToken: string;
  collateralAmount: number | string | null;
  collateralUsdValueAtLoan: number | null;
  collateralUsdPriceAtLoan: number | null;
  ethLent: number | string | null;
  ethLentUsd: number | null;
  duration: number;
}

export const defaultLoanDuration = 4;

const defaultLoan: Loan = {
  collateralToken: "",
  collateralAmount: null,
  collateralUsdPriceAtLoan: null,
  collateralUsdValueAtLoan: null,
  duration: defaultLoanDuration,
  ethLent: null,
  ethLentUsd: null,
};
const loanAtom = atom<Loan>(defaultLoan);

export function useLoan() {
  const [loan, setLoan] = useAtom(loanAtom);
  return { loan, setLoan };
}
