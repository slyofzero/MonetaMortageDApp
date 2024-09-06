import { useAtom, atom } from "jotai";

interface PaymentStepData {
  step: number;
  depositTxn: string;
  receiveTxn: string;
  id: string;
}
export const defaultPaymentStepData: PaymentStepData = {
  id: "",
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
