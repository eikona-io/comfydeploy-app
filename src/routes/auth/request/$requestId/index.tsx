import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Shield, ArrowRight, Lock, Loader2, X } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/auth/request/$requestId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { requestId } = Route.useParams();
  const [isAuthValid, setIsAuthValid] = useState(false);
  const [authError, setAuthError] = useState(false);
  const { data: request, isLoading } = useQuery<{ api_key: string }>({
    queryKey: ["platform", "comfyui", "auth"],
    queryKeyHashFn: (queryKey) => [...queryKey, requestId].toString(),
    meta: {
      params: {
        request_id: requestId,
      },
    },
  });

  const isAlreadyAuthorized = request?.api_key;

  const onAcceptAuth = async () => {
    try {
      const response = await api({
        url: "platform/comfyui/auth",
        init: {
          method: "POST",
          body: JSON.stringify({
            request_id: requestId,
          }),
        },
      });

      if (response.status === "success") {
        setIsAuthValid(true);
      } else {
        setAuthError(true);
      }
    } catch (error) {
      console.error(error);
      setAuthError(true);
    }
  };

  if (isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center p-4">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );

  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="text-center">
          <motion.div
            className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
              isAuthValid || isAlreadyAuthorized
                ? "bg-green-100 dark:bg-green-900"
                : authError
                  ? "bg-red-100 dark:bg-red-900"
                  : "bg-blue-100 dark:bg-blue-900"
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isAuthValid || isAlreadyAuthorized ? (
                <motion.div
                  key="shield"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: "spring", bounce: 0.5, duration: 0.3 }}
                >
                  <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                </motion.div>
              ) : authError ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: "spring", bounce: 0.5, duration: 0.3 }}
                >
                  <X className="h-5 w-5 text-red-600 dark:text-red-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="lock"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: "spring", bounce: 0.5, duration: 0.3 }}
                >
                  <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence mode="wait" initial={false}>
            {isAuthValid ? (
              <motion.div
                key="auth-success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <CardTitle className="text-xl">Access Granted</CardTitle>
                <CardDescription className="mt-1">
                  You can now close this window and continue to ComfyUI.
                </CardDescription>
              </motion.div>
            ) : isAlreadyAuthorized ? (
              <motion.div
                key="already-authorized"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <CardTitle className="text-xl">
                  Access Already Granted
                </CardTitle>
                <CardDescription className="mt-1">
                  This request has already been authorized. You can close this
                  window.
                </CardDescription>
              </motion.div>
            ) : authError ? (
              <motion.div
                key="auth-error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <CardTitle className="text-xl">Authorization Failed</CardTitle>
                <CardDescription className="mt-1">
                  Failed to grant access. Please try to close the window and
                  relogin again.
                </CardDescription>
              </motion.div>
            ) : (
              <motion.div
                key="auth-required"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <CardTitle className="text-xl">
                  Grant Access to ComfyUI
                </CardTitle>
                <CardDescription className="mt-1">
                  Press accept to grant access to ComfyUI.
                </CardDescription>
              </motion.div>
            )}
          </AnimatePresence>
        </CardHeader>

        <CardContent>
          {isAuthValid || isAlreadyAuthorized || authError ? (
            <Button
              className="w-full"
              variant={"expandIcon"}
              Icon={ArrowRight}
              iconPlacement="right"
              onClick={() => {
                console.log("closing window");
                window.close();
              }}
            >
              Close
            </Button>
          ) : (
            <Button
              className="w-full"
              onClick={onAcceptAuth}
              variant={"expandIcon"}
              Icon={ArrowRight}
              iconPlacement="right"
            >
              Accept
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
