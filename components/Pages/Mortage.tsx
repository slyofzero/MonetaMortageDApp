import { useAccount } from "wagmi";
import { DurationSlider } from "../DurationSlider";
import { Swap } from "../Swap";
import { ShowWhen } from "../Utils";
import { ConnectButton } from "../blockchain";
import { classNames } from "@/utils";
import { useLoan, usePaymentStep } from "@/state";
import { useEffect, useState } from "react";
import { getTokenBalance } from "@/utils/web3";
import { clientPoster } from "@/utils/api";
import { PaymentModal } from "../Modal/PaymentModal";
import { LoanApiResponse } from "@/pages/api/loan";
import { TokenSelector } from "../TokenSelector";

export function Mortage() {
  const { isConnected, address } = useAccount();
  const { loan } = useLoan();
  const [insufficientBalance, setInsufficientBalance] = useState(false);
  const [userCollateralTokenBalance, setUserCollateralTokenBalance] =
    useState(0);
  const [openPaymentModel, setOpenPaymentModal] = useState(false);
  const { resetPaymentStepData, setPaymentStepData } = usePaymentStep();
  const [submitBtnText, setSubmitBtnText] = useState<string>("Complete Loan");

  // Get balance
  useEffect(() => {
    if (isConnected) {
      const getBalance = async () => {
        const balance = await getTokenBalance(
          String(address),
          loan.collateralToken
        );
        setUserCollateralTokenBalance(balance);
      };
      getBalance();
    } else {
      setUserCollateralTokenBalance(0);
    }
  }, [address, isConnected, loan.collateralToken]);

  useEffect(() => {
    const isInsufficientBalance =
      Number(loan.collateralAmount) > userCollateralTokenBalance;
    setInsufficientBalance(isInsufficientBalance);

    if (isInsufficientBalance) setSubmitBtnText("Insufficient Balance");
    else if (!loan.collateralAmount)
      setSubmitBtnText("Enter collateral amount");
    else setSubmitBtnText("Complete Loan  ");
  }, [userCollateralTokenBalance, loan.collateralAmount]);

  const completeLoan = async () => {
    if (!loan.collateralAmount) return;
    if (insufficientBalance) return;

    const response = await clientPoster<LoanApiResponse>("/api/loan", {
      ...loan,
      user: address,
    });

    const responseIsOk = response.response === 200;
    const loanId = response.data.id;

    if (responseIsOk && loanId) {
      setOpenPaymentModal(response.response === 200);
      resetPaymentStepData();
      setPaymentStepData((prev) => ({ ...prev, id: loanId }));
    }
  };

  const submitButton = (
    <button
      onClick={completeLoan}
      className={classNames(
        "font-semibold px-4 py-2 rounded-lg w-64",
        insufficientBalance || !loan.collateralAmount
          ? "text-white bg-black border-[1px] border-solid"
          : "bg-white text-black"
      )}
    >
      {submitBtnText}
    </button>
  );

  return (
    <div className="flex-grow flex flex-col gap-8 items-center justify-center">
      <TokenSelector />
      <Swap />
      <DurationSlider />
      <ShowWhen
        component={<PaymentModal setShowPaymentModal={setOpenPaymentModal} />}
        when={openPaymentModel}
      />
      <ShowWhen
        component={submitButton}
        when={isConnected}
        otherwise={<ConnectButton />}
      />
    </div>
  );
}
