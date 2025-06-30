import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  Shield,
  ArrowRight,
  Lock,
  Loader2,
  X,
  Building,
  User,
  Clock,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth, useOrganization, useUser } from "@clerk/clerk-react";

// UUID validation function (reusing the pattern from the codebase)
const isValidUuid = (value: string) => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );
};

export const Route = createFileRoute("/auth/request/$requestId/")({
  component: RouteComponent,
  beforeLoad: ({ params }) => {
    // Validate that requestId is a valid UUID
    if (!isValidUuid(params.requestId)) {
      throw notFound();
    }
  },
});

function RouteComponent() {
  const { requestId } = Route.useParams();
  const [isAuthValid, setIsAuthValid] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  // Get user and organization info
  const { user } = useUser();
  const { organization } = useOrganization();

  const {
    data: request,
    isLoading,
    error,
  } = useQuery<{ api_key: string }>({
    queryKey: ["platform", "comfyui", "auth-response"],
    queryKeyHashFn: (queryKey) => [...queryKey, requestId].toString(),
    meta: {
      params: {
        request_id: requestId,
      },
    },
    refetchOnWindowFocus: false,
  });

  // Check for expired error
  useEffect(() => {
    if (error?.message?.includes("status: 410")) {
      setIsExpired(true);
    }
  }, [error]);

  const isAlreadyAuthorized = request?.api_key && !isExpired;

  const onAcceptAuth = async () => {
    try {
      const response = await api({
        url: "platform/comfyui/auth-request",
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

  const handleClose = () => {
    try {
      window.close();
      // If we reach here, window.close() didn't work
      setTimeout(() => {
        console.log("Please close this window manually");
      }, 100);
    } catch (error) {
      console.log("Please close this window manually");
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
          {/* Account Info Section */}
          <div className="mb-4 flex w-full items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback>
                  {organization
                    ? organization.name?.[0]?.toUpperCase()
                    : user?.fullName?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2">
                  {organization ? (
                    <>
                      <Building className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span className="font-medium text-gray-500 text-xs dark:text-gray-300">
                        {organization.name}
                      </span>
                    </>
                  ) : (
                    <>
                      <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span className="font-medium text-gray-500 text-xs dark:text-gray-300">
                        {user?.fullName || "Personal Account"}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              {organization ? "Organization" : "Personal"}
            </Badge>
          </div>

          <motion.div
            className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
              isAuthValid || isAlreadyAuthorized
                ? "bg-green-100 dark:bg-green-900"
                : authError || isExpired
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
              ) : isExpired ? (
                <motion.div
                  key="expired"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: "spring", bounce: 0.5, duration: 0.3 }}
                >
                  <Clock className="h-5 w-5 text-red-600 dark:text-red-400" />
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
                <CardTitle className="mt-2 text-lg">Access Granted</CardTitle>
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
                <CardTitle className="mt-2 text-lg">
                  Access Already Granted
                </CardTitle>
                <CardDescription className="mt-1">
                  This request has already been authorized. You can close this
                  window.
                </CardDescription>
              </motion.div>
            ) : isExpired ? (
              <motion.div
                key="auth-expired"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <CardTitle className="mt-2 text-lg">
                  Auth Request Expired
                </CardTitle>
                <CardDescription className="mt-1">
                  This authorization request has expired. Please close this
                  window and try again from ComfyUI.
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
                <CardTitle className="mt-2 text-lg">
                  Authorization Failed
                </CardTitle>
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
                <CardTitle className="mt-2 text-lg">
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
          {isAuthValid || isAlreadyAuthorized || authError || isExpired ? (
            <Button
              className="w-full"
              variant={"expandIcon"}
              Icon={ArrowRight}
              iconPlacement="right"
              onClick={handleClose}
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
