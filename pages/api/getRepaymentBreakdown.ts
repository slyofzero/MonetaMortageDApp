import { getDocumentById } from "@/firebase";
import { StoredLoan } from "@/types";
import { monetaCA, pastDuePenalty, platformCharge } from "@/utils/constants";
import { getTokenBalance, roundToSixDecimals } from "@/utils/web3";
import moment from "moment";
import type { NextApiRequest, NextApiResponse } from "next";

export interface RepaymentBreakdown {
  daysSinceLoan: number;
  interest: number;
  penalty: boolean;
  totalToRepay: number;
  repaymentUnder24h: boolean;
  isMntaHolder: boolean;
  interestDiscount: number;
}

export interface RepaymentBreakdownApiResponse {
  message: string;
  breakdown?: RepaymentBreakdown;
}

export default async function releaseCollateralTokens(
  req: NextApiRequest,
  res: NextApiResponse<RepaymentBreakdownApiResponse>
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

      const { loanActiveAt, duration, ethLent, user } = loan;
      const currentTime = moment();
      const loanActiveTimestamp = moment.unix(loanActiveAt?.seconds || 0);
      const daysSinceLoan = currentTime.diff(loanActiveTimestamp, "days");
      const applyPenalty = daysSinceLoan > duration;

      const isMntaHolder = (await getTokenBalance(user, monetaCA)) > 0;
      let interest = applyPenalty
        ? daysSinceLoan + pastDuePenalty
        : daysSinceLoan;
      let interestDiscount = 1;

      if (isMntaHolder) {
        interest /= 2;
        interestDiscount = 0.5;
      }

      // Platform charge
      const repaymentUnder24h = daysSinceLoan === 0;
      const loanPlatformCharge = repaymentUnder24h ? platformCharge : 0;

      const totalToRepay = roundToSixDecimals(
        ethLent * (1 + interest / 100) + loanPlatformCharge
      );

      const breakdown: RepaymentBreakdown = {
        daysSinceLoan,
        interest,
        penalty: applyPenalty,
        totalToRepay,
        repaymentUnder24h: daysSinceLoan === 0,
        isMntaHolder,
        interestDiscount,
      };

      return res.status(200).json({ message: "Fetched user loans", breakdown });
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
