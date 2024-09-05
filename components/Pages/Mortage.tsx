import { useAccount } from "wagmi";
import { DurationSlider } from "../DurationSlider";
import { Swap } from "../Swap";
import { ShowWhen } from "../Utils";
import { ConnectButton } from "../blockchain";

export function Mortage() {
  const { isConnected } = useAccount();

  const submitButton = (
    <button className="bg-white text-black font-semibold px-4 py-2 rounded-lg">
      Complete loan
    </button>
  );

  return (
    <div className="flex-grow flex flex-col gap-8 items-center justify-center">
      <Swap />
      <DurationSlider />

      <ShowWhen
        component={submitButton}
        when={isConnected}
        otherwise={<ConnectButton />}
      />
    </div>
  );
}
