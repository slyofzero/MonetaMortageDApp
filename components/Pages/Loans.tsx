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
  } = loan;

  const { symbol } = tokensList[collateralToken] || {};

  const { resetRepaymentStepData, setRepaymentStepData } = useRepaymentStep();
  const [openRepaymentModal, setOpenRepaymentModal] = useState(false);

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

  const [loanTitle, statusStyle] = useMemo(
    () => {
      switch (repaymentStatus) {
        case "PAID":
          return [
            `Paid at - ${formatToDisplayDate(loanRepaidAt._seconds)}`,
            "text-green-400",
          ];
        case "AUTOSOLD":
          return [
            `Autosold at - ${formatToDisplayDate(autoSoldAt._seconds)}`,
            "text-blue-400",
          ];
        case "PASTDUE":
          return [
            `Due since ${daysSince(loanDueAt._seconds)} days`,
            "text-red-400",
          ];
        default:
          return [
            `Due at - ${formatToDisplayDate(loanDueAt._seconds)}`,
            "text-orange-400",
          ];
      }
    },
    // eslint-disable-next-line
    [repaymentStatus]
  );

  const canUserStillPay =
    repaymentStatus === "PENDING" || repaymentStatus === "PASTDUE";

  return (
    <div className="flex flex-col gap-6 border-[1px] border-solid border-white/75 rounded-lg p-8">
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

      <ShowWhen component={repayButton} when={canUserStillPay} />

      <ShowWhen
        component={
          <RepaymentModal setShowRepaymentModal={setOpenRepaymentModal} />
        }
        when={openRepaymentModal}
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
        href={"/mortage"}
        className="bg-[#00FF47] p-4 py-2 rounded-lg text-black font-semibold text-lg"
      >
        Click here to apply
      </Link>
    </div>
  );

  const loans = (
    <div className="flex flex-col gap-8">
      {userLoans?.map((loan, key) => <Loan loan={loan} key={key} />)}
    </div>
  );

  return (
    <div className="flex items-center justify-center flex-grow">
      <ShowWhen
        component={loans}
        when={userLoans?.length}
        otherwise={noLoans}
      />
    </div>
  );
}
