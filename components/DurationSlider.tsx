import { defaultLoanDuration, useLoan } from "@/state";
import * as Slider from "@radix-ui/react-slider";
import { FormEvent } from "react";

export function DurationSlider() {
  const { loan, setLoan } = useLoan();
  const onChange = (e: FormEvent<HTMLDivElement>) => {
    const input = e.target as HTMLInputElement;
    setLoan((prev) => ({ ...prev, duration: Number(input.value) }));
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="duration">
        Loan Duration -{" "}
        <span className="text-yellow-400 font-semibold">{loan.duration}</span>{" "}
        days
      </label>

      <form id="duration">
        <Slider.Root
          className="relative flex items-center select-none touch-none w-[200px] h-5"
          defaultValue={[defaultLoanDuration]}
          max={14}
          min={1}
          step={1}
          onChange={onChange}
        >
          <Slider.Track className="bg-white relative grow rounded-full h-1">
            <Slider.Range className="absolute bg-yellow-400 rounded-full h-full" />
          </Slider.Track>

          <Slider.Thumb
            className="block w-5 h-5 bg-white shadow-[0_2px_10px] shadow-white rounded-[10px] hover:bg-zinc-500 transition-all hover:cursor-pointer focus:outline-none focus:shadow-[0_0_0_1px] focus:shadow-white"
            aria-label="Volume"
          />
        </Slider.Root>
      </form>
    </div>
  );
}
