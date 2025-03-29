import { Badge } from "@/components/ui/badge";
import { CreateOrganization } from "@clerk/clerk-react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/create-org")({
  component: CreateOrgPage,
});

export function CreateOrgPage() {
  return (
    <div className="mt-28 flex flex-col justify-center gap-4 p-4">
      <div className="max-w-lg">
        <div className="mb-2 flex items-center gap-3">
          <h1 className="font-bold text-2xl">Create Your Organization</h1>
          <Badge variant="purple" className="!text-2xs py-0.5">
            Required
          </Badge>
        </div>
        <p className="text-gray-600 text-sm leading-[22px]">
          Setting up an organization allows you to collaborate with team
          members, share workflows, and manage resources together. You can
          invite members and manage permissions later.
        </p>
      </div>
      <div className="mx-auto">
        <CreateOrganization />
      </div>
    </div>
  );
}
