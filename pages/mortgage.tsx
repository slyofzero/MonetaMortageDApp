import { MainLayout, Mortgage } from "@/components";
import Head from "next/head";

export default function MortgagePage() {
  return (
    <>
      <Head>
        <title>Mortgage $MNTA</title>
      </Head>

      <MainLayout>
        <Mortgage />
      </MainLayout>
    </>
  );
}
