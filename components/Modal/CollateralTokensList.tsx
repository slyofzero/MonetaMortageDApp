import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { Modal } from ".";
import { collateralTokensList, ICollateralTokensList } from "@/utils/constants";
import { Image } from "../Common";
import { useLoan } from "@/state";
import { IoSearchOutline } from "react-icons/io5";
import { isValidEthAddress } from "@/utils/web3";

interface Props {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

interface CollateralTokenProps {
  token: string;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

function CollateralToken({ token, setShowModal }: CollateralTokenProps) {
  const { name, symbol, logoURI } = collateralTokensList[token];
  const { setLoan } = useLoan();
  const selectToken = () => {
    setLoan((prev) => ({ ...prev, collateralToken: token }));
    setShowModal(false);
  };

  return (
    <div
      onClick={selectToken}
      className="flex items-center gap-4 justify-between py-4 px-8 hover:bg-gray-800 cursor-pointer rounded-full transition-all"
    >
      <Image
        className="w-12 aspect-square rounded-full col-span-1"
        src={logoURI}
        alt={symbol}
      />

      <div className="flex flex-col text-right col-span-[1/2]">
        <span className="font-bold text-lg">{symbol}</span>
        <span>{name}</span>
      </div>
    </div>
  );
}

export function CollateralTokensList({ setShowModal }: Props) {
  const [searchedToken, setSearchedToken] =
    useState<ICollateralTokensList>(collateralTokensList);

  const searchToken = (e: ChangeEvent<HTMLInputElement>) => {
    const token = e.target.value;
    if (isValidEthAddress(token)) {
      const tokenData = collateralTokensList[token];
      if (tokenData) setSearchedToken({ [token]: tokenData });
      else setSearchedToken({});
    } else {
      setSearchedToken(collateralTokensList);
    }
  };

  const collateralTokens = Object.keys(searchedToken);

  return (
    <Modal size="sm" setShowModal={setShowModal}>
      <div className="flex flex-col gap-4 overflow-auto [&>div]:px-4 h-full">
        <div className="flex justify-center items-center">
          <input
            type="text"
            placeholder="Enter token address"
            onChange={searchToken}
            className="border-[1px] border-solid border-white rounded-l-lg bg-black outline-none p-4 py-2 flex-grow"
          />
          <button className="bg-white text-black px-2 h-[42px] rounded-r-lg">
            <IoSearchOutline className="text-2xl font-bold w-fit" />
          </button>
        </div>

        <div className="flex flex-col gap-4 overflow-auto h-full">
          {collateralTokens.length > 0 ? (
            collateralTokens.map((token, key) => {
              return (
                <CollateralToken
                  setShowModal={setShowModal}
                  token={token}
                  key={key}
                />
              );
            })
          ) : (
            <div className="flex items-center justify-center text-center text-xl h-full">
              The token you searched for isn&apos;t available as collateral
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
