import { Link } from "@/components/Common";
import { usePaymentStep } from "@/state";

export function Step3() {
  const { paymentStepData } = usePaymentStep();

  return (
    <div className="flex items-center justify-center text-lg">
      <Link href={`https://etherscan.io/tx/${paymentStepData.depositTxn}`}>
        Deposit Txn
      </Link>

      <Link href={`https://etherscan.io/tx/${paymentStepData.receiveTxn}`}>
        Receival Txn
      </Link>
    </div>
  );
}
