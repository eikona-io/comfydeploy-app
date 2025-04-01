import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoadingIcon } from "./loading-icon";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { type Secret, useUpdateSecrets } from "@/stores/update-secrets";

const formSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
});

type ApiKeyAddProps = {
  onKeyCreated?: (key: string) => void;
};

export function AddSecret({ onKeyCreated }: ApiKeyAddProps) {
  const { secrets, setSecrets, setFilteredSecrets } = useUpdateSecrets(
    (state) => state,
  );
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      key: "Secret Key",
      value: "Secret Value",
    },
  });

  const [secretKey, setSecretKey] = useState("");

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setSecretKey("");
      form.reset({ key: "Secret Key", value: "Secret Value" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" className="">
          Create Secret
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (data) => {
              //   const response = await addNewAPIKey(data.name);
              //   setAPIKey(response.key);
              //   if (onKeyCreated) {
              //     onKeyCreated(response.key);
              //   }
              setSecretKey(data.key);
              if (data.key) {
                const newSecret: Secret = {
                  id: `secret-${secrets.length + 1}`,
                  key: data.key,
                  user_id: "user_235453",
                  org_id: "org_2350st",
                  created_at: new Date(),
                  updated_at: new Date(),
                };
                setSecrets([...secrets, newSecret]);
                setFilteredSecrets([...secrets, newSecret]);
                handleOpenChange(false);
              }
            })}
          >
            <DialogHeader>
              <DialogTitle>Create Secret</DialogTitle>
              <DialogDescription>Create secret for machines</DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-x-2.5">
              <FormField
                control={form.control}
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                className="mt-2"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                Create {form.formState.isSubmitting && <LoadingIcon />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
