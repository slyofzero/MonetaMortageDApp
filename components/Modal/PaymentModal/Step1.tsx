import { LoanApiResponse } from "@/pages/api/loan";
import { useLoan, usePaymentStep } from "@/state";
import { clientPoster } from "@/utils/api";
import { tokensList } from "@/utils/constants";
import { useEffect } from "react";
import { erc20Abi } from "viem";
import { mainnet } from "viem/chains";
import { useWriteContract } from "wagmi";
import { ethers } from "ethers";

export function Step1() {
  const { loan } = useLoan();
  const { collateralToken, collateralAmount } = loan;
  const { symbol, decimals } = tokensList[collateralToken] || {};
  const mainWalletAddress = String(
    process.env.NEXT_PUBLIC_VAULT_ADDRESS
  ) as `0x${string}`;

  const { writeContract, isSuccess, data } = useWriteContract();
  const { setPaymentStepData, paymentStepData } = usePaymentStep();

  const toSendAmount = ethers.parseUnits(
    String(collateralAmount || 0),
    decimals
  );

  // WRITE CONTRACT
  useEffect(
    () => {
      writeContract({
        chainId: mainnet.id,
        abi: erc20Abi,
        address: String(collateralToken) as `0x${string}`,
        functionName: "transfer",
        args: [mainWalletAddress, toSendAmount],
      });
    },
    // eslint-disable-next-line
    []
  );

  // ON SUCCESS
  useEffect(
    () => {
      if (data) {
        const updateMortgageDepositLink = async () => {
          await clientPoster<LoanApiResponse>(
            "/api/loan",
            {
              id: paymentStepData.id,
              collateralDepositTxn: data,
            },
            "PUT"
          );
          setPaymentStepData((prev) => ({
            ...prev,
            depositTxn: data,
            step: 1,
          }));
        };
        updateMortgageDepositLink();
      }
    },
    // eslint-disable-next-line
    [isSuccess, data]
  );

  return (
    <div className="flex items-center justify-center lg:text-lg whitespace-nowrap flex-wrap">
      Depositing{" "}
      <span className="text-yellow-400 font-bold mx-2 flex items-center flex-wrap">
        {collateralAmount} {symbol}
      </span>{" "}
      as collateral...
    </div>
  );
}
