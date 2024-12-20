import type React from "react";
import { useState } from "react";

interface Step {
  title: React.ReactNode;
  content: React.ReactNode;
}

interface NewStepperProps {
  steps: Step[];
}

export const NewStepper: React.FC<NewStepperProps> = ({ steps }) => {
  const [currentStep, setCurrentStep] = useState(-1);

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="flex flex-col gap-4">
      {steps.map((step, index) => (
        <div key={index} className="relative flex flex-col rounded-lg">
          <div
            className={`flex items-center gap-2 font-semibold text-lg ${index === currentStep ? "text-blue-500" : "text-gray-600"}`}
          >
            <span
              className={`rounded-full px-3 py-1 font-bold text-sm ${index === currentStep ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"}`}
            >
              {index + 1}
            </span>
            {step.title}
          </div>
          <div
            className={`mt-2 flex flex-col gap-2 pl-10 ${index === currentStep ? "text-gray-900" : "text-gray-500"}`}
          >
            {step.content}
          </div>
          {index !== steps.length - 1 && (
            <div className="absolute top-[40px] bottom-0 left-[15px] h-[calc(100%-40px)] w-[2px] bg-gray-200" />
          )}
        </div>
      ))}

      {/* Navigation buttons */}
      {/* <div className="flex justify-between mt-4">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {currentStep === steps.length - 1 ? "Finish" : "Next"}
        </button>
      </div> */}
    </div>
  );
};
