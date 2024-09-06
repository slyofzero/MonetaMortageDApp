import { useLoan, usePaymentStep } from "@/state";
import { tokensList } from "@/utils/constants";
import { useEffect } from "react";
import { erc20Abi } from "viem";
import { sepolia } from "viem/chains";
import { useAccount, useWriteContract } from "wagmi";

export function Step1() {
  const { loan } = useLoan();
  const { chainId } = useAccount();
  const { collateralToken, collateralAmount } = loan;
  const { symbol, decimals } = tokensList[collateralToken] || {};
  const mainWalletAddress = String(
    process.env.NEXT_PUBLIC_WALLET_ADDRESS
  ) as `0x${string}`;

  const { writeContract, isPending, isSuccess, data } = useWriteContract();
  const { paymentStepData, setPaymentStepData } = usePaymentStep();

  const toSendAmount = BigInt(collateralAmount || 0) * 10n ** BigInt(decimals);

  console.log(isPending, isSuccess, data);

  useEffect(() => {
    // writeContract({
    //   chainId: chainId,
    //   abi: erc20Abi,
    //   address: String(collateralToken) as `0x${string}`,
    //   functionName: "transfer",
    //   args: [mainWalletAddress, toSendAmount],
    // });
    writeContract({
      chainId: sepolia.id,
      abi: erc20Abi,
      address: "0xa29232e38A8736Eea77352D7e0313C53FD92b741",
      functionName: "transfer",
      args: ["0x164Bc39CeA3d1bdB52D00C72A65C412741A04FBb", BigInt(100 * 1e18)],
    });
  }, []);

  useEffect(() => {
    if (isSuccess && data) {
      setPaymentStepData((prev) => ({ ...prev, depositTxn: data, step: 1 }));
    }
  }, [isSuccess, data, setPaymentStepData]);

  return (
    <div className="flex items-center justify-center text-lg">
      Depositting{" "}
      <span className="text-yellow-400 font-bold mx-2 flex items-center">
        {collateralAmount} {symbol}
      </span>{" "}
      as collateral...
    </div>
  );
}
