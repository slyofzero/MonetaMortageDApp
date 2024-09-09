import { getDocumentById } from "@/firebase";
import { provider, web3 } from "@/rpc";
import { StoredLoan } from "@/types";
import { pastDuePenalty } from "@/utils/constants";
import { VAULT_PRIVATE_KEY } from "@/utils/env";
import { roundToSixDecimals } from "@/utils/web3";
import { ethers } from "ethers";
import moment from "moment";
import type { NextApiRequest, NextApiResponse } from "next";

export interface RefundApiRequestBody {
  id: string;
  ethReceived: number;
}

export interface RefundApiResponse {
  message: string;
  txn?: string;
}

export default async function refundLiquidation(
  req: NextApiRequest,
  res: NextApiResponse<RefundApiResponse>
) {
  const method = req.method;

  if (method === "POST") {
    try {
      if (!req.body)
        return res.status(400).json({ message: "Request body is missing" });

      const { id, ethReceived } = JSON.parse(req.body) as RefundApiRequestBody;
      const loan = await getDocumentById<StoredLoan>({
        collectionName: "mortages",
        id,
      });

      if (!loan)
        return res.status(404).json({ message: `No loan for ID ${id} found` });
      if (loan.repaymentStatus === "LIQUIDATED")
        return res
          .status(403)
          .json({ message: "Liquidated ETH has already been refuned" });

      const { ethLent, duration, loanActiveAt, user: address } = loan;
      const currentTime = moment();
      const loanActiveTimestamp = moment.unix(loanActiveAt?.seconds || 0);
      const daysSinceLoan = currentTime.diff(loanActiveTimestamp, "days");
      const applyPenalty = daysSinceLoan > duration;
      const interest = applyPenalty
        ? daysSinceLoan + pastDuePenalty
        : daysSinceLoan;
      const totalToRepay = roundToSixDecimals(ethLent * (1 + interest / 100));
      const toRefund = roundToSixDecimals(ethReceived - totalToRepay);

      const wallet = new ethers.Wallet(VAULT_PRIVATE_KEY, provider);
      const gasPrice = await web3.eth.getGasPrice();
      const amount = ethers.parseEther(String(toRefund));
      const gasLimit = 21000n;
      const valueAfterGas = amount - gasPrice * gasLimit;

      const tx = await wallet.sendTransaction({
        to: address,
        value: valueAfterGas,
        gasPrice: gasPrice,
        gasLimit: gasLimit,
      });

      return res
        .status(200)
        .json({ message: "New Mortgage Request Created", txn: tx.hash });
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
