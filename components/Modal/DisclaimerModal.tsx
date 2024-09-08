import { Dispatch } from "react";
import { Modal } from ".";
import { SetStateAction } from "jotai";

// Payment Modal
interface Props {
  setShowDisclaimer: Dispatch<SetStateAction<boolean>>;
  text: string[];
  onAccept: () => void;
  btnText: string;
}

export function DisclaimerModal({
  setShowDisclaimer,
  onAccept,
  text,
  btnText,
}: Props) {
  return (
    <Modal size="lg" setShowModal={setShowDisclaimer}>
      <div className="flex flex-col gap-8 px-8">
        <h1 className="text-4xl font-bold text-center">Disclaimer</h1>

        <ol className="flex flex-col gap-4">
          {text.map((txt, key) => (
            <li key={key}>{txt}</li>
          ))}
        </ol>

        <button
          onClick={onAccept}
          className="bg-white px-4 py-2 text-black font-bold rounded-lg"
        >
          {btnText}
        </button>
      </div>
    </Modal>
  );
}
