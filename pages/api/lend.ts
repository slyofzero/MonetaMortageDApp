import { provider, web3 } from "@/rpc";
import { VAULT_PRIVATE_KEY } from "@/utils/env";
import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";

export interface LendApiRequestBody {
  address: string;
  ethLent: number;
}

export interface LendApiResponse {
  message: string;
  txn?: string;
}

export default async function lendUserEth(
  req: NextApiRequest,
  res: NextApiResponse<LendApiResponse>
) {
  const method = req.method;

  if (method === "POST") {
    try {
      if (!req.body)
        return res.status(400).json({ message: "Request body is missing" });

      const { address, ethLent } = JSON.parse(req.body) as LendApiRequestBody;

      const wallet = new ethers.Wallet(VAULT_PRIVATE_KEY, provider);
      const gasPrice = await web3.eth.getGasPrice();
      const gasLimit = 21000;
      const amount = Number(web3.utils.toWei(ethLent, "ether"));
      const valueAfterGas = amount - gasLimit * Number(gasPrice);

      const tx = await wallet.sendTransaction({
        to: address,
        value: valueAfterGas,
        gasPrice: gasPrice,
        gasLimit: gasLimit,
      });

      return res
        .status(200)
        .json({ message: "New Mortage Request Created", txn: tx.hash });
    } catch (error) {
      // eslint-disable-next-line
      console.error("Error when lending ETH:", error);
      return res.status(500).json({
        message: (error as Error).message || "An unexpected error occurred",
      });
    }
  } else {
    return res.status(405).json({
      message: "API method not allowed",
    });
  }
}
