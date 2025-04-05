import { SecretsSelector } from "./secrets-selector";

export function MachineSecretsTab() {
  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6">
        <h1 className="mb-2 font-bold text-2xl">Machine Configuration</h1>
        <p className="text-muted-foreground">
          Configure your machine settings and secrets
        </p>
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="mb-3 font-semibold text-lg">Secrets Management</h2>

        <div>
          <h3 className="mb-2 font-medium text-sm">Machine Secret</h3>
          <div className="rounded-lg border p-4">
            <SecretsSelector />
          </div>
        </div>
      </div>
    </div>
  );
}
