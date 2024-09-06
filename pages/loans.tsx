import { MainLayout, Loans } from "@/components";
import { WalletConnect } from "@/components/WalletConnect";
import Head from "next/head";

export default function LoansPage() {
  return (
    <>
      <Head>
        <title>Your loans</title>
      </Head>

      <MainLayout>
        <WalletConnect
          text="Please connect your wallet you view your loans"
          otherComp={<Loans />}
        />
      </MainLayout>
    </>
  );
}
