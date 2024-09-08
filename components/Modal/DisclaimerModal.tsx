import { Dispatch } from "react";
import { Modal } from ".";
import { SetStateAction } from "jotai";
import { useLoan } from "@/state";
import { collateralTokensList } from "@/utils/constants";

// Payment Modal
interface Props {
  setShowDisclaimer: Dispatch<SetStateAction<boolean>>;
  onDepositClick: () => void;
}

export function DisclaimerModal({ setShowDisclaimer, onDepositClick }: Props) {
  const { loan } = useLoan();
  const { collateralToken, collateralAmount } = loan;
  const { symbol } = collateralTokensList[collateralToken] || {};

  return (
    <Modal size="lg" setShowModal={setShowDisclaimer}>
      <div className="flex flex-col gap-8 px-8">
        <h1 className="text-4xl font-bold text-center">Disclaimer</h1>

        <ol className="flex flex-col gap-4">
          <li>
            1. Your collateral assets value drops to +5% of Your Loan Value +
            Total interest + Penalty (if any) accumulated till that day.
          </li>

          <li>
            2. You fail to repay it back in 30 Days, in that case, the tokens
            will be liqudiated and the amount left after (Loan amount + interest
            + penalty) will be credited to your wallet.
          </li>
        </ol>

        <button
          onClick={onDepositClick}
          className="bg-white px-4 py-2 text-black font-bold rounded-lg"
        >
          Deposit {collateralAmount} {symbol}
        </button>
      </div>
    </Modal>
  );
}
