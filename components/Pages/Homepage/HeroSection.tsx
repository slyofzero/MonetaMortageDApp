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
    <div className="flex items-center justify-center gap-8 flex-grow text-2xl font-bold">
      {buttons.map(({ link, text }, key) => (
        <Link
          className="p-4 rounded-lg bg-white text-black text-center w-64"
          key={key}
          href={link}
        >
          {text}
        </Link>
      ))}
    </div>
  );
}
