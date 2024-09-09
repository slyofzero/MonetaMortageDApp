import { ShowWhen } from "@/components/Utils";
import { LoanApiResponse } from "@/pages/api/loan";
import { FEStoredLoan } from "@/pages/api/loans";
import { ReleastCollateralsApiResponse } from "@/pages/api/releaseCollateral";
import { useRepaymentStep } from "@/state";
import { clientFetcher, clientPoster } from "@/utils/api";
import { tokensList } from "@/utils/constants";
import { useEffect, useState } from "react";

export function Step2() {
  const { repaymentStepData, setRepaymentStepData } = useRepaymentStep();
  const { loan } = repaymentStepData;
  const { id, collateralAmount, collateralToken } = loan as FEStoredLoan;
  const [error, setError] = useState(false);
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
        } else {
          setError(true);
        }
      })();
    },
    // eslint-disable-next-line
    []
  );

  return (
    <ShowWhen
      component={
        <div className="flex items-center justify-center lg:text-lg">
          Releasing{" "}
          <span className="text-yellow-400 font-bold mx-2 flex items-center whitespace-nowrap">
            {collateralAmount} {symbol}
          </span>{" "}
          to your wallet...
        </div>
      }
      when={!error}
      otherwise={
        <>
          <span className="text-red-500 whitespace-normal text-center">
            There was an error in releasing your collateral from the vault,
            please contact support and give them the hash -{" "}
            <span className="font-semibold">{id}</span>
          </span>
        </>
      }
    />
  );
}
