import { Dispatch } from "react";
import { SetStateAction } from "jotai";
import { Modal } from "..";
import { Step1 } from "./Step1";
import { useRepaymentStep } from "@/state";
import { ShowWhen } from "@/components/Utils";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { LuLoader2 } from "react-icons/lu";
import { Step2 } from "./Step2";
import { classNames } from "@/utils";
import { Step3 } from "./Step3";

export interface RepaymentDetail {
  address: string;
  hash: string;
  toPay: number;
}

export interface RepaymentVerificationDetail {
  message: string;
}

// Repayment Steps
const repaymentSteps: string[] = ["Repay", "Release", "Finish"];

interface RepaymentStepProps {
  text: string;
  step: number;
}
function RepaymentStep({ text, step }: RepaymentStepProps) {
  const { repaymentStepData } = useRepaymentStep();
  const paymentStep = repaymentStepData.step;
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

function RepaymentSteps() {
  return (
    <div className="flex items-center gap-2 lg:gap-16 justify-center">
      {repaymentSteps.map((text, key) => (
        <RepaymentStep text={text} key={key} step={key} />
      ))}
    </div>
  );
}

// Repayment Modal
interface Props {
  setShowRepaymentModal: Dispatch<SetStateAction<boolean>>;
}

const stepComponents = [
  <Step1 key={0} />,
  <Step2 key={1} />,
  <Step3 key={2} />,
];

export function RepaymentModal({ setShowRepaymentModal }: Props) {
  const { repaymentStepData } = useRepaymentStep();

  return (
    <Modal size="lg" setShowModal={setShowRepaymentModal}>
      <div className="bg-black text-white flex flex-col gap-8 lg:gap-16">
        <RepaymentSteps />
        {stepComponents[repaymentStepData.step]}
      </div>
    </Modal>
  );
}
