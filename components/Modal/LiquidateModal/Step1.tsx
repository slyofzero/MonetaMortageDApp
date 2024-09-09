import { ShowWhen } from "@/components/Utils";
import { JobStatusApiResponse } from "@/pages/api/jobStatus";
import {
  LiquidateApiRequestBody,
  LiquidateApiResponse,
} from "@/pages/api/liquidate";
import { LoanApiResponse } from "@/pages/api/loan";
import { FEStoredLoan } from "@/pages/api/loans";
import { useLiquidationStep } from "@/state";
import { sleep } from "@/utils";
import { clientFetcher, clientPoster } from "@/utils/api";
import { collateralTokensList } from "@/utils/constants";
import { getEthRecieved } from "@/utils/web3";
import { useEffect, useState } from "react";

export function Step1() {
  const { liquidationStepData, setLiquidationStepData } = useLiquidationStep();
  const loan = liquidationStepData.loan as FEStoredLoan;
  const { collateralToken, collateralAmount } = loan;
  const { symbol } = collateralTokensList[collateralToken] || {};
  const [error, setError] = useState(false);

  useEffect(() => {
    const sellCollateral = async () => {
      const body: LiquidateApiRequestBody = {
        loanId: loan.id || "",
      };
      const response = await clientPoster<LiquidateApiResponse>(
        "/api/liquidate",
        body
      );
      const jobId = response.data.jobId;

      for (let i = 0; i < 20; i++) {
        const response = await clientFetcher<JobStatusApiResponse>(
          `/api/jobStatus?jobId=${jobId}`
        );

        const { status, txn } = response.data;

        if (status !== "Completed") {
          if (status === "Failed") {
            setError(true);
            break;
          }

          await sleep(30 * 1e3);
          continue;
        }

        if (txn) {
          const ethReceived = await getEthRecieved(txn);

          await clientPoster<LoanApiResponse>(
            "/api/loan",
            {
              id: liquidationStepData.id,
              liquidateTxn: txn,
            },
            "PUT"
          );

          setLiquidationStepData((prev) => ({
            ...prev,
            liquidateTxn: txn,
            step: 1,
            ethReceived,
          }));
        } else {
          setError(true);
        }
        break;
      }
    };

    sellCollateral();
  });

  return (
    <div className="flex items-center justify-center lg:text-lg whitespace-nowrap flex-wrap">
      <ShowWhen
        component={
          <>
            Selling{" "}
            <span className="text-yellow-400 font-bold mx-2 flex items-center flex-wrap">
              {collateralAmount} {symbol}
            </span>{" "}
            for ETH...
          </>
        }
        when={!error}
        otherwise={
          <>
            <span className="text-red-500 whitespace-normal text-center">
              There was an error in selling your tokens, please close the modal
              and try again.
            </span>
          </>
        }
      />
    </div>
  );
}
