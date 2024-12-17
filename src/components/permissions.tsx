import { Protect, useAuth } from "@clerk/clerk-react";

export function useIsAdminOnly() {
  const { orgId, has } = useAuth();
  return has?.({ role: "org:admin" }) || !orgId;
}

export function useIsAdminAndMember() {
  const { orgId, has } = useAuth();
  return (
    has?.({ role: "org:admin" }) || has?.({ role: "org:member" }) || !orgId
  );
}

export function AdminOnly(props: {
  children: React.ReactNode;
}) {
  const { orgId } = useAuth();
  return (
    <Protect condition={(has) => has({ role: "org:admin" }) || !orgId}>
      {props.children}
    </Protect>
  );
}

export function AdminAndMember(props: {
  children: React.ReactNode;
}) {
  const { orgId } = useAuth();
  return (
    <Protect
      condition={(has) =>
        has({ role: "org:admin" }) || has({ role: "org:member" }) || !orgId
      }
    >
      {props.children}
    </Protect>
  );
}
