import {
  VaultStatsApiResponse,
  VaultStatsScriptApiResponse,
} from "./api/stats";
import { MainLayout } from "@/components";
import { useApi } from "@/hooks/useApi";
import { apiFetcher } from "@/utils/api";
import { roundToSixDecimals } from "@/utils/web3";
import { GetStaticProps } from "next";

interface Props {
  fallbackData: VaultStatsApiResponse;
}

export default function StatsPage({ fallbackData }: Props) {
  const { data } = useApi<VaultStatsApiResponse>("/api/stats");

  const stats = data?.data || fallbackData;

  //   const { data: stats } = data as VaultStatsApiResponse;
  const { vaultEth, interestEarned, loanValue, loanCount, tokensValue } =
    stats as VaultStatsScriptApiResponse;

  const rowClassName =
    "flex items-center justify-between gap-4 w-72 lg:w-[700px]";

  return (
    <MainLayout>
      <div className="flex flex-col flex-grow gap-8 justify-center items-center">
        <div className={rowClassName}>
          <span className="text-lg lg:text-2xl font-bold">
            Total Capital Value -
          </span>
          <span className="text-lg">
            {roundToSixDecimals(vaultEth + tokensValue)} ETH
          </span>
        </div>

        <div className={rowClassName}>
          <span className="text-lg lg:text-2xl font-bold">
            Total ETH Value -
          </span>
          <span className="lg:text-lg">{roundToSixDecimals(vaultEth)} ETH</span>
        </div>

        <div className={rowClassName}>
          <span className="text-lg lg:text-2xl font-bold">
            Total Tokens Value -
          </span>
          <span className="lg:text-lg">
            {roundToSixDecimals(tokensValue)} ETH
          </span>
        </div>

        <div className={rowClassName}>
          <span className="text-lg lg:text-2xl font-bold">
            Total Loans Financed -
          </span>
          <span className="lg:text-lg">{loanCount.toLocaleString()}</span>
        </div>

        <div className={rowClassName}>
          <span className="text-lg lg:text-2xl font-bold">
            Total ETH Lent -
          </span>
          <span className="lg:text-lg">{loanValue.toLocaleString()} ETH</span>
        </div>

        <div className={rowClassName}>
          <span className="text-lg lg:text-2xl font-bold">
            Interest earned -
          </span>
          <span className="lg:text-lg">
            {roundToSixDecimals(interestEarned).toLocaleString()} ETH
          </span>
        </div>

        <div className={rowClassName}>
          <span className="text-lg lg:text-2xl font-bold">
            Avg. Interest earned / week -
          </span>
          <span className="lg:text-lg">
            {roundToSixDecimals(interestEarned / 7)} ETH
          </span>
        </div>
      </div>
    </MainLayout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await apiFetcher<VaultStatsApiResponse>(
    `http://localhost:3000/api/stats`
  );

  return {
    props: {
      fallbackData: data.data,
    },
    revalidate: 10, // Optional: Revalidate every 10 seconds for ISR
  };
};
