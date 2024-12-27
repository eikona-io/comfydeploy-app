import { api } from "@/lib/api";

export async function deleteAPIKey(id: string) {
  const response = await api({
    url: `platform/api-keys/${id}`,
    init: {
      method: "DELETE",
    },
  });
  return response;
}

export async function addNewAPIKey(name: string) {
  const response = await api({
    url: "platform/api-keys",
    init: {
      method: "POST",
      body: JSON.stringify({ name }),
    },
  });
  return response;
}
