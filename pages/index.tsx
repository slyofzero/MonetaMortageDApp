import { HeroSection, MainLayout } from "@/components";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Ethereum Mortgaging</title>
      </Head>

      <MainLayout>
        <HeroSection />
      </MainLayout>
    </>
  );
}
