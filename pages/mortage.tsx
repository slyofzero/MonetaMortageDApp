import { MainLayout, Mortage } from "@/components";
import Head from "next/head";

export default function MortagePage() {
  return (
    <>
      <Head>
        <title>Mortage $MNTA</title>
      </Head>

      <MainLayout>
        <Mortage />
      </MainLayout>
    </>
  );
}
