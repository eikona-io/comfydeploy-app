import { SignIn } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { createFileRoute } from "@tanstack/react-router";
import { useTheme } from "@/components/theme-provider";
import { isDarkTheme } from "@/lib/utils";

export const Route = createFileRoute("/auth/sign-in")({
  component: SignInComponent,
});

function SignInComponent() {
  const { theme } = useTheme();

  return (
    <div className="flex h-full w-full items-center justify-center">
      <SignIn
        waitlistUrl="/waitlist"
        appearance={{
          theme: isDarkTheme(theme) ? dark : undefined,
          elements: {
            cardBox: "dark:border-zinc-700/50",
          },
        }}
      />
    </div>
  );
}
