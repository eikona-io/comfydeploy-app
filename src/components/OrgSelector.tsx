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

export function useOrgSelector() {
  const { theme } = useTheme();

  const { organization } = useOrganization();
  const { userMemberships } = useOrganizationList({
    userMemberships: true,
  });

  const { check } = useCustomer();
  const workflowLimit = check({ featureId: "workflow_limit" });

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
            //   afterCreateOrganizationUrl="/pricing"
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
