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
import { DisclaimerModal } from "../Modal/DisclaimerModal";
import { collateralTokensList } from "@/utils/constants";

const disclaimerText: string[] = [
  "1. Your collateral assets value drops to +5% of Your Loan Value + Total interest + Penalty (if any) accumulated till that day.",
  "2. You fail to repay it back in 30 Days, in that case, the tokens will be liqudiated and the amount left after (Loan amount + interest + penalty) will be credited to your wallet.",
  "3. If the loan is paid back within 24 hours, a foreclosure fee of 0.5 ETH would be applied during repayment.",
];

export function Mortgage() {
  const { isConnected, address } = useAccount();
  const { loan } = useLoan();
  const [insufficientBalance, setInsufficientBalance] = useState(false);
  const [userCollateralTokenBalance, setUserCollateralTokenBalance] =
    useState(0);
  const [openPaymentModel, setOpenPaymentModal] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
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
    setInsufficientBalance(
      isInsufficientBalance || Number(loan.collateralAmount) === 0
    );

    if (isInsufficientBalance) setSubmitBtnText("Insufficient Balance");
    else if (!loan.collateralAmount)
      setSubmitBtnText("Enter collateral amount");
    else setSubmitBtnText("Complete Loan  ");
  }, [userCollateralTokenBalance, loan.collateralAmount]);

  const completeLoan = async () => {
    if (!loan.collateralAmount) return;
    if (insufficientBalance) return;

    setShowDisclaimer(true);
  };

  const onDepositClick = async () => {
    const response = await clientPoster<LoanApiResponse>("/api/loan", {
      ...loan,
      user: address,
    });
    const responseIsOk = response.response === 200;
    const loanId = response.data.id;

    if (responseIsOk && loanId) {
      setShowDisclaimer(false);
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

  const { symbol } = collateralTokensList[loan.collateralToken] || {};

  return (
    <div className="flex-grow flex flex-col pt-16 pb-32 lg:py-0 gap-8 items-center justify-center">
      <TokenSelector />
      <Swap />
      <DurationSlider />
      <ShowWhen
        component={<PaymentModal setShowPaymentModal={setOpenPaymentModal} />}
        when={openPaymentModel}
      />

      <ShowWhen
        component={
          <DisclaimerModal
            text={disclaimerText}
            setShowDisclaimer={setShowDisclaimer}
            onAccept={onDepositClick}
            btnText={`Deposit ${loan.collateralAmount} ${symbol}`}
          />
        }
        when={showDisclaimer}
      />

      <ShowWhen
        component={submitButton}
        when={isConnected}
        otherwise={<ConnectButton />}
      />
    </div>
  );
}
