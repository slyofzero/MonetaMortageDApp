import { LoanApiResponse } from "@/pages/api/loan";
import { FEStoredLoan } from "@/pages/api/loans";
import {
  RefundApiRequestBody,
  RefundApiResponse,
} from "@/pages/api/refundLiquidation";
import { useLiquidationStep } from "@/state";
import { clientPoster } from "@/utils/api";
import { pastDuePenalty } from "@/utils/constants";
import { roundToSixDecimals } from "@/utils/web3";
import moment from "moment";
import { useEffect, useState } from "react";

export function Step2() {
  const { liquidationStepData, setLiquidationStepData } = useLiquidationStep();
  const { loan, ethReceived } = liquidationStepData;
  const { id, ethLent, duration, loanActiveAt } = loan as FEStoredLoan;
  const [interest, setInterest] = useState(0);
  const [totalToRepay, setTotalToRepay] = useState(0);
  const [toRefund, setToRefund] = useState(0);

  useEffect(
    () => {
      const currentTime = moment();
      const loanActiveTimestamp = moment.unix(loanActiveAt._seconds);
      const daysSinceLoan = currentTime.diff(loanActiveTimestamp, "days");
      const applyPenalty = daysSinceLoan > duration;
      const interest = applyPenalty
        ? daysSinceLoan + pastDuePenalty
        : daysSinceLoan;

      setInterest(interest);
      const totalToRepay = roundToSixDecimals(ethLent * (1 + interest / 100));
      setTotalToRepay(totalToRepay);
      const toRefund = ethReceived - totalToRepay;

      if (toRefund > 0) setToRefund(toRefund);
      else {
        const timer = setTimeout(() => {
          setLiquidationStepData((prev) => ({ ...prev, step: 2 }));
        }, 5000);

        return () => clearTimeout(timer);
      }
    },
    // eslint-disable-next-line
    []
  );

  useEffect(
    () => {
      const refund = async () => {
        if (toRefund > 0) {
          const body: RefundApiRequestBody = {
            ethReceived,
            id: id || "",
          };

          const response = await clientPoster<RefundApiResponse>(
            "/api/refundLiquidation",
            body
          );
          const txn = response.data.txn;

          if (txn) {
            await clientPoster<LoanApiResponse>(
              "/api/loan",
              {
                id: id,
                refundTxn: txn,
                liquidatedAt: new Date().toISOString(),
                repaymentStatus: "LIQUIDATED",
              },
              "PUT"
            );
            setLiquidationStepData((prev) => ({
              ...prev,
              refundTxn: txn,
              step: 2,
            }));
          }
        }
      };

      refund();
    },
    // eslint-disable-next-line
    [toRefund]
  );

  return (
    <div className="flex flex-col items-center justify-center text-sm lg:text-lg">
      <div className="flex flex-col gap-4">
        <p>
          Received <span className="font-semibold">{ethReceived} ETH</span> upon
          token selling
        </p>
        <p>
          Total interest to date -{" "}
          <span className="font-semibold">{interest}%</span>
        </p>
        <p>
          Total ETH to repay -{" "}
          <span className="font-semibold">{totalToRepay} ETH</span>
        </p>
        <p>
          To refund -{" "}
          <span className="font-semibold text-yellow-400">{toRefund} ETH</span>
        </p>
      </div>
    </div>
  );
}
