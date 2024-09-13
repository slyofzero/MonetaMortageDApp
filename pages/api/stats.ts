import { apiFetcher } from "@/utils/api";
import { SCRIPT_URL } from "@/utils/env";
import type { NextApiRequest, NextApiResponse } from "next";

export interface VaultStatsScriptApiResponse {
  interestEarned: number;
  vaultEth: number;
  loanCount: number;
  loanValue: number;
  tokensValue: number;
}

export interface VaultStatsApiResponse {
  message: string;
  data?: VaultStatsScriptApiResponse;
}

export default async function getUserLoans(
  req: NextApiRequest,
  res: NextApiResponse<VaultStatsApiResponse>
) {
  const method = req.method;

  if (method === "GET") {
    try {
      const { response, data } = await apiFetcher<VaultStatsScriptApiResponse>(
        `${SCRIPT_URL}/stats`
      );

      return res.status(response).json({ message: `Vault stats`, data });
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
