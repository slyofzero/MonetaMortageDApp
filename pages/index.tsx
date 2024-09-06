import { HeroSection, MainLayout } from "@/components";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Ethereum Mortgaging</title>
      </Head>

      <MainLayout>
        <button className="p-4 bg-white text-black rounded-lg">Transfer</button>
        <HeroSection />
      </MainLayout>
    </>
  );
}
