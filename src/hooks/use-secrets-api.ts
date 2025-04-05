import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export type EnvironmentVariableType = {
  key: string;
  value: string;
};

export type SecretGroup = {
  id: string;
  name: string;
  machines: string[];
  environment_variables: EnvironmentVariableType[];
};

export const useGetSecrets = () => {
  const data = useQuery<SecretGroup[]>({
    queryKey: ["machine", "secrets", "all"],
  });
  return data;
};

interface NewSecretProps {
  machine_id: string;
  secret_name: string;
  secret: EnvironmentVariableType[];
}

export async function addNewSecret({
  machine_id,
  secret_name,
  secret,
}: NewSecretProps) {
  const response = await api({
    url: "machine/secret",
    init: {
      method: "POST",
      body: JSON.stringify({ machine_id, secret_name, secret }),
    },
  });

  return response;
}

export async function updateSecret({
  secret,
  secret_id,
}: {
  secret: EnvironmentVariableType[];
  secret_id: string;
}) {
  const response = await api({
    url: `machine/secret/${secret_id}/envs`,
    init: {
      method: "PATCH",
      body: JSON.stringify({ secret, secret_id }),
    },
  });

  return response;
}

export async function deleteSecret({ secret_id }: { secret_id: string }) {
  const response = await api({
    url: `machine/secret/${secret_id}`,
    init: {
      method: "DELETE",
    },
  });

  return response;
}
