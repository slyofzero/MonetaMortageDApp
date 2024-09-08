import {
  LiquidateApiRequestBody,
  LiquidateApiResponse,
} from "@/pages/api/liquidate";
import { LoanApiResponse } from "@/pages/api/loan";
import { FEStoredLoan } from "@/pages/api/loans";
import { useLiquidationStep } from "@/state";
import { clientPoster } from "@/utils/api";
import { collateralTokensList } from "@/utils/constants";
import { getEthRecieved } from "@/utils/web3";
import { useEffect } from "react";

export function Step1() {
  const { liquidationStepData, setLiquidationStepData } = useLiquidationStep();
  const loan = liquidationStepData.loan as FEStoredLoan;
  const { collateralToken, collateralAmount } = loan;
  const { symbol } = collateralTokensList[collateralToken] || {};

  useEffect(() => {
    const sellCollateral = async () => {
      const body: LiquidateApiRequestBody = {
        loanId: loan.id || "",
      };
      const response = await clientPoster<LiquidateApiResponse>(
        "/api/liquidate",
        body
      );
      const txn = response.data.txn;
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
      }
    };

    sellCollateral();
  });

  return (
    <div className="flex items-center justify-center lg:text-lg whitespace-nowrap flex-wrap">
      Selling{" "}
      <span className="text-yellow-400 font-bold mx-2 flex items-center flex-wrap">
        {collateralAmount} {symbol}
      </span>{" "}
      for ETH...
    </div>
  );
}
