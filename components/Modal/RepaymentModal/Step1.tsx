import { FEStoredLoan } from "@/pages/api/loans";
import { web3 } from "@/rpc";
import { useRepaymentStep } from "@/state";
import { useEffect, useState } from "react";
import { useSendTransaction } from "wagmi";
import { pastDuePenalty, platformCharge } from "@/utils/constants";
import { clientFetcher, clientPoster } from "@/utils/api";
import { LoanApiResponse } from "@/pages/api/loan";
import { ShowWhen } from "@/components/Utils";
import {
  RepaymentBreakdown,
  RepaymentBreakdownApiResponse,
} from "@/pages/api/getRepaymentBreakdown";

const defaultRepaymentBreakdown: RepaymentBreakdown = {
  daysSinceLoan: 0,
  interest: 0,
  penalty: false,
  totalToRepay: 0,
  repaymentUnder24h: false,
  isMntaHolder: false,
  interestDiscount: 1,
};

export function Step1() {
  const { repaymentStepData, setRepaymentStepData } = useRepaymentStep();
  const loan = repaymentStepData.loan as FEStoredLoan;
  const { ethLent } = loan;
  const mainWalletAddress = String(
    process.env.NEXT_PUBLIC_VAULT_ADDRESS
  ) as `0x${string}`;

  const [repaymentBreakdownData, setRepaymentBreakdownData] =
    useState<RepaymentBreakdown>(defaultRepaymentBreakdown);

  const { sendTransaction, data, isSuccess, isError } = useSendTransaction();

  // Calculate amount to repay
  useEffect(() => {
    const getRepaymentBreakdown = async () => {
      const response = await clientFetcher<RepaymentBreakdownApiResponse>(
        `/api/getRepaymentBreakdown?loan=${loan.id}`
      );
      const breakdown = response.data.breakdown;
      if (breakdown) setRepaymentBreakdownData(breakdown);
    };

    getRepaymentBreakdown();
  }, [loan]);

  const repay = () => {
    if (repaymentBreakdownData === defaultRepaymentBreakdown) return;

    sendTransaction({
      to: mainWalletAddress,
      value: BigInt(web3.utils.toWei(totalToRepay, "ether")),
    });
  };

  // ON SUCCESS
  useEffect(
    () => {
      if (data) {
        const updateMortgageDepositLink = async () => {
          await clientPoster<LoanApiResponse>(
            "/api/loan",
            {
              id: repaymentStepData.id,
              repayEthTxn: data,
            },
            "PUT"
          );
          setRepaymentStepData((prev) => ({
            ...prev,
            repayTxn: data,
            step: 1,
          }));
        };
        updateMortgageDepositLink();
      }
    },
    // eslint-disable-next-line
    [isSuccess, data]
  );

  const {
    daysSinceLoan,
    penalty,
    totalToRepay,
    repaymentUnder24h,
    interestDiscount,
    isMntaHolder,
  } = repaymentBreakdownData;

  const paymentBreakdown = (
    <div className="flex flex-col gap-8 items-center justify-center text-sm lg:text-base whitespace-nowrap flex-wrap">
      <div className="grid grid-cols-2 w-64 lg:w-fit gap-x-4 lg:gap-x-12">
        <span className="font-semibold">ETH Lent</span>
        <span className="ml-auto">{ethLent}</span>

        <span className="font-semibold">Days Since Loan</span>
        <span className="ml-auto">{daysSinceLoan}</span>

        <span className="font-semibold">Past due date</span>
        <span className="ml-auto">{penalty ? "Yes" : "No"}</span>

        <span className="font-semibold">Interest</span>
        <span className="ml-auto">
          {daysSinceLoan} * {1 * interestDiscount}%{" "}
          {penalty && `+ ${pastDuePenalty * interestDiscount}%`}
        </span>

        <ShowWhen
          when={repaymentUnder24h}
          component={
            <>
              <span className="font-semibold">Platform Charge</span>
              <span className="ml-auto">{platformCharge} ETH</span>
            </>
          }
        />

        <span className="font-semibold text-lg lg:text-2xl mt-4">
          Total to repay
        </span>
        <span className="ml-auto mt-4 text-lg lg:text-2xl">
          {totalToRepay} ETH
        </span>
      </div>

      <ShowWhen
        component={
          <div className="flex gap-4 justify-center text-yellow-400 -mb-4">
            <span>
              MNTA Holder Interest Discount, {interestDiscount * 100}% off
            </span>
          </div>
        }
        when={isMntaHolder}
      />

      <button
        className="bg-white text-black rounded-lg px-4 py-2 font-semibold"
        onClick={repay}
      >
        Repay {totalToRepay} ETH
      </button>
    </div>
  );

  return (
    <ShowWhen
      component={paymentBreakdown}
      when={!isError}
      otherwise={
        <>
          <span className="text-red-500 whitespace-normal text-center">
            There was an error in repaying ETH to the vault, please close the
            modal and try again.
          </span>
        </>
      }
    />
  );
}
