import React from "react";
import { ConnectButton } from "../blockchain/ConnectButton";
import { Image, Link } from "../Common";
import { classNames } from "@/utils";
import { saira } from "@/pages/_app";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function MainLayout({ children, className }: Props) {
  return (
    <main
      className={classNames(
        "min-h-screen w-screen px-4 lg:px-16 flex flex-col bg-black",
        saira.className,
        className || ""
      )}
    >
      <header className="flex justify-between pt-8">
        <Link href={"/"}>
          <Image src={"/banner.png"} alt="banner" className="w-32 lg:w-48" />
        </Link>

        <div className="flex flex-col lg:flex-row items-center gap-4">
          <ConnectButton />
        </div>
      </header>

      {children}
    </main>
  );
}
