import { Link } from "./Common";
import { FaGlobe } from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export function Socials() {
  return (
    <div className="flex gap-8">
      <Link
        target="_blank"
        className="flex items-center gap-1"
        href={"https://monetafi.io/"}
      >
        <FaGlobe /> Website
      </Link>
      <Link
        target="_blank"
        className="flex items-center gap-1"
        href={"https://t.me/moneta_portal"}
      >
        <FaTelegramPlane /> Telegram
      </Link>
      <Link
        target="_blank"
        className="flex items-center gap-1"
        href={"https://twitter.com/moneta_fi"}
      >
        <FaXTwitter />
        Twitter
      </Link>
    </div>
  );
}
