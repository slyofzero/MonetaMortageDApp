import { getDocumentById } from "@/firebase";
import { provider } from "@/rpc";
import { StoredLoan } from "@/types";
import { VAULT_PRIVATE_KEY } from "@/utils/env";
import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";
import { erc20Abi } from "viem";

export interface FEStoredLoan
  extends Omit<StoredLoan, "loanDueAt" | "loanActiveAt"> {
  loanDueAt: { _seconds: number; _nanoseconds: number };
  loanActiveAt: { _seconds: number; _nanoseconds: number };
}

export interface ReleastCollateralsApiResponse {
  message: string;
  txn?: string;
}

export default async function releaseCollateralTokens(
  req: NextApiRequest,
  res: NextApiResponse<ReleastCollateralsApiResponse>
) {
  const method = req.method;

  if (method === "GET") {
    try {
      const { loan: loanId } = req.query;

      // Validate required parameters
      if (!loanId) {
        return res.status(400).json({
          message: "Missing required query parameters: loan",
        });
      }

      const loan = await getDocumentById<StoredLoan>({
        collectionName: "mortages",
        id: String(loanId),
      });

      if (!loan) {
        return res.status(404).json({
          message: `Couldn't find a loan for ID ${loanId}`,
        });
      }

      const { user, collateralAmount, collateralToken } = loan;

      const wallet = new ethers.Wallet(VAULT_PRIVATE_KEY, provider);

      const tokenContract = new ethers.Contract(
        collateralToken,
        erc20Abi,
        wallet
      );
      const amount = BigInt(collateralAmount * 1e18);
      const tx = await tokenContract.transfer(user, amount);

      return res
        .status(200)
        .json({ message: "Fetched user loans", txn: tx.hash });
    } catch (error) {
      // eslint-disable-next-line
      console.error("Error fetching price data from Dex:", error);
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
