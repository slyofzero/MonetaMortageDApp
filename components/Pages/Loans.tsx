import { useApi } from "@/hooks/useApi";
import { FEStoredLoan, LoansApiResponse } from "@/pages/api/loans";
import { useAccount } from "wagmi";
import { Link } from "../Common";
import { ShowWhen } from "../Utils";
import { tokensList } from "@/utils/constants";
import { classNames, daysSince, formatToDisplayDate } from "@/utils";
import { useRepaymentStep } from "@/state/useRepaymentStep";
import { useMemo, useState } from "react";
import { RepaymentModal } from "../Modal/RepaymentModal";
import { DisclaimerModal } from "../Modal/DisclaimerModal";
import { useLiquidationStep } from "@/state/useLiquidationStep";
import { LiquidateModal } from "../Modal/LiquidateModal";

const disclaimerText: string[] = [
  "The tokens will be liqudiated and the amount left after (Loan amount + interest + penalty) will be credited to your wallet.",
];

export function Loan({ loan }: { loan: FEStoredLoan }) {
  const {
    collateralToken,
    collateralAmount,
    ethLent,
    collateralDepositTxn,
    ethLentTxn,
    loanDueAt,
    repaymentStatus,
    id,
    loanRepaidAt,
    autoSoldAt,
    liquidatedAt,
  } = loan;

  const { symbol } = tokensList[collateralToken] || {};

  const { resetRepaymentStepData, setRepaymentStepData } = useRepaymentStep();
  const { resetLiquidationStepData, setLiquidationStepData } =
    useLiquidationStep();

  const [openRepaymentModal, setOpenRepaymentModal] = useState(false);
  const [openLiquidationModal, setOpenLiquidationModal] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const repay = () => {
    resetRepaymentStepData();
    setRepaymentStepData((prev) => ({ ...prev, id: id || "", loan }));
    setOpenRepaymentModal(true);
  };

  const repayButton = (
    <button
      onClick={repay}
      className="bg-white text-black font-semibold px-4 py-2 rounded-lg"
    >
      Repay
    </button>
  );

  const liquidateButton = (
    <button
      onClick={() => setShowDisclaimer(true)}
      className="bg-zinc-800 text-white font-semibold px-4 py-2 rounded-lg"
    >
      Liquidate
    </button>
  );

  const [loanTitle, statusStyle] = useMemo(
    () => {
      switch (repaymentStatus) {
        case "PAID":
          return [
            `Paid at - ${formatToDisplayDate(loanRepaidAt?._seconds)}`,
            "text-green-400",
          ];
        case "AUTOSOLD":
          return [
            `Autosold at - ${formatToDisplayDate(autoSoldAt?._seconds)}`,
            "text-blue-400",
          ];
        case "PASTDUE":
          return [
            `Due since ${daysSince(loanDueAt?._seconds)} days`,
            "text-red-400",
          ];
        case "LIQUIDATED":
          return [
            `Liquidated at ${formatToDisplayDate(liquidatedAt?._seconds)}`,
            "text-red-400",
          ];
        default:
          return [
            `Due at - ${formatToDisplayDate(loanDueAt?._seconds)}`,
            "text-orange-400",
          ];
      }
    },
    // eslint-disable-next-line
    [repaymentStatus]
  );

  const canUserStillPay =
    repaymentStatus === "PENDING" || repaymentStatus === "PASTDUE";

  const liquidate = async () => {
    setShowDisclaimer(false);
    resetLiquidationStepData();
    setLiquidationStepData((prev) => ({ ...prev, id: id || "", loan }));
    setOpenLiquidationModal(true);
  };

  return (
    <div className="flex flex-col justify-center gap-6 border-[1px] border-solid border-white/75 rounded-lg p-8">
      <span className="flex flex-col lg:flex-row items-center gap-4 lg:gap-4 justify-between">
        <h1 className="font-bold text-2xl">{loanTitle}</h1>
        <span
          className={classNames("text-black px-4 py-1 rounded-lg", statusStyle)}
        >
          {repaymentStatus}
        </span>
      </span>

      <div className="flex justify-between gap-16">
        <div className="flex flex-col gap-1">
          <span>
            <span className="font-semibold text-yellow-400">Collateral</span> -{" "}
            {collateralAmount} {symbol}
          </span>

          <Link
            className="font-medium underline text-xs"
            href={`https://etherscan.com/tx/${collateralDepositTxn}`}
          >
            Deposit Txn
          </Link>
        </div>

        <div className="flex flex-col gap-1">
          <span>
            <span className="font-semibold">Lent</span> - {ethLent} ETH
          </span>

          <Link
            className="font-medium underline text-xs ml-auto"
            href={`https://etherscan.com/tx/${ethLentTxn}`}
          >
            Lent Txn
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <ShowWhen component={repayButton} when={canUserStillPay} />
        <ShowWhen component={liquidateButton} when={canUserStillPay} />
      </div>

      <ShowWhen
        component={
          <DisclaimerModal
            text={disclaimerText}
            setShowDisclaimer={setShowDisclaimer}
            onAccept={liquidate}
            btnText={`Liquidate ${collateralAmount} ${symbol}`}
          />
        }
        when={showDisclaimer}
      />

      <ShowWhen
        component={
          <RepaymentModal setShowRepaymentModal={setOpenRepaymentModal} />
        }
        when={openRepaymentModal}
      />

      <ShowWhen
        component={
          <LiquidateModal setShowLiquidationModal={setOpenLiquidationModal} />
        }
        when={openLiquidationModal}
      />
    </div>
  );
}

export function Loans() {
  const { address } = useAccount();
  const { data } = useApi<LoansApiResponse>(`/api/loans?user=${address}`);
  const userLoans = data?.loans;

  const noLoans = (
    <div className="flex flex-col items-center justify-center gap-4">
      <h3 className="text-2xl font-semibold">
        You haven&apos;t applied for any loans yet
      </h3>
      <Link
        href={"/mortgage"}
        className="bg-[#00FF47] p-4 py-2 rounded-lg text-black font-semibold text-lg"
      >
        Click here to apply
      </Link>
    </div>
  );

  const loans = (
    <div
      className={classNames(
        "grid grid-cols-1 justify-center items-stretch gap-x-4 gap-y-8",
        userLoans?.length === 1
          ? "lg:grid-cols-1"
          : userLoans?.length === 2
            ? "lg:grid-cols-2"
            : "lg:grid-cols-3"
      )}
    >
      {userLoans?.map((loan, key) => <Loan loan={loan} key={key} />)}
    </div>
  );

  return (
    <div className="flex items-center justify-center flex-grow pt-16 pb-32 lg:py-8">
      <ShowWhen
        component={loans}
        when={userLoans?.length}
        otherwise={noLoans}
      />
    </div>
  );
}
