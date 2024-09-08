import { apiPoster } from "@/utils/api";
import { SCRIPT_URL } from "@/utils/env";
import type { NextApiRequest, NextApiResponse } from "next";

export interface LiquidateApiRequestBody {
  loanId: string;
}

interface ScriptLiquidateApiResponse {
  txn: string;
}

export interface LiquidateApiResponse {
  message: string;
  txn?: string;
}

export default async function liquidateCollateral(
  req: NextApiRequest,
  res: NextApiResponse<LiquidateApiResponse>
) {
  const method = req.method;

  if (method === "POST") {
    try {
      if (!req.body)
        return res.status(400).json({ message: "Request body is missing" });

      const { loanId } = JSON.parse(req.body) as LiquidateApiRequestBody;

      if (!loanId)
        return res
          .status(400)
          .json({ message: "Request body is missing the loan ID" });

      const response = await apiPoster<ScriptLiquidateApiResponse>(
        `${SCRIPT_URL}/liquidate`,
        { loanId },
        // @ts-ignore
        { "Content-Type": "application/json" }
      );
      const txn = response.data.txn;

      return res
        .status(200)
        .json({ message: `Sold collateral for loan ID ${loanId}`, txn });
    } catch (error) {
      // eslint-disable-next-line
      console.error("Error when creating a mortage document:", error);
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
