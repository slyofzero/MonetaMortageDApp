import { useLoan } from "@/state";

export function Step2() {
  const { loan } = useLoan();
  const { ethLent } = loan;

  return (
    <div className="flex items-center justify-center text-lg">
      Sending{" "}
      <span className="text-yellow-400 font-bold mx-2 flex items-center">
        {ethLent} ETH
      </span>{" "}
      to your wallet...
    </div>
  );
}
