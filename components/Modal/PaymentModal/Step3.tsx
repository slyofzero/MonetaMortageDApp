import { Link } from "@/components/Common";
import { useLoan, usePaymentStep } from "@/state";
import { tokensList } from "@/utils/constants";

export function Step3() {
  const { loan } = useLoan();
  const { collateralAmount, collateralToken, ethLent } = loan;
  const { paymentStepData } = usePaymentStep();
  const { symbol } = tokensList[collateralToken] || {};

  return (
    <div className="flex flex-col items-center justify-center lg:text-lg gap-8">
      <p className="flex flex-col lg:flex-row items-end lg:items-start gap-1 lg:gap-2">
        <span className="flex gap-2">
          Deposited{" "}
          <span className="flex gap-2 text-yellow-400 whitespace-nowrap">
            {collateralAmount} {symbol}
          </span>
        </span>

        <span className="flex gap-2">
          Received
          <span className="font-bold whitespace-nowrap">{ethLent} ETH</span>
        </span>
      </p>

      <div className="flex gap-4 font-bold underline">
        <Link
          href={`https://etherscan.io/tx/${paymentStepData.depositTxn}`}
          target="_blank"
        >
          Deposit Txn
        </Link>

        <Link
          href={`https://etherscan.io/tx/${paymentStepData.receiveTxn}`}
          target="_blank"
        >
          Receival Txn
        </Link>
      </div>

      <Link
        className="bg-[#00FF47] px-4 py-2 text-black rounded-lg font-semibold"
        href={"/loans"}
      >
        Click here to view all loans
      </Link>
    </div>
  );
}
