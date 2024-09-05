import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { getTokenBalance } from "@/utils/web3";
import { useRouter } from "next/router";
import { Swap } from "../Swap";
import { TokenInfo } from "@/types";

export function Mortage() {
  const [token2, setToken2] = useState<TokenInfo>();
  const [tokenBalance, setTokenBalance] = useState(0);
  const [mortageAmount, setMortageAmount] = useState<number | string>("");
  const router = useRouter();
  const { token } = router.query;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = Object.fromEntries(new FormData(form).entries());
    console.log(formData);
  };

  const { address } = useAccount();

  useEffect(() => {
    async function getBalance() {
      const balance = await getTokenBalance(String(address), String(token));
      setTokenBalance(Number(balance));
    }

    getBalance();
  }, [address, token]);

  const onTokenAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);

    if (isNaN(value)) {
      setMortageAmount("");
    } else if (value > tokenBalance) {
    } else {
      setMortageAmount(value);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center">
      <Swap token2={token2} setToken2={setToken2} />
    </div>
  );
}
