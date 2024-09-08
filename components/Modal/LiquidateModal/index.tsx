import { Dispatch } from "react";
import { SetStateAction } from "jotai";
import { Modal } from "..";
import { Step1 } from "./Step1";
import { useLiquidationStep } from "@/state";
import { ShowWhen } from "@/components/Utils";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { LuLoader2 } from "react-icons/lu";
import { Step2 } from "./Step2";
import { classNames } from "@/utils";
import { Step3 } from "./Step3";

export interface LiquidationDetail {
  address: string;
  hash: string;
  toPay: number;
}

export interface LiquidationVerificationDetail {
  message: string;
}

// Liquidation Steps
const liquidationSteps: string[] = ["Selling", "Refunding", "Finish"];

interface LiquidationStepProps {
  text: string;
  step: number;
}
function LiquidationStep({ text, step }: LiquidationStepProps) {
  const { liquidationStepData } = useLiquidationStep();
  const paymentStep = liquidationStepData.step;
  const isCompleted = step < paymentStep || paymentStep === 2;
  const isCurrentStep = step === paymentStep;

  return (
    <h3
      className={classNames(
        "text-xs lg:text-xl font-semibold text-center w-fit rounded-full p-2 lg:p-4 py-1 lg:py-2 flex items-center justify-center",
        isCurrentStep
          ? "bg-white text-black"
          : "text-white bg-black border-[1px] border-white/50"
      )}
    >
      <span className="mr-1">{text}</span>

      <ShowWhen
        component={
          <IoIosCheckmarkCircle className="text-green-500 font-bold text-xl" />
        }
        otherwise={
          <ShowWhen
            component={<LuLoader2 className="animate-spin duration-300" />}
            when={isCurrentStep && step !== 2}
          />
        }
        when={isCompleted}
      />
    </h3>
  );
}

function LiquidationSteps() {
  return (
    <div className="flex items-center gap-2 lg:gap-16 justify-center">
      {liquidationSteps.map((text, key) => (
        <LiquidationStep text={text} key={key} step={key} />
      ))}
    </div>
  );
}

// Liquidation Modal
interface Props {
  setShowLiquidationModal: Dispatch<SetStateAction<boolean>>;
}

const stepComponents = [
  <Step1 key={0} />,
  <Step2 key={1} />,
  <Step3 key={2} />,
];

export function LiquidateModal({ setShowLiquidationModal }: Props) {
  const { liquidationStepData } = useLiquidationStep();

  return (
    <Modal size="lg" setShowModal={setShowLiquidationModal}>
      <div className="bg-black text-white flex flex-col gap-8 lg:gap-16">
        <LiquidationSteps />
        {stepComponents[liquidationStepData.step]}
      </div>
    </Modal>
  );
}
