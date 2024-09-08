import { loanPercentage, monetaCA, tokensList, WETH } from "@/utils/constants";
import { Image, Link } from "./Common";
import { useEffect, useState } from "react";
import { apiFetcher } from "@/utils/api";
import { PriceApiResponse } from "@/pages/api/price";
import {
  getEthBalance,
  getTokenBalance,
  roundToSixDecimals,
  shortenEthAddress,
} from "@/utils/web3";
import { useAccount } from "wagmi";
import { ShowWhen } from "./Utils";
import { useRouter } from "next/router";
import { useLoan } from "@/state";

interface TokenInputProps {
  id: string;
  label: string;
  tokenAddress: string;
  // eslint-disable-next-line
  onChange: (value: number) => void;
  value: number | string | null;
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

  const { setLoan } = useLoan();

  const tokenIsEth = tokenAddress === WETH;

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

      const tokenUsdPrice = tokenPrice.data.data?.priceUsd;
      if (!tokenUsdPrice || !value) return;

      const usdValue = Number(value) * tokenUsdPrice;
      setUsdValue(Number(usdValue.toFixed(2)));

      if (!tokenIsEth) {
        setLoan((prev) => ({
          ...prev,
          collateralUsdValueAtLoan: Number(usdValue.toFixed(2)),
          collateralUsdPriceAtLoan: tokenUsdPrice,
        }));
      } else {
        setLoan((prev) => ({
          ...prev,
          ethLentUsd: Number(usdValue.toFixed(2)),
        }));
      }
    };

    getPrice();
  }, [setLoan, tokenAddress, value, tokenIsEth]);

  // Max Balance
  const maxBalance = () => onChange(tokenBalance || 0);

  return (
    <div className="bg-zinc-700 p-3 rounded-lg border-[1px] border-zinc-500/75 flex flex-col gap-2 w-full">
      <label className="text-xs text-zinc-300" htmlFor={id}>
        {label}
      </label>

      <div className="flex gap-4 justify-between items-center w-full">
        <input
          type="text"
          className="bg-inherit outline-none text-2xl lg:text-3xl max-w-[180px] lg:max-w-[200px] flex-grow"
          placeholder="0"
          onChange={(e) => {
            const value = e.target.value;
            if (!isNaN(Number(value || 0)))
              onChange(value as unknown as number);
          }}
          value={value || ""}
        />

        <button className="p-1 rounded-full bg-black uppercase flex gap-1 items-center justify-between h-fit ml-auto pr-2">
          <Image
            className="w-6 aspect-square rounded-full mr-1"
            src={logoURI}
            alt={symbol}
          />
          <span className="font-semibold lg:text-lg">{symbol}</span>
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
            when={tokenBalance && !tokenIsEth}
          />
        </div>
      </div>
    </div>
  );
}

export function Swap() {
  const [tokenPrice, setTokenPrice] = useState<PriceApiResponse["data"]>();
  const router = useRouter();
  const { token: queryToken } = router.query;
  const token = queryToken || monetaCA;
  const [vaultEthBalance, setVaultEthBalance] = useState(0);
  const { loan, setLoan } = useLoan();
  const { address } = useAccount();

  // Get vault balance
  useEffect(() => {
    const getPrice = async () => {
      const balance = await getEthBalance(
        String(process.env.NEXT_PUBLIC_VAULT_ADDRESS)
      );
      setVaultEthBalance(roundToSixDecimals(balance));
    };

    const intervalId = setInterval(getPrice, 30 * 1e3);
    getPrice();
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (token) setLoan((prev) => ({ ...prev, collateralToken: String(token) }));
  }, [setLoan, token]);

  // ------------------------------ Get Token Price ------------------------------
  useEffect(() => {
    if (loan.collateralToken) {
      const getPrice = async () => {
        const tokenPrice = await apiFetcher<PriceApiResponse>(
          `/api/price?token=${loan.collateralToken}`
        );
        setTokenPrice(tokenPrice.data.data);
      };

      const intervalId = setInterval(getPrice, 30 * 1e3);
      getPrice();
      return () => clearInterval(intervalId);
    }
  }, [loan.collateralToken]);

  // ------------------------------ On change ------------------------------
  const onInputAmountChange = async (value: number) => {
    let outputAmount = value * (tokenPrice?.priceNative || 0) * loanPercentage;
    let inputAmount = value;

    if (outputAmount > vaultEthBalance) {
      outputAmount = vaultEthBalance;
      inputAmount = roundToSixDecimals(vaultEthBalance / (tokenPrice?.priceNative || 0) / loanPercentage); //prettier-ignore
    }

    setLoan((prev) => ({ ...prev, collateralAmount: inputAmount }));
    setLoan((prev) => ({ ...prev, ethLent: roundToSixDecimals(outputAmount) }));
  };

  const onOutputAmountChange = (value: number) => {
    let inputAmount = value / (tokenPrice?.priceNative || 0) / loanPercentage;
    let outputAmount = value;

    if (outputAmount > vaultEthBalance) {
      outputAmount = vaultEthBalance;
      inputAmount = roundToSixDecimals(vaultEthBalance / (tokenPrice?.priceNative || 0) / loanPercentage); //prettier-ignore
    }

    setLoan((prev) => ({ ...prev, ethLent: outputAmount }));
    setLoan((prev) => ({ ...prev, collateralAmount: roundToSixDecimals(inputAmount) })); //prettier-ignore
  };

  const ethInterest = roundToSixDecimals(
    (loan.duration / 100) * Number(loan.ethLent || 0)
  );
  const usdInterest = roundToSixDecimals(
    (loan.duration / 100) * Number(loan.ethLentUsd || 0)
  );

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="p-2 border-[1px] border-white/30 rounded-xl flex flex-col gap-1 w-[350px]">
        <h3>Vault holds {vaultEthBalance} ETH</h3>
        <TokenInput
          id="mortageAmount"
          label="Mortage"
          tokenAddress={loan.collateralToken}
          onChange={onInputAmountChange}
          value={loan.collateralAmount}
        />
        <TokenInput
          id="loanAmount"
          label="Loaned"
          tokenAddress={WETH}
          onChange={onOutputAmountChange}
          value={loan.ethLent}
        />
      </div>

      <div className="p-2 px-4 border-[1px] border-white/30 rounded-xl grid grid-cols-2 gap-1 w-[350px]">
        <span className="font-semibold">Your Wallet</span>{" "}
        <Link
          href={`https://etherscan.io/address/${address}`}
          className="ml-auto underline"
          target="_blank"
        >
          {shortenEthAddress(address || "")}
        </Link>
        {/*  */}
        <span className="font-semibold">Collateral Token</span>{" "}
        <Link
          href={`https://etherscan.io/token/${loan.collateralToken}`}
          className="ml-auto underline"
          target="_blank"
        >
          {shortenEthAddress(loan.collateralToken || "")}
        </Link>
        {/*  */}
        <span className="font-semibold whitespace-nowrap">
          Collateral Token Price
        </span>{" "}
        <span className="ml-auto">${tokenPrice?.priceUsd || 0}</span>
        {/*  */}
        <span className="font-semibold whitespace-nowrap">
          Collateral Amount
        </span>{" "}
        <span className="ml-auto">{loan.collateralAmount || 0}</span>
        {/*  */}
        <span className="font-semibold whitespace-nowrap">
          Collateral Tokens Value
        </span>{" "}
        <span className="ml-auto">${loan.collateralUsdValueAtLoan || 0}</span>
        {/*  */}
        <span className="font-semibold whitespace-nowrap">
          Loan Value in ETH
        </span>{" "}
        <span className="ml-auto">{loan.ethLent || 0} ETH</span>
        {/*  */}
        <span className="font-semibold whitespace-nowrap">
          Interest ETH
        </span>{" "}
        <span className="ml-auto">{ethInterest} ETH</span>
        {/*  */}
        <span className="font-semibold whitespace-nowrap">
          Interest USD
        </span>{" "}
        <span className="ml-auto">${usdInterest}</span>
      </div>
    </div>
  );
}
