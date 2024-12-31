import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const fetchToken = useAuthStore.getState().fetchToken;
  const auth = await fetchToken();
  const headers = {
    Authorization: `Bearer ${auth}`,
  };

  const response = await api({
    url: "file/upload",
    init: {
      method: "POST",
      body: formData,
      headers,
    },
  });
  return response;
}
