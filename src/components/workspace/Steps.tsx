"use client";

import React, { type ReactNode } from "react";

// Define the props for the Steps component

type MyStepItem = StepItem & { title: string; content: ReactNode };

interface StepsProps {
  steps: MyStepItem[];
}

// Steps component definition with Tailwind CSS styles
// const Steps: React.FC<StepsProps> = ({ steps }) => {
//     return (
//         <div className="flex flex-col gap-4">
//             {steps.map((step, index) => (
//                 <div key={index} className="flex flex-col rounded-lg relative">
//                     <div className="font-semibold text-lg flex items-center gap-2">
//                         <span className="text-sm font-bold text-blue-500 bg-blue-100 rounded-full px-3 py-1">{index + 1}</span>
//                         {step.title}
//                     </div>
//                     <div className="mt-2 text-gray-600 pl-10">{step.content}</div>
//                     {
//                         index !== steps.length - 1 && (
//                             <div className='h-[calc(100%-40px)] w-[2px] bg-primary/20 absolute top-[40px] bottom-0 left-[15px]'></div>
//                         )
//                     }
//                 </div>
//             ))}
//         </div>
//     );
// };

import { Step, type StepItem, Stepper, useStepper } from "@/components/stepper";
import { Button } from "@/components/ui/button";

// const steps = [
// 	{ label: "Step 1" },
// 	{ label: "Step 2" },
// 	{ label: "Step 3" },
// ] satisfies StepItem[];

export function Steps(props: StepsProps) {
  const { steps } = props;
  const mySteps = steps.map((step, index) => {
    return {
      label: step.title,
      description: step.title,
    } satisfies StepItem;
  });
  return (
    // <div className="flex w-full flex-col gap-4">
    <Stepper
      size="sm"
      initialStep={0}
      expandVerticalSteps
      orientation="vertical"
      steps={mySteps}
      onClickStep={(step, setStep) => {
        setStep(step);
      }}
    >
      {steps.map((stepProps, index) => {
        const { content, title, ...props } = stepProps as MyStepItem;
        return (
          <Step
            key={stepProps.label}
            className="w-full"
            {...props}
            label={title}
          >
            <div className="flex w-full flex-col gap-2">{content}</div>
          </Step>
        );
      })}
      <Footer />
    </Stepper>
    // </div>
  );
}

const Footer = () => {
  const {
    nextStep,
    prevStep,
    resetSteps,
    isDisabledStep,
    hasCompletedAllSteps,
    isLastStep,
    isOptionalStep,
  } = useStepper();
  return (
    <>
      {hasCompletedAllSteps && (
        <div className="my-2 flex h-40 items-center justify-center rounded-md border bg-secondary text-primary">
          <h1 className="text-xl">You are all set!</h1>
        </div>
      )}
      <div className="flex w-full justify-end gap-2">
        {hasCompletedAllSteps ? (
          <Button size="sm" onClick={resetSteps}>
            Reset
          </Button>
        ) : (
          <>
            <Button
              disabled={isDisabledStep}
              onClick={prevStep}
              size="sm"
              variant="secondary"
            >
              Prev
            </Button>
            <Button size="sm" onClick={nextStep}>
              {isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default Steps;
