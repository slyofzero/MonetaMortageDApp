import { useLoan } from "@/state";
import { collateralTokensList } from "@/utils/constants";
import { Image } from "./Common";
import { classNames } from "@/utils";
import { IoSearchOutline } from "react-icons/io5";
import { CollateralTokensList } from "./Modal/CollateralTokensList";
import { useState } from "react";
import { ShowWhen } from "./Utils";

interface TokenButtonProps {
  token: string;
}

function TokenButton({ token }: TokenButtonProps) {
  const { loan, setLoan } = useLoan();
  const { collateralToken } = loan;
  const { logoURI, symbol } = collateralTokensList[token];
  const isTokenSelected = token === collateralToken;

  return (
    <button
      onClick={() => setLoan((prev) => ({ ...prev, collateralToken: token }))}
      className={classNames(
        "flex items-center p-2 py-1 gap-1 transition-all duration-300 border-[1px] border-solid",
        isTokenSelected
          ? "bg-white text-black"
          : "border-white text-white bg-black"
      )}
    >
      <Image
        className="w-8 aspect-square rounded-full"
        src={logoURI}
        alt={symbol}
      />{" "}
      <span className="font-semibold">{symbol}</span>
    </button>
  );
}

export function TokenSelector() {
  const [showTokenslist, setShowTokensList] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1 max-w-[500px] flex-wrap justify-center">
        {Object.keys(collateralTokensList)
          .slice(0, 12)
          .map((token, key) => (
            <TokenButton token={token} key={key} />
          ))}
      </div>

      <div
        onClick={() => setShowTokensList(true)}
        className="flex justify-center items-center"
      >
        <input
          type="text"
          className="border-[1px] border-solid border-white rounded-l-lg bg-black outline-none p-4 py-2 flex-grow"
        />
        <button className="bg-white text-black px-2 h-[42px] rounded-r-lg">
          <IoSearchOutline className="text-2xl font-bold w-fit" />
        </button>
      </div>

      <ShowWhen
        component={<CollateralTokensList setShowModal={setShowTokensList} />}
        when={showTokenslist}
      />
    </div>
  );
}
