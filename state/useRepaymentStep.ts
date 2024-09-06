import { FEStoredLoan } from "@/pages/api/loans";
import { useAtom, atom } from "jotai";

interface RePaymentStepData {
  step: number;
  repayTxn: string;
  collateralReleaseTxn: string;
  id: string;
  loan: FEStoredLoan | null;
}
export const defaultRePaymentStepData: RePaymentStepData = {
  id: "",
  repayTxn: "",
  collateralReleaseTxn: "",
  step: 1,
  loan: null,
};
const repaymentStepDataAtom = atom<RePaymentStepData>(defaultRePaymentStepData);

export function useRepaymentStep() {
  const [repaymentStepData, setRepaymentStepData] = useAtom(
    repaymentStepDataAtom
  );
  const resetRepaymentStepData = () =>
    setRepaymentStepData(defaultRePaymentStepData);

  return { repaymentStepData, setRepaymentStepData, resetRepaymentStepData };
}
