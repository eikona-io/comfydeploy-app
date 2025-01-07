import { createContext, useCallback, useContext, useState } from "react";

type ActiveMachineContextType = {
  activeCount: number;
  incrementActive: () => void;
  decrementActive: () => void;
};

const ActiveMachineContext = createContext<ActiveMachineContextType | null>(
  null,
);

export function ActiveMachineProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeCount, setActiveCount] = useState(0);

  const incrementActive = useCallback(
    () => setActiveCount((prev) => prev + 1),
    [],
  );
  const decrementActive = useCallback(
    () => setActiveCount((prev) => prev - 1),
    [],
  );

  return (
    <ActiveMachineContext.Provider
      value={{ activeCount, incrementActive, decrementActive }}
    >
      {children}
    </ActiveMachineContext.Provider>
  );
}

export const useActiveMachineCount = () => {
  const context = useContext(ActiveMachineContext);
  if (!context)
    throw new Error(
      "useActiveMachineCount must be used within ActiveMachineProvider",
    );
  return context;
};
