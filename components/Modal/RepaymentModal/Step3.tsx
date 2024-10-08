import { Link } from "@/components/Common";
import { useLoan, useRepaymentStep } from "@/state";
import { tokensList } from "@/utils/constants";

export function Step3() {
  const { loan } = useLoan();
  const { collateralAmount, collateralToken, ethLent } = loan;
  const { repaymentStepData } = useRepaymentStep();
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
          href={`https://etherscan.io/tx/${repaymentStepData.repayTxn}`}
          target="_blank"
        >
          Repayment Txn
        </Link>

        <Link
          href={`https://etherscan.io/tx/${repaymentStepData.collateralReleaseTxn}`}
          target="_blank"
        >
          Collateral Release Txn
        </Link>
      </div>
    </div>
  );
}
