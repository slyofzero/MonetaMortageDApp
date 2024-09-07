import { Link } from "@/components/Common";
import { monetaCA } from "@/utils/constants";

interface ButtonData {
  text: string;
  link: string;
}

const buttons: ButtonData[] = [
  { link: `/mortage?token=${monetaCA}`, text: "Mortgage $MNTA" },
  { link: "#", text: "Mortgage Non tax tokens" },
  { link: "#", text: "Mortgage Tax tokens (upto 6%)" },
  { link: "#", text: "Custom Mortgage Request" },
];

export function HeroSection() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 mx-auto gap-8 items-center justify-center my-auto lg:text-2xl font-bold">
      {buttons.map(({ link, text }, key) => (
        <Link
          className="p-4 rounded-lg bg-white text-black text-center w-fit h-full flex items-center justify-center lg:w-64"
          key={key}
          href={link}
        >
          {text}
        </Link>
      ))}
    </div>
  );
}
