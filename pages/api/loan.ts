import { addDocument } from "@/firebase";
import { LoanFromState } from "@/state";
import { StoredLoan } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";

export interface LoanApiRequestBody extends LoanFromState {
  user: string;
}

export interface LoanApiResponse {
  message: string;
}

export default async function getSwapQuote(
  req: NextApiRequest,
  res: NextApiResponse<LoanApiResponse>
) {
  const method = req.method;

  if (method === "POST") {
    try {
      if (!req.body)
        return res.status(400).json({ message: "Request body is missing" });

      const body: LoanApiRequestBody = JSON.parse(req.body);
      const parsedBody: StoredLoan = {
        ...body,
        collateralAmount: Number(body.collateralAmount),
        collateralUsdPriceAtLoan: Number(body.collateralUsdPriceAtLoan),
        collateralUsdValueAtLoan: Number(body.collateralUsdValueAtLoan),
        ethLent: Number(body.ethLent),
        ethLentUsd: Number(body.ethLentUsd),
        status: "PENDING",
      };

      await addDocument<StoredLoan>({
        collectionName: "mortages",
        data: parsedBody,
      });

      return res.status(200).json({ message: "New Mortage Request Created" });
    } catch (error) {
      // eslint-disable-next-line
      console.error("Error fetching swap quote from ParaSwap:", error);
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
