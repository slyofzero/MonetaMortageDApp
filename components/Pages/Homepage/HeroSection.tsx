import { Link } from "@/components/Common";
import { Socials } from "@/components/Socials";
import { HTMLAttributeAnchorTarget } from "react";

export interface ButtonData {
  text: string;
  link: string;
  target?: HTMLAttributeAnchorTarget;
}

const buttons: ButtonData[] = [
  {
    link: "https://monetafi.gitbook.io/moneta-wp",
    text: "Docs",
    target: "_blank",
  },
  { link: "/mortgage", text: "Apply" },
  { link: "/collateralTokens", text: "List of tokens" },
];

export function HeroSection() {
  return (
    <div className="flex flex-col gap-8 items-center justify-center flex-grow w-fit mx-auto">
      <div className="flex flex-col gap-4 text-center bg-white text-black py-6 px-4 lg:px-16 rounded-lg">
        <h3 className="text-2xl font-semibold">Mortgage Tokens and Loan ETH</h3>
        <h3>Mortgage prelisted tokens</h3>

        <div className="mt-8 flex lg:flex-row justify-between gap-4 flex-wrap">
          {buttons.map(({ link, text, target }, key) => (
            <Link
              key={key}
              className="bg-black text-white p-2 rounded-lg w-32 mx-auto"
              href={link}
              target={target || "_self"}
            >
              {text}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4 flex-wrap justify-between w-full font-semibold text-center">
        <div className="bg-white text-black px-4 py-2 w-44">Coming Soon...</div>
        <div className="bg-white text-black px-4 py-2 w-44">Coming Soon...</div>
        <div className="bg-white text-black px-4 py-2 w-44">Coming Soon...</div>
      </div>

      <Socials />
    </div>
  );
}
