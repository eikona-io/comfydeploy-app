import { MachineCreate } from '@/components/machines/machine-create'
import { MachineList } from '@/components/machines/machine-list'
import { useCurrentPlan } from '@/hooks/use-current-plan'
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import { LoadingIcon } from '@/components/ui/custom/loading-icon'
import { api } from '@/lib/api'
import { toast } from 'sonner'

export const Route = createFileRoute('/machines/')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      view: search.view === 'create' ? 'create' : undefined,
      action:
        search.action === 'update-custom-nodes'
          ? 'update-custom-nodes'
          : undefined,
    }
  },
})

function RouteComponent() {
  const navigate = useNavigate({ from: '/machines' })
  const sub = useCurrentPlan()
  const { view } = Route.useSearch()
  const [isImporting, setIsImporting] = useState(false)

  useKeyboardShortcut(
    'c',
    () => {
      if (!sub?.features.machineLimited) {
        navigate({
          search: { view: 'create' as const, action: undefined },
        })
      }
    },
    {
      exactPath: '/machines',
    },
  )

  const handleImportMachine = async (file: File) => {
    setIsImporting(true)
    try {
      const fileContent = await file.text()
      const machineData = JSON.parse(fileContent)
      
      const response = await api({
        url: "machine/import",
        init: {
          method: "POST",
          body: JSON.stringify(machineData),
          headers: {
            "Content-Type": "application/json",
          },
        },
      })
      
      toast.success(`Machine "${response.name}" imported successfully`)
      window.location.reload()
    } catch (error) {
      toast.error("Failed to import machine. Please check the file format.")
    } finally {
      setIsImporting(false)
    }
  }

  if (view === 'create') {
    return <MachineCreate />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <input
          type="file"
          accept=".json"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              handleImportMachine(file)
            }
          }}
          style={{ display: 'none' }}
          id="machine-import-input"
        />
        <Button
          variant="outline"
          onClick={() => document.getElementById('machine-import-input')?.click()}
          disabled={isImporting}
          className="gap-2"
        >
          {isImporting ? <LoadingIcon className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
          Import Machine
        </Button>
      </div>
      <MachineList />
    </div>
  )
}
