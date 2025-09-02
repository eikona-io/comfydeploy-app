import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export interface Step<T> {
  id: number;
  title: string;
  component: React.ComponentType;
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
  getStepNavigation,
  onExit,
  hideProgressBar,
}: StepFormProps<T>) {
  if (!steps.length) {
    return null; // or some fallback UI
  }

  return (
    <div className="relative flex w-full flex-col overflow-hidden">
      <div className="flex w-full flex-1 justify-center overflow-auto">
        <div className="mx-4 w-full max-w-5xl py-10">
          <div className="space-y-12">
            {steps.map((stepItem, index) => {
              const StepComponent = stepItem.component;
              const isStepAccessible = (targetIndex: number) => {
                let currentCheck = 0;
                const visitedSteps = new Set<number>();

                while (currentCheck < targetIndex) {
                  if (visitedSteps.has(currentCheck)) return false; // Prevent infinite loops
                  visitedSteps.add(currentCheck);

                  const nav = getStepNavigation(currentCheck, validation);

                  // If there's no next step, this path is invalid
                  if (nav.next === null) return false;

                  // If the next step takes us directly to target, that's valid
                  if (nav.next === targetIndex) return true;

                  // If the next step goes beyond our target, this path is invalid
                  if (nav.next > targetIndex) return false;

                  // Continue checking from the next step
                  currentCheck = nav.next;
                }

                // If we reached the target through valid steps, it's accessible
                return currentCheck === targetIndex;
              };

              const isAccessible = isStepAccessible(index);

              if (!isAccessible) {
                return null;
              }

              return (
                <motion.div
                  key={stepItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="relative"
                >

                  <div className="space-y-6">
                    <StepComponent
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>


          {/* Sticky bottom action button */}
          <div className="sticky bottom-8 mt-16 flex justify-end pr-8">
            <Button
              size="lg"
              onClick={() => {
                // Validate and execute the final step
                // const lastStepIndex = steps.length - 1;
                // const validationResult = steps[lastStepIndex].validate(validation);
                // if (!validationResult.isValid) {
                //   if (validationResult.error) {
                //     toast.error(validationResult.error);
                //   }
                //   return;
                // }
                // steps[lastStepIndex].actions.onNext(validation);
              }}
              Icon={Check}
              iconPlacement="right"
              className="flex items-center gap-2 px-8 py-3 drop-shadow-lg"
            >
              Finish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
