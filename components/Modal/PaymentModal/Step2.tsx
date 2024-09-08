import { LendApiRequestBody, LendApiResponse } from "@/pages/api/lend";
import { LoanApiResponse } from "@/pages/api/loan";
import { useLoan, usePaymentStep } from "@/state";
import { clientPoster } from "@/utils/api";
import { useEffect } from "react";

export function Step2() {
  const { loan } = useLoan();
  const { ethLent } = loan;
  const { setPaymentStepData, paymentStepData } = usePaymentStep();
  const { id } = paymentStepData;

  useEffect(
    () => {
      const body: LendApiRequestBody = {
        id,
      };

      (async () => {
        const response = await clientPoster<LendApiResponse>("/api/lend", body);
        const txnHash = response.data.txn;

        if (txnHash) {
          await clientPoster<LoanApiResponse>(
            "/api/loan",
            {
              id: paymentStepData.id,
              ethLentTxn: txnHash,
              status: "PAID",
              loanActiveAt: new Date().toISOString(),
              repaymentStatus: "PENDING",
            },
            "PUT"
          );
          setPaymentStepData((prev) => ({
            ...prev,
            receiveTxn: txnHash,
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
      Sending{" "}
      <span className="text-yellow-400 font-bold mx-2 flex items-center whitespace-nowrap">
        {ethLent} ETH
      </span>{" "}
      to your wallet...
    </div>
  );
}
