import { orgPrefixPaths } from "@/orgPrefixPaths";

export interface OrgPathInfo {
  case1Match: boolean;
  case2Match: boolean;
  pathParts: string[];
  pathWithoutOrg: string;
  currentRouteIncomingOrg: string | null;
  inPathWithOrgPrefix: boolean;
}

export function getOrgPathInfo(
  currentOrg: string | null,
  pathname: string,
): OrgPathInfo {
  // Check if path matches any org prefix paths directly
  const case1Match = orgPrefixPaths.some((path) => pathname.startsWith(path));

  const pathParts = pathname.split("/");
  const pathWithoutOrg = `/${pathParts.slice(3).join("/")}`;
  const case2Match = orgPrefixPaths.some((path) =>
    pathWithoutOrg.startsWith(path),
  );

  let currentRouteIncomingOrg =
    (case2Match ? pathParts[2] : case1Match ? currentOrg : null) ?? null;

  if (case1Match) {
    currentRouteIncomingOrg = currentOrg;
  }

  const inPathWithOrgPrefix = case1Match || case2Match;

  const data = {
    case1Match,
    case2Match,
    pathname,
    pathParts,
    pathWithoutOrg,
    currentRouteIncomingOrg,
    inPathWithOrgPrefix,
    currentOrg,
  };

  // console.log("shit", data);

  return data;
}
