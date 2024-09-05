import { PairsData, TokenInfo } from "@/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Cross } from "./Cross";
import { apiFetcher } from "@/utils/api";

interface Props {
  tokensList: TokenInfo[];
  setShowTokensList: Dispatch<SetStateAction<boolean>>;
  selectedToken: "1" | "2";
  setToken1: Dispatch<SetStateAction<TokenInfo | undefined>>;
  setToken2: Dispatch<SetStateAction<TokenInfo | undefined>>;
}

export function Tokenslist({
  tokensList,
  setShowTokensList,
  selectedToken,
  setToken1,
  setToken2,
}: Props) {
  const [tokenResults, setTokenResults] = useState<TokenInfo[]>([]);
  const [searchedToken, setSearchToken] = useState("");

  useEffect(() => {
    const searchResults = tokensList.filter(({ name, address }) =>
      searchedToken
        ? name.toLowerCase().includes(searchedToken.toLowerCase()) ||
          address.toLowerCase().includes(searchedToken.toLowerCase())
        : true
    );

    setTokenResults(searchResults);
  }, [searchedToken, tokensList]);

  useEffect(() => {
    const getTokenData = async () => {
      try {
        const data = (
          await apiFetcher(
            `https://api.dexscreener.com/latest/dex/tokens/${searchedToken}`
          )
        ).data as PairsData;

        if (data) {
          const firstPair = data.pairs.at(0);

          if (firstPair) {
            const { baseToken } = firstPair;
            const { name, symbol } = baseToken;
            const logoURI = `https://placehold.co/400x400?text=${symbol}`;
            const decimals = 18;

            const tokenResult: TokenInfo = {
              address: searchedToken,
              chainId: 1,
              decimals,
              logoURI,
              name,
              symbol: symbol.toUpperCase(),
            };

            setTokenResults([tokenResult]);
          }
        }
      } catch (e) {
        const error = e as Error;
        console.log(error.message);
      }
    };

    const ethereumAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
    const isToken = ethereumAddressRegex.test(searchedToken);

    if (tokenResults.length === 0 && isToken) getTokenData();
  }, [tokenResults, searchedToken]);

  const closeList = () => setShowTokensList((prev) => !prev);

  const selectToken = (token: TokenInfo) => {
    if (selectedToken === "1") setToken1(token);
    else setToken2(token);
    closeList();
  };

  return (
    <div className="fixed h-full w-full bg-stone-900/70 backdrop-blur-md border-solid border-2 border-slate-950 rounded-lg flex items-center justify-center z-30">
      <div className="bg-stone-800 flex flex-col gap-2 p-4 h-[90%]">
        <div className="flex justify-between w-full rounded-lg">
          <h2>Select a token</h2>{" "}
          <button onClick={() => closeList()}>
            <Cross />
          </button>
        </div>

        <input
          type="text"
          className="border-[1px] border-solid border-white/50 bg-stone-900 outline-none py-2 px-4 rounded-md"
          placeholder="Search name or paste address"
          onChange={(e) => {
            setSearchToken(e.target.value);
          }}
        />

        <div className="flex flex-col overflow-y-auto w-96">
          {tokenResults.length ? (
            tokenResults.map((token, key) => {
              const { name, symbol, logoURI } = token;

              return (
                <div
                  className="flex gap-4 py-4 items-center hover:bg-stone-900 cursor-pointer px-4"
                  key={key}
                  onClick={() => selectToken(token)}
                >
                  {/* eslint-disable-next-line */}
                  <img
                    src={logoURI || ""}
                    height={200}
                    width={200}
                    alt={symbol || ""}
                    className="h-10 w-10 rounded-full"
                  />

                  <div className="flex flex-col">
                    <h2 className="text-lg">{name}</h2>
                    <h3 className="text-sm">{symbol}</h3>
                  </div>
                </div>
              );
            })
          ) : (
            <h3 className="text-center">No tokens found</h3>
          )}
        </div>
      </div>
    </div>
  );
}
