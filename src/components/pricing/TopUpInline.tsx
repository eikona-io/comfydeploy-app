import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { TopUpConfirmDialog } from "./TopUpConfirmDialog";

interface TopUpInlineProps {
  className?: string;
  onSuccess?: () => void;
}

interface TopUpPreviewResponse {
  customer_id: string;
  lines: Array<{
    description: string;
    amount: number;
    item: {
      type: string;
      feature_id: string;
      quantity: number;
      price: number;
      display: {
        primary_text: string;
        secondary_text: string;
      };
    };
  }>;
  total: number;
  currency: string;
  url?: string;
  options: Array<{
    quantity: number;
    feature_id: string;
  }>;
}

export function TopUpInline({ className, onSuccess }: TopUpInlineProps) {
  const [amount, setAmount] = useState("25");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [previewData, setPreviewData] = useState<TopUpPreviewResponse | null>(
    null,
  );
  const queryClient = useQueryClient();

  // const { refetch } = useCustomer();

  const topUpMutation = useMutation({
    mutationFn: async ({
      topUpAmount,
      confirmed = false,
    }: {
      topUpAmount: number;
      confirmed?: boolean;
    }) => {
      return api({
        url: "platform/topup",
        init: {
          method: "POST",
          body: JSON.stringify({ amount: topUpAmount, confirmed }),
        },
      });
    },
    onSuccess: (data: TopUpPreviewResponse) => {
      if (data?.url) {
        // Has checkout URL - redirect immediately
        window.location.href = data.url;
      } else if (
        !data?.url &&
        data?.lines &&
        !topUpMutation.variables?.confirmed
      ) {
        // Preview response - show confirmation dialog
        setPreviewData(data);
        setShowConfirmDialog(true);
      } else {
        // Confirmed purchase completed
        toast.success("Credit added successfully!");
        setShowConfirmDialog(false);
        setPreviewData(null);
        queryClient.invalidateQueries({ queryKey: ["autumn-data"] });
        queryClient.invalidateQueries({ queryKey: ["platform", "plan"] });
        // refetch();
        onSuccess?.();
      }
    },
    onError: () => {
      toast.error("Top up failed. Please try again.");
    },
  });

  const confirmMutation = useMutation({
    mutationFn: async (topUpAmount: number) => {
      return api({
        url: "platform/topup",
        init: {
          method: "POST",
          body: JSON.stringify({ amount: topUpAmount, confirmed: true }),
        },
      });
    },
    onSuccess: (data: TopUpPreviewResponse) => {
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.success("Credit added successfully!");
        setShowConfirmDialog(false);
        setPreviewData(null);
        // Invalidate queries to refresh credit balance and plan data
        queryClient.invalidateQueries({ queryKey: ["autumn-data"] });
        queryClient.invalidateQueries({ queryKey: ["platform", "plan"] });
        // refetch();
        onSuccess?.();
      }
    },
    onError: () => {
      toast.error("Failed to complete purchase. Please try again.");
    },
  });

  const handleTopUp = () => {
    const numAmount = parseFloat(amount);
    if (numAmount < 10) {
      toast.error("Minimum top-up amount is $10");
      return;
    }
    if (numAmount > 1000) {
      toast.error("Maximum top-up amount is $1000");
      return;
    }
    topUpMutation.mutate({ topUpAmount: numAmount });
  };

  const handleConfirmPurchase = () => {
    const numAmount = parseFloat(amount);
    confirmMutation.mutate(numAmount);
  };

  const quickAmounts = [10, 25, 50, 100];

  return (
    <div className={cn("w-full space-y-3", className)}>
      <div className="flex flex-wrap gap-2">
        {quickAmounts.map((quickAmount) => (
          <Badge
            key={quickAmount}
            variant={amount === quickAmount.toString() ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary/90 hover:text-white"
            onClick={() => setAmount(quickAmount.toString())}
          >
            ${quickAmount}
          </Badge>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">$</span>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="10"
          max="1000"
          step="1"
          placeholder="25"
          className="flex-1"
        />
      </div>

      <Button
        onClick={handleTopUp}
        disabled={
          topUpMutation.isPending ||
          confirmMutation.isPending ||
          !amount ||
          parseFloat(amount) < 10
        }
        className="w-full"
      >
        {topUpMutation.isPending || confirmMutation.isPending ? (
          "Processing..."
        ) : (
          <>
            <Plus className="h-4 w-4 mr-2" />
            Add ${amount} Credit
          </>
        )}
      </Button>

      <TopUpConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        preview={previewData}
        onConfirm={handleConfirmPurchase}
        isLoading={confirmMutation.isPending}
      />
    </div>
  );
}
