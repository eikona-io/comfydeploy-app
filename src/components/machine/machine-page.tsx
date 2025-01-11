import {
  LoadingMachineVerSkeleton,
  MachineDeployment,
} from "@/components/machine/machine-deployment";
import {
  LastActiveEvent,
  MachineCostEstimate,
  MachineOverview,
} from "@/components/machine/machine-overview";
import { MachineVersionBadge } from "@/components/machine/machine-version-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useEffect } from "react";

export default function MachinePage({
  params,
}: {
  params: { machine_id: string };
}) {
  const navigate = useNavigate();
  const { view } = useSearch({ from: "/machines/$machineId/" });

  const {
    data: machine,
    isLoading,
    refetch,
  } = useQuery<any>({
    queryKey: ["machine", params.machine_id],
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (machine?.status === "building") {
      navigate({
        to: "/machines/$machineId",
        params: { machineId: params.machine_id },
        search: { view: "history" },
      });
    }
  }, [machine?.status, navigate, params.machine_id]);

  if (isLoading || !machine) {
    return (
      <>
        <div className="h-[57px] w-full border-b bg-[#fcfcfc] shadow-sm" />
        <div className="mx-auto h-[calc(100vh-100px)] max-h-full w-full max-w-[1200px] px-2 py-4 md:px-4">
          <LoadingMachineVerSkeleton />
        </div>
      </>
    );
  }

  return (
    <div className="w-full">
      <div className="mx-auto w-full">
        <div className="sticky top-0 z-50 flex flex-row justify-between border-gray-200 border-b bg-[#fcfcfc] p-4 shadow-sm">
          <div className="flex flex-row items-center gap-4">
            <Link
              to={`/machines/${machine.id}`}
              params={{ machineId: machine.id }}
              className="flex flex-row items-center gap-2 font-medium text-md"
            >
              {machine.name}
              {machine.machine_version_id && (
                <MachineVersionBadge machine={machine} isExpanded={true} />
              )}
            </Link>
            {view === "history" && (
              <>
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-500 text-sm">History</span>
              </>
            )}
          </div>
          <div className="flex flex-row gap-2">
            <MachineCostEstimate machineId={machine.id} />
            <LastActiveEvent machineId={machine.id} />
          </div>
        </div>

        <div className="mx-auto max-w-[1200px]">
          {(() => {
            switch (view) {
              case "history":
                return <MachineDeployment machine={machine} />;
              default:
                return <MachineOverview machine={machine} />;
            }
          })()}
        </div>
      </div>
    </div>
  );
}
