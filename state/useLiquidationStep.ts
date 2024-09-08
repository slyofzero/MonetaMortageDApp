import { FEStoredLoan } from "@/pages/api/loans";
import { useAtom, atom } from "jotai";

interface LiquidationStepData {
  step: number;
  liquidateTxn: string;
  refundTxn: string;
  id: string;
  loan: FEStoredLoan | null;
  ethReceived: number;
}
export const defaultLiquidationStepData: LiquidationStepData = {
  id: "",
  liquidateTxn: "",
  refundTxn: "",
  step: 0,
  loan: null,
  ethReceived: 1,
};
const liquidationStepDataAtom = atom<LiquidationStepData>(
  defaultLiquidationStepData
);

export function useLiquidationStep() {
  const [liquidationStepData, setLiquidationStepData] = useAtom(
    liquidationStepDataAtom
  );
  const resetLiquidationStepData = () =>
    setLiquidationStepData(defaultLiquidationStepData);

  return {
    liquidationStepData,
    setLiquidationStepData,
    resetLiquidationStepData,
  };
}
