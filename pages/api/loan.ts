import { addDocument, updateDocumentById } from "@/firebase";
import { LoanFromState } from "@/state";
import { StoredLoan } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { nanoid } from "nanoid";

export interface LoanApiRequestBody extends LoanFromState {
  user: string;
}

export interface LoanApiResponse {
  message: string;
  id?: string;
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
      const id = nanoid(10);
      const parsedBody: StoredLoan = {
        ...body,
        collateralAmount: Number(body.collateralAmount),
        collateralUsdPriceAtLoan: Number(body.collateralUsdPriceAtLoan),
        collateralUsdValueAtLoan: Number(body.collateralUsdValueAtLoan),
        ethLent: Number(body.ethLent),
        ethLentUsd: Number(body.ethLentUsd),
        status: "PENDING",
        id,
      };

      await addDocument<StoredLoan>({
        collectionName: "mortages",
        data: parsedBody,
        id,
      });

      return res
        .status(200)
        .json({ message: "New Mortage Request Created", id });
    } catch (error) {
      // eslint-disable-next-line
      console.error("Error when creating a mortage document:", error);
      return res.status(500).json({
        message: (error as Error).message || "An unexpected error occurred",
      });
    }
  } else if (method === "PUT") {
    if (!req.body)
      return res.status(400).json({ message: "Request body is missing" });

    const body: Partial<StoredLoan> = JSON.parse(req.body);
    const { id, ...updates } = body;

    if (!id) return res.status(400).json({ message: "Mortage ID is missing" });

    await updateDocumentById<StoredLoan>({
      collectionName: "mortages",
      id: id,
      updates,
    });
    return res.status(200).json({ message: `Mortage ID ${id} updated` });
  } else {
    return res.status(405).json({
      message: "API method not allowed",
    });
  }
}
