import {
  CreateOrganization,
  OrganizationList,
  useOrganization,
  useOrganizationList,
} from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { useCustomer } from "autumn-js/react";
import { isDarkTheme } from "@/lib/utils";
import { useTheme } from "./theme-provider";
import { Skeleton } from "./ui/skeleton";

export function useOrgSelector() {
  const { theme } = useTheme();

  const { organization, isLoaded: isOrganizationLoaded } = useOrganization();
  const { userMemberships, isLoaded } = useOrganizationList({
    userMemberships: true,
  });

  const { check, isLoading } = useCustomer();
  const workflowLimit = check({ featureId: "workflow_limit" });

  console.log("isLoading", isLoading);
  console.log("isLoaded", isLoaded);
  console.log("isOrganizationLoaded", isOrganizationLoaded);
  console.log("workflowLimit", workflowLimit);

  // if (isLoading || !isLoaded || !isOrganizationLoaded) {
  // return (
  //   <div className="h-full flex w-full flex-col items-center justify-center p-8 bg-background z-50">
  //     Loading...
  //   </div>
  // );
  // }

  //   The user is in a personal org, has other org, no workflows, show the org list
  if (
    !organization &&
    userMemberships?.count &&
    userMemberships.count > 0 &&
    workflowLimit.data.usage === 0
  ) {
    return (
      <div className="h-full flex  w-full flex-col items-center justify-center p-8 bg-background z-50">
        <div className="text-center">
          <OrganizationList
            hidePersonal
            afterSelectOrganizationUrl="/org/:slug/workflows"
            appearance={{
              baseTheme: isDarkTheme(theme) ? dark : undefined,
              elements: {
                cardBox: "dark:border-zinc-700",
              },
            }}
          />
        </div>
      </div>
    );
  }

  //   The user is in a personal org, no workflows, show the create org form
  if (!organization && workflowLimit.data.usage === 0) {
    return (
      <div className="h-full inset-0 flex flex-col items-center justify-center p-8 bg-background  z-50">
        <div className="text-center">
          <CreateOrganization
            afterCreateOrganizationUrl="/org/:slug/workflows"
            //   afterCreateOrganizationUrl="/pricing"
            hideSlug
            appearance={{
              baseTheme: isDarkTheme(theme) ? dark : undefined,
              elements: {
                cardBox: "dark:border-zinc-700",
              },
            }}
          />
        </div>
      </div>
    );
  }

  //   Legazy user, personal org, has workflows
  return null;
}
