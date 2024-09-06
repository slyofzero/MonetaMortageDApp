import { LoanApiResponse } from "@/pages/api/loan";
import { FEStoredLoan } from "@/pages/api/loans";
import { ReleastCollateralsApiResponse } from "@/pages/api/releaseCollateral";
import { useRepaymentStep } from "@/state";
import { clientFetcher, clientPoster } from "@/utils/api";
import { tokensList } from "@/utils/constants";
import { useEffect } from "react";

export function Step2() {
  const { repaymentStepData, setRepaymentStepData } = useRepaymentStep();
  const { loan } = repaymentStepData;
  const { id, collateralAmount, collateralToken } = loan as FEStoredLoan;

  const { symbol } = tokensList[collateralToken] || {};

  useEffect(
    () => {
      (async () => {
        const response = await clientFetcher<ReleastCollateralsApiResponse>(
          `/api/releaseCollateral?loan=${id}`
        );
        const txnHash = response.data.txn;

        if (txnHash) {
          await clientPoster<LoanApiResponse>(
            "/api/loan",
            {
              id: repaymentStepData.id,
              collateralReleaseTxn: txnHash,
              repaymentStatus: "PAID",
              loanRepaidAt: new Date().toISOString(),
            },
            "PUT"
          );
          setRepaymentStepData((prev) => ({
            ...prev,
            collateralReleaseTxn: txnHash,
            step: 2,
          }));
        }
      })();
    },
    // eslint-disable-next-line
    []
  );

  return (
    <div className="flex items-center justify-center lg:text-lg">
      Releasing{" "}
      <span className="text-yellow-400 font-bold mx-2 flex items-center whitespace-nowrap">
        {collateralAmount} {symbol}
      </span>{" "}
      to your wallet...
    </div>
  );
}
