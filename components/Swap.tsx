import { tokensList, WETH } from "@/utils/constants";
import { IoChevronDownOutline } from "react-icons/io5";
import { Image } from "./Common";
import { useEffect, useState } from "react";
import { apiFetcher } from "@/utils/api";
import { PriceApiResponse } from "@/pages/api/price";
import { getEthBalance, getTokenBalance } from "@/utils/web3";
import { useAccount } from "wagmi";
import { ShowWhen } from "./Utils";
import { useRouter } from "next/router";

interface TokenInputProps {
  id: string;
  label: string;
  tokenAddress: string;
  // eslint-disable-next-line
  onChange: (value: number) => void;
  value: number | null;
}

function TokenInput({
  id,
  label,
  tokenAddress,
  onChange,
  value,
}: TokenInputProps) {
  const symbol = tokensList[tokenAddress]?.symbol;
  const logoURI = tokensList[tokenAddress]?.logoURI;

  const [tokenBalance, setTokenBalance] = useState<number>();
  const [usdValue, setUsdValue] = useState<number>();
  const { address, isConnected } = useAccount();

  // Get balance
  useEffect(() => {
    if (isConnected) {
      let getBalance = async () => {};

      if (tokenAddress === WETH) {
        getBalance = async () => {
          const balance = await getEthBalance(String(address));
          setTokenBalance(balance);
        };
      } else if (tokenAddress) {
        getBalance = async () => {
          const balance = await getTokenBalance(String(address), tokenAddress);
          setTokenBalance(balance);
        };
      }
      getBalance();
    } else {
      setTokenBalance(0);
    }
  }, [tokenAddress, address, isConnected]);

  // Get price USD
  useEffect(() => {
    const getPrice = async () => {
      const tokenPrice = await apiFetcher<PriceApiResponse>(
        `/api/price?token=${tokenAddress}`
      );

      if (value) {
        const usdValue = value * (tokenPrice.data.data?.priceUsd || 0);
        setUsdValue(Number(usdValue.toFixed(2)));
      }
    };

    getPrice();
  }, [value, tokenAddress]);

  // Max Balance
  const maxBalance = () => onChange(tokenBalance || 0);

  return (
    <div className="bg-zinc-700 p-3 rounded-lg border-[1px] border-zinc-500/75 flex flex-col gap-2 w-full">
      <label className="text-xs text-zinc-300" htmlFor={id}>
        {label}
      </label>

      <div className="flex gap-4 justify-between items-center w-full">
        <input
          type="number"
          className="bg-inherit outline-none text-2xl lg:text-3xl max-w-[180px] lg:max-w-[200px] flex-grow"
          placeholder="0"
          onChange={(e) => {
            const value = Number(e.target.value);
            onChange(value);
          }}
          value={value || ""}
        />

        <button className="p-1 rounded-full bg-black uppercase flex gap-1 items-center justify-between h-fit ml-auto">
          <Image
            className="w-6 aspect-square rounded-full mr-1"
            src={logoURI}
            alt={symbol}
          />
          <span className="font-semibold lg:text-lg">{symbol}</span>
          <IoChevronDownOutline className="mr-2" />
        </button>
      </div>

      <div className="flex justify-between items-center">
        <span>${usdValue}</span>

        <div className="flex items-center gap-2">
          <ShowWhen
            component={
              <span className="text-xs text-zinc-300">
                Balance - {tokenBalance}
              </span>
            }
            when={tokenBalance}
          />

          <ShowWhen
            component={
              <button
                onClick={maxBalance}
                className="text-white underline text-xs font-semibold"
              >
                Max
              </button>
            }
            when={tokenAddress !== WETH}
          />
        </div>
      </div>
    </div>
  );
}

export function Swap() {
  const [inputTokenAmount, setInputTokenAmount] = useState<null | number>(null);
  const [outputTokenAmount, setOutputTokenAmount] = useState<null | number>(null); //prettier-ignore
  const [inputToken, setInputToken] = useState<string>("");
  const [tokenPrice, setTokenPrice] = useState<PriceApiResponse["data"]>();
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (token) setInputToken(String(token));
  }, [token]);

  // ------------------------------ Get Token Price ------------------------------
  useEffect(() => {
    const getPrice = async () => {
      const tokenPrice = await apiFetcher<PriceApiResponse>(
        `/api/price?token=${inputToken}`
      );
      setTokenPrice(tokenPrice.data.data);
    };
    const intervalId = setInterval(getPrice, 30 * 1e3);
    getPrice();
    return () => clearInterval(intervalId);
  }, [inputToken, inputTokenAmount]);

  // ------------------------------ On change ------------------------------
  const onInputAmountChange = async (value: number) => {
    setInputTokenAmount(value);
    const outputAmount = value * (tokenPrice?.priceNative || 0);
    setOutputTokenAmount(outputAmount);
  };

  const onOutputAmountChange = (value: number) => {
    setOutputTokenAmount(value);
    const inputAmount = value / (tokenPrice?.priceNative || 0);
    setInputTokenAmount(inputAmount);
  };

  return (
    <div className="p-2 border-[1px] border-white/30 rounded-xl flex flex-col gap-1">
      <TokenInput
        id="mortageAmount"
        label="Mortage"
        tokenAddress={inputToken}
        onChange={onInputAmountChange}
        value={inputTokenAmount}
      />
      <TokenInput
        id="loanAmount"
        label="Loaned"
        tokenAddress={WETH}
        onChange={onOutputAmountChange}
        value={outputTokenAmount}
      />
    </div>
  );
}
