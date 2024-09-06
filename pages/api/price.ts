import { PairData, PairsData } from "@/types";
import { apiFetcher } from "@/utils/api";
import { USDT, WETH } from "@/utils/constants";
import type { NextApiRequest, NextApiResponse } from "next";

interface PriceData {
  priceNative: number;
  priceUsd: number;
}

export interface PriceApiResponse {
  message: string;
  data?: PriceData;
}

export default async function getSwapQuote(
  req: NextApiRequest,
  res: NextApiResponse<PriceApiResponse>
) {
  const { token } = req.query;

  // Validate required parameters
  if (!token) {
    return res.status(400).json({
      message: "Missing required query parameters: token",
    });
  }

  const url = `https://api.dexscreener.com/latest/dex/tokens/${token}`;

  try {
    const response = await apiFetcher<PairsData>(url);
    const data = response.data;

    let pair: PairData | undefined = undefined;
    if (token === WETH) {
      pair = data.pairs.find(({ quoteToken }) => quoteToken.address === USDT);
    } else {
      pair = data.pairs.find(({ quoteToken }) => quoteToken.address === WETH);
    }

    const returnValue: PriceData = {
      priceNative: Number(pair?.priceNative || 0),
      priceUsd: Number(pair?.priceUsd || 0),
    };

    const responseData: PriceApiResponse = {
      message: "Price Data",
      data: returnValue,
    };

    return res.status(200).json(responseData);
  } catch (error) {
    // eslint-disable-next-line
    console.error("Error fetching price data from Dex:", error);
    return res.status(500).json({
      message: (error as Error).message || "An unexpected error occurred",
    });
  }
}
