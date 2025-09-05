"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Plus, CreditCard } from "lucide-react";

interface TopUpButtonProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  showIcon?: boolean;
  children?: React.ReactNode;
}

export function TopUpButton({
  className,
  variant = "default",
  size = "default",
  showIcon = true,
  children
}: TopUpButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("25");

  const topUpMutation = useMutation({
    mutationFn: async (topUpAmount: number) => {
      return api({
        url: "platform/topup",
        init: {
          method: "POST",
          body: JSON.stringify({ amount: topUpAmount })
        }
      });
    },
    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.success("Credit added successfully!");
        setIsOpen(false);
      }
    },
    onError: () => {
      toast.error("Failed to initiate top-up. Please try again.");
    }
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
    topUpMutation.mutate(numAmount);
  };

  const quickAmounts = [10, 25, 50, 100];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn("gap-2", className)}
        >
          {showIcon && <CreditCard className="h-4 w-4" />}
          {children || "Top Up"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Add Credits</h4>
            {/* <p className="text-sm text-muted-foreground">
              Top up your GPU credit balance. $1 = 100 credits
            </p> */}
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
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
            {/* 
            <div className="text-xs text-muted-foreground">
              Minimum: $10 • Maximum: $1000
            </div> */}
          </div>

          <Button
            onClick={handleTopUp}
            disabled={topUpMutation.isPending || !amount || parseFloat(amount) < 10}
            className="w-full"
          >
            {topUpMutation.isPending ? (
              "Processing..."
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add ${amount} Credit
              </>
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
