"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/components/ui/card";
import { Input } from "@repo/components/ui/input";
import { Label } from "@repo/components/ui/label";
import { uploadFile } from "@repo/lib/uploadFile";
import { ChevronDown, ChevronUp, File } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
// import { downloadUrlModelSchema  } from "@repo/db/storage"

export const downloadUrlModelSchema = z.object({
  url: z.string(),
  filename: z
    .string()
    // .regex(/^$|^[0-9a-zA-Z-._]+$/, "Invalid filename")
    .default(""),
  custom_path: z.string().default(""),
  file: z.custom<FileList>().nullable(),
});

type DownloadUrlModel = z.infer<typeof downloadUrlModelSchema>;

export const FloatingForm = (props: {
  apiEndpoint: string;
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DownloadUrlModel>({
    resolver: zodResolver(downloadUrlModelSchema),
    defaultValues: {
      url: "",
      filename: "",
      custom_path: "",
      file: null,
    },
  });

  const { orgId, userId } = useAuth();
  const volumeName = "models_" + (orgId || userId);

  const onSubmit = async (data: DownloadUrlModel) => {
    try {
      if (data.file) {
        console.log(data.file);
        const result = uploadFile({
          volumeName: volumeName,
          file: data.file[0],
          targetPath: data.custom_path,
          apiEndpoint: props.apiEndpoint,
        });
        await toast.promise(result, {
          loading: "Uploading...",
          success: "Uploaded!",
          error: "Failed to upload!",
        });
        return;
      }

      const response = await fetch("/api/addModel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to add model");
      }

      const result = await response.json();
      console.log(result.message);
      // Handle successful submission (e.g., show a success message)
    } catch (error) {
      console.error("Error adding model:", error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <Card className="w-[300px] fixed top-4 right-4 shadow-lg z-50 bg-background border border-border">
      <CardHeader
        className="p-3 cursor-pointer"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">Download URL</CardTitle>
          {isMinimized ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4" />
          )}
        </div>
      </CardHeader>
      {!isMinimized && (
        <CardContent className="p-3">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="file" className="text-xs font-medium">
                File Upload
              </Label>
              <Input
                id="file"
                type="file"
                {...register("file")}
                className="h-8 text-xs"
                // onChange={(e) => {
                //   const file = e.target.files?.[0];
                //   if (file) {
                //     // Auto-fill filename if it's empty

                //   }
                // }}
              />
              {errors.file && (
                <p className="text-destructive text-xs">
                  {errors.file.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="url" className="text-xs font-medium">
                URL
              </Label>
              <Input id="url" {...register("url")} className="h-8 text-xs" />
              {errors.url && (
                <p className="text-destructive text-xs">{errors.url.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="filename" className="text-xs font-medium">
                Filename
              </Label>
              <Input
                id="filename"
                {...register("filename")}
                className="h-8 text-xs"
              />
              {errors.filename && (
                <p className="text-destructive text-xs">
                  {errors.filename.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="custom_path" className="text-xs font-medium">
                Path
              </Label>
              <Input
                id="custom_path"
                {...register("custom_path")}
                className="h-8 text-xs"
              />
              {errors.custom_path && (
                <p className="text-destructive text-xs">
                  {errors.custom_path.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full h-8 text-xs">
              Submit
            </Button>
          </form>
        </CardContent>
      )}
    </Card>
  );
};
