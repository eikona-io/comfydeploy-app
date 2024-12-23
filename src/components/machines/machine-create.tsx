import { useCurrentPlan } from "@/hooks/use-current-plan";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export function MachineCreate() {
  const sub = useCurrentPlan();
  const navigate = useNavigate({ from: "/machines" });

  useEffect(() => {
    if (sub?.features.machineLimited) {
      navigate({
        search: { view: undefined },
      });
    }
  }, [sub, navigate]);

  return <div>Hello "/machines/create"!</div>;
}
