import { useAtom, atom } from "jotai";

interface PaymentStepData {
  step: number;
  depositTxn: string;
  receiveTxn: string;
}
export const defaultPaymentStepData: PaymentStepData = {
  depositTxn: "",
  receiveTxn: "",
  step: 0,
};
const paymentStepDataAtom = atom<PaymentStepData>(defaultPaymentStepData);

export function usePaymentStep() {
  const [paymentStepData, setPaymentStepData] = useAtom(paymentStepDataAtom);
  const resetPaymentStepData = () => setPaymentStepData(defaultPaymentStepData);

  return { paymentStepData, setPaymentStepData, resetPaymentStepData };
}
