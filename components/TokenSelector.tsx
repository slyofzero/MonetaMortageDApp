import { TokenInfo } from "@/types/tokenInfo";
import { Chevron } from "./Chevron";
import { Dispatch, SetStateAction } from "react";

interface Props {
  token: TokenInfo | undefined;
  setShowTokensList: Dispatch<SetStateAction<boolean>>;
  setSelectedToken: Dispatch<SetStateAction<"1" | "2">>;
  id: "1" | "2";
}

export function TokenSelector({
  token,
  setShowTokensList,
  setSelectedToken,
  id,
}: Props) {
  const { symbol, logoURI } = token || {};
  return (
    <button
      onClick={() => {
        setShowTokensList((prev) => !prev);
        setSelectedToken(id);
      }}
      className="absolute top-1/2 right-4 -translate-y-1/2 flex gap-2 items-center bg-stone-800 rounded-full p-2"
    >
      {/* eslint-disable-next-line */}
      <img
        src={logoURI || ""}
        height={200}
        width={200}
        alt={symbol || ""}
        className="h-8 w-8 rounded-full"
      />{" "}
      {symbol}
      <Chevron />
    </button>
  );
}
