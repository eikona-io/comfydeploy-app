import { api } from "@/lib/api";

export async function addModel(props: {
  custom_path: string;
  filename: string;
  url: string;
}) {
  return await api({
    url: "/file",
    init: {
      method: "POST",
      body: JSON.stringify(props),
    },
  });
}
