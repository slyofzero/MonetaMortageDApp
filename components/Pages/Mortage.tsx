import { useAccount } from "wagmi";
import { DurationSlider } from "../DurationSlider";
import { Swap } from "../Swap";
import { ShowWhen } from "../Utils";
import { ConnectButton } from "../blockchain";
import { classNames } from "@/utils";
import { useLoan } from "@/state";
import { useEffect, useState } from "react";
import { getTokenBalance } from "@/utils/web3";
import { clientPoster } from "@/utils/api";

export function Mortage() {
  const { isConnected } = useAccount();
  const { loan } = useLoan();
  const { address } = useAccount();
  const [insufficientBalance, setInsufficientBalance] = useState(false);
  const [userCollateralTokenBalance, setUserCollateralTokenBalance] =
    useState(0);

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
    setInsufficientBalance(
      Number(loan.collateralAmount) > userCollateralTokenBalance
    );
  }, [userCollateralTokenBalance, loan.collateralAmount]);

  const completeLoan = async () => {
    if (insufficientBalance) return;

    const response = await clientPoster("/api/loan", loan);
  };

  const submitButton = (
    <button
      onClick={completeLoan}
      className={classNames(
        "font-semibold px-4 py-2 rounded-lg w-64",
        !insufficientBalance
          ? "bg-white text-black"
          : "text-white bg-black border-[1px] border-solid"
      )}
    >
      {!insufficientBalance ? "Complete loan" : "Insufficient Balance"}
    </button>
  );

  return (
    <div className="flex-grow flex flex-col gap-8 items-center justify-center">
      <Swap />
      <DurationSlider />

      <ShowWhen
        component={submitButton}
        when={isConnected}
        otherwise={<ConnectButton />}
      />
    </div>
  );
}
