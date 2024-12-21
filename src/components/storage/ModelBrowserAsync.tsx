import { VolFSStructure } from "@/repo/db/VolTypes";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function ModelBrowserAsync(props: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  });

  await queryClient.prefetchQuery({
    queryKey: ["volume", "private-models"],
    // queryFn: () => getPrivateVolumeFromDB(),
    queryFn: async ({ queryKey }) => {
      const contents = await fetch(`/api/volume`, {
        method: "POST",
        body: JSON.stringify({
          url: queryKey.join("/"),
          type: "private-volume",
          disableCache: false,
        }),
      })
        .then((res) => res.json())
        .then((data) => data);
      return { structure: contents.structure as VolFSStructure, models: contents.models };
    },
  });
  await queryClient.prefetchQuery({
    queryKey: ["volume", "public-models"],
    // queryFn: () => getPublicVolumeFromDB(),
    queryFn: async ({ queryKey }) => {
      const contents = await fetch(`/api/volume`, {
        method: "POST",
        body: JSON.stringify({
          url: queryKey.join("/"),
          type: "public-volume",
          disableCache: false,
        }),
      })
        .then((res) => res.json())
        .then((data) => data);
      return { structure: contents.structure as VolFSStructure, models: contents.models };
    },
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      {props.children}
    </HydrationBoundary>
  );
}
