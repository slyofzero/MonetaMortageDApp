import { MainLayout, Mortage } from "@/components";
import { WalletConnect } from "@/components/WalletConnect";
import Head from "next/head";

export default function MortagePage() {
  return (
    <>
      <Head>
        <title>Mortage $MNTA</title>
      </Head>

      <MainLayout>
        {/* <WalletConnect
          otherComp={<Mortage />}
          text="Please connect your wallet to view this page."
        /> */}
        <Mortage />
      </MainLayout>
    </>
  );
}
