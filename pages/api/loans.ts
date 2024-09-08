import { getDocument } from "@/firebase";
import { StoredLoan } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";

export interface FEStoredLoan
  extends Omit<
    StoredLoan,
    | "loanDueAt"
    | "loanActiveAt"
    | "loanRepaidAt"
    | "autoSoldAt"
    | "liquidatedAt"
  > {
  loanDueAt: { _seconds: number; _nanoseconds: number };
  loanActiveAt: { _seconds: number; _nanoseconds: number };
  loanRepaidAt: { _seconds: number; _nanoseconds: number };
  autoSoldAt: { _seconds: number; _nanoseconds: number };
  liquidatedAt: { _seconds: number; _nanoseconds: number };
}

export interface LoansApiResponse {
  message: string;
  loans?: FEStoredLoan[];
}

export default async function getUserLoans(
  req: NextApiRequest,
  res: NextApiResponse<LoansApiResponse>
) {
  const method = req.method;

  if (method === "GET") {
    try {
      const { user } = req.query;

      // Validate required parameters
      if (!user) {
        return res.status(400).json({
          message: "Missing required query parameters: user",
        });
      }

      const loans = (await getDocument<StoredLoan>({
        collectionName: "mortages",
        queries: [
          ["user", "==", user],
          ["status", "==", "PAID"],
        ],
      })) as unknown as FEStoredLoan[];

      return res.status(200).json({ message: "Fetched user loans", loans });
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
