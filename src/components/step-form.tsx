import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export interface Step<T> {
  id: number;
  title: string;
  component: React.ComponentType<StepComponentProps<T>>;
  validate: (validation: T) => {
    isValid: boolean;
    error?: string;
  };
  actions: {
    onNext: (validation: T) => Promise<boolean> | boolean;
  };
}

export interface StepComponentProps<T> {
  validation: T;
  setValidation: (validation: T | ((prev: T) => T)) => void;
}

interface StepFormProps<T> {
  steps: Step<T>[];
  validation: T;
  setValidation: (validation: T | ((prev: T) => T)) => void;
  getStepNavigation: (
    currentStep: number,
    validation: T,
  ) => {
    next: number | null;
    prev: number | null;
  };
  onExit?: () => void;
  hideProgressBar?: boolean;
}

export function StepForm<T>({
  steps,
  validation,
  setValidation,
  getStepNavigation,
  onExit,
  hideProgressBar,
}: StepFormProps<T>) {
  const [step, setStep] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavigation = async (direction: "next" | "prev") => {
    if (isNavigating) return;

    setIsNavigating(true);
    const navigation = getStepNavigation(step, validation);
    const nextStep = direction === "next" ? navigation.next : navigation.prev;

    if (direction === "next") {
      const validationResult = steps[step].validate(validation);
      if (!validationResult.isValid) {
        if (validationResult.error) {
          toast.error(validationResult.error);
        }
        setIsNavigating(false);
        return;
      }

      const actionResult = await steps[step].actions.onNext(validation);
      if (!actionResult) {
        setIsNavigating(false);
        return;
      }
    }

    if (nextStep === null) {
      if (direction === "prev" && onExit) {
        onExit();
      }
      setIsNavigating(false);
      return;
    }

    setStep(nextStep);

    setTimeout(() => {
      setIsNavigating(false);
    }, 300);
  };

  const CurrentStepComponent = steps[step].component;

  const calculateProgress = () => {
    const navigation = getStepNavigation(step, validation);
    const totalSteps = steps.length - 1;
    const currentStepNumber = step;

    return navigation.next === null
      ? 100
      : Math.round((currentStepNumber / totalSteps) * 100);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      {!hideProgressBar && (
        <div className="sticky top-0 left-0 z-50 w-full">
          <div className="relative">
            <Progress
              value={calculateProgress()}
              className="h-2 rounded-none"
            />

            <div className="-bottom-10 absolute hidden w-full justify-between px-4 md:flex">
              {steps.map((stepItem, index) => (
                <div
                  key={index}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs transition-all duration-300",
                    index === step
                      ? "opacity-0"
                      : "bg-muted text-muted-foreground opacity-30",
                  )}
                >
                  {stepItem.title}
                </div>
              ))}
            </div>

            <div
              className="-bottom-10 absolute z-10 transform transition-all duration-300 ease-out"
              style={{
                left:
                  calculateProgress() === 100
                    ? "auto"
                    : `${calculateProgress()}%`,
                right: calculateProgress() === 100 ? "0" : "auto",
                transform:
                  calculateProgress() === 100
                    ? "translateX(-5%)"
                    : calculateProgress() === 0
                      ? "translateX(5%)"
                      : "translateX(-50%)",
                maxWidth: "90%",
                minWidth: "max-content",
              }}
            >
              <div className="relative">
                <div
                  className={cn(
                    "-top-2 -translate-x-1/2 -translate-y-full absolute left-1/2 transform",
                    calculateProgress() === 0 && "hidden",
                  )}
                >
                  <div className="border-x-[8px] border-x-transparent border-b-[8px] border-b-primary" />
                </div>
                <div className="rounded-full bg-primary px-3 py-1 text-primary-foreground text-xs">
                  {steps[step].title}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex h-full w-full justify-center md:py-0">
        <div className="mx-4 my-auto w-full max-w-5xl py-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="mb-4 font-medium text-xl">{steps[step].title}</h1>
              <CurrentStepComponent
                validation={validation}
                setValidation={setValidation}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="fixed right-8 bottom-12 flex flex-row gap-2">
        <Button
          variant="expandIconOutline"
          Icon={ChevronLeft}
          iconPlacement="left"
          onClick={() => handleNavigation("prev")}
          className="drop-shadow-md"
        >
          Back
        </Button>
        <Button
          variant="expandIcon"
          Icon={ChevronRight}
          iconPlacement="right"
          onClick={() => handleNavigation("next")}
          className="drop-shadow-md"
        >
          {getStepNavigation(step, validation).next === null
            ? "Finish"
            : "Next"}
        </Button>
      </div>
    </div>
  );
}
