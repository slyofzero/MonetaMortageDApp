import { Link } from "@/components/Common";
import { ShowWhen } from "@/components/Utils";
import { useLiquidationStep, useLoan } from "@/state";
import { tokensList } from "@/utils/constants";

export function Step3() {
  const { loan } = useLoan();
  const { collateralAmount, collateralToken } = loan;
  const { liquidationStepData } = useLiquidationStep();
  const { symbol } = tokensList[collateralToken] || {};

  return (
    <div className="flex flex-col items-center justify-center lg:text-lg gap-8">
      <p className="flex flex-col lg:flex-row items-end lg:items-start gap-1 lg:gap-2">
        <span className="flex gap-2">
          Liquidated{" "}
          <span className="flex gap-2 text-yellow-400 whitespace-nowrap">
            {collateralAmount} {symbol}
          </span>
        </span>
      </p>

      <div className="flex gap-4 font-bold underline">
        <Link
          href={`https://etherscan.io/tx/${liquidationStepData.liquidateTxn}`}
          target="_blank"
        >
          Selling Txn
        </Link>

        <ShowWhen
          component={
            <Link
              href={`https://etherscan.io/tx/${liquidationStepData.refundTxn}`}
              target="_blank"
            >
              Refund Txn
            </Link>
          }
          when={liquidationStepData.refundTxn}
        />
      </div>
    </div>
  );
}
