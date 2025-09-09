"use client";

import { CreditCard, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

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
  options: Array<{
    quantity: number;
    feature_id: string;
  }>;
}

interface TopUpConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preview: TopUpPreviewResponse | null;
  onConfirm: () => void;
  isLoading: boolean;
}

export function TopUpConfirmDialog({
  open,
  onOpenChange,
  preview,
  onConfirm,
  isLoading,
}: TopUpConfirmDialogProps) {
  if (!preview) return null;

  const creditLine = preview.lines.find(line =>
    line.item.feature_id === "gpu-credit"
  );

  const creditAmount = creditLine?.item.quantity || 0;
  const dollarAmount = preview.total;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Confirm Credit Purchase
          </DialogTitle>
          <DialogDescription>
            Please review your credit purchase details below
          </DialogDescription>
        </DialogHeader>

        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <Zap className="h-8 w-8 text-amber-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">${dollarAmount}</div>
                <div className="text-sm text-muted-foreground">Credit Purchase</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="min-w-[100px]"
          >
            {isLoading ? "Processing..." : `Purchase $${dollarAmount}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
