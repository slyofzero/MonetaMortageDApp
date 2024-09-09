import { Image, MainLayout } from "@/components";
import Head from "next/head";

export default function CollateralTokensPage() {
  return (
    <>
      <Head>
        <title>List of tokens</title>
      </Head>

      <MainLayout>
        <div className="flex flex-col flex-grow items-center justify-center gap-16">
          <h1 className="text-3xl font-bold capitalize">List of tokens</h1>

          <Image src={"/listoftokens.jpg"} alt="list of tokens" />
        </div>
      </MainLayout>
    </>
  );
}
