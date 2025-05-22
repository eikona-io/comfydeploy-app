import {
  AlertCircle,
  FileInput,
  FileOutput,
  Image,
  Plus,
  Video,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { sendEventToCD } from "./sendEventToCD";
import { Separator } from "../ui/separator";

export function ExternalNodeDocs() {
  return (
    <div>
      <Accordion type="multiple" className="w-full" defaultValue={["image"]}>
        <AccordionItem value="image">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center gap-2">
              <Image className="h-3.5 w-3.5" /> Image Processing
            </div>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col">
            <NodeDocsTooltip
              title="External Image"
              description="The External Image node allows you to expose image inputs in your workflow. It supports loading images from URLs and base64 encoded data."
              badges={[
                {
                  icon: FileInput,
                  text: "Input",
                  variant: "orange",
                },
              ]}
              imageUrl="https://cd-misc.s3.us-east-2.amazonaws.com/external+nodes/external_image.jpg"
              inputFields={[
                {
                  name: "input_id",
                  description: "Unique identifier for this input",
                  required: true,
                },
                {
                  name: "default_value",
                  description: "Default value for the input",
                },
                {
                  name: "default_value_url",
                  description: "URL for default image input",
                },
                {
                  name: "display_name",
                  description: "Name shown in the playground",
                },
                {
                  name: "description",
                  description: "Explains the purpose of this input",
                },
              ]}
              alertTitle="Import Assets"
              alertDescription="You can import assets directly from the assets browser using the button in the playground."
              onAddNode={() => {
                sendEventToCD("add_node", {
                  type: "ComfyUIDeployExternalImage",
                  widgets_values: ["input_image", "", "", ""],
                });
              }}
            />
            <NodeDocsTooltip
              title="External Image Batch"
              description="The External Image Batch node allows you to send multiple images as an input. It supports loading images from URLs (including ZIP files containing images) and base64 encoded data."
              badges={[
                {
                  icon: FileInput,
                  text: "Input",
                  variant: "orange",
                },
                {
                  icon: Video,
                  text: "Video",
                  variant: "outline",
                },
              ]}
              imageUrl="https://cd-misc.s3.us-east-2.amazonaws.com/external+nodes/external_image.jpg"
              inputFields={[
                {
                  name: "input_id",
                  description: "Unique identifier for this input",
                  required: true,
                },
                {
                  name: "images",
                  description:
                    'JSON array of image sources (URLs, ZIP files, or base64 data). \n Format is ["url1", "url2", "url3"]',
                },
                {
                  name: "default_value",
                  description:
                    "The default image to use if no input is provided",
                },
                {
                  name: "display_name",
                  description: "Name shown in the playground",
                },
                {
                  name: "description",
                  description: "Explains the purpose of this input",
                },
              ]}
              alertTitle="Video workflows"
              alertDescription="This node is usually used with video workflows. Most likely you want to use External Image. "
              onAddNode={() => {
                sendEventToCD("add_node", {
                  type: "ComfyUIDeployExternalImageBatch",
                  widgets_values: ["input_images", "", "", ""],
                });
              }}
            />
            <NodeDocsTooltip
              title="External Image Alpha"
              description="The External Image Alpha node is an alternative image input node that allows you to expose image inputs to use the Alpha channel. It supports loading images from URLs and base64 encoded data, with improved alpha channel handling."
              badges={[
                {
                  icon: FileInput,
                  text: "Input",
                  variant: "orange",
                },
              ]}
              imageUrl="https://cd-misc.s3.us-east-2.amazonaws.com/external+nodes/external_image.jpg"
              inputFields={[
                {
                  name: "input_id",
                  description: "Unique identifier for this input",
                  required: true,
                },
                {
                  name: "default_value",
                  description:
                    "The default image to use if no input is provided",
                },
                {
                  name: "display_name",
                  description: "Name shown in the playground",
                },
                {
                  name: "description",
                  description: "Explains the purpose of this input",
                },
              ]}
              onAddNode={() => {
                sendEventToCD("add_node", {
                  type: "ComfyUIDeployExternalImageAlpha",
                  widgets_values: ["input_image_alpha", "", "", ""],
                });
              }}
            />
            <NodeDocsTooltip
              title="Image Output"
              description='The Image Output node allows you to save images, just like default "Save Image" node.'
              badges={[
                {
                  icon: FileOutput,
                  text: "Output",
                  variant: "green",
                },
              ]}
              imageUrl="https://cd-misc.s3.us-east-2.amazonaws.com/external+nodes/external_image.jpg"
              inputFields={[
                {
                  name: "filename_prefix",
                  description: "Prefix for the filename",
                  required: true,
                },
                {
                  name: "file_type",
                  description: "jpg, png, or webp",
                },
                {
                  name: "quality",
                  description: "0-100. 100 is the highest quality. ",
                },
                {
                  name: "output_id",
                  description: "Unique identifier for this output",
                },
              ]}
              onAddNode={() => {
                sendEventToCD("add_node", {
                  type: "ComfyDeployOutputImage",
                });
              }}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="text">
          <AccordionTrigger className="text-sm">
            Text Processing
          </AccordionTrigger>
          <AccordionContent>
            Yes. It comes with default styles that matches the other
            components&apos; aesthetic.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="number">
          <AccordionTrigger className="text-sm">
            Number Handling
          </AccordionTrigger>
          <AccordionContent>
            Yes. It&apos;s animated by default, but you can disable it if you
            prefer.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="media">
          <AccordionTrigger className="text-sm">Media</AccordionTrigger>
          <AccordionContent>
            Yes. It&apos;s animated by default, but you can disable it if you
            prefer.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="generate">
          <AccordionTrigger className="text-sm">
            Model & Generation Control
          </AccordionTrigger>
          <AccordionContent>
            Yes. It&apos;s animated by default, but you can disable it if you
            prefer.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="type">
          <AccordionTrigger className="text-sm">Basic Types</AccordionTrigger>
          <AccordionContent>
            Yes. It&apos;s animated by default, but you can disable it if you
            prefer.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

interface InputField {
  name: string;
  description: string;
  required?: boolean;
}

interface BadgeConfig {
  icon?: any;
  text: string;
  variant?: string;
}

interface NodeDocsTooltipProps {
  title: string;
  description?: string;
  badges: BadgeConfig[];
  imageUrl?: string;
  inputFields: InputField[];
  alertTitle?: string;
  alertDescription?: string;
  onAddNode?: () => void;
}

function NodeDocsTooltip({
  title,
  description,
  badges = [{ text: "Input", icon: FileInput, variant: "orange" }],
  imageUrl,
  inputFields,
  alertTitle,
  alertDescription,
  onAddNode,
}: NodeDocsTooltipProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex cursor-auto items-center justify-between rounded-[8px] p-2 transition-colors hover:bg-gray-100">
            <div className="flex items-center gap-2">
              <span className="font-medium text-xs">{title}</span>
              {badges.map((badge, index) => {
                const BadgeIcon = badge.icon;
                return (
                  <Badge
                    key={`${badge.text}-${index}`}
                    variant={badge.variant || "orange"}
                    className="flex items-center gap-1"
                  >
                    {BadgeIcon && <BadgeIcon className="h-3.5 w-3.5" />}
                    {badge.text}
                  </Badge>
                );
              })}
            </div>

            <Button size="xs" className="gap-1" onClick={onAddNode}>
              Add node <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          sideOffset={15}
          className="flex max-w-[400px] flex-col gap-2 border-none p-0"
        >
          {imageUrl && (
            <img
              src={imageUrl}
              alt={title}
              className="w-full rounded-t-[10px]"
            />
          )}
          {description && (
            <>
              <p className="mt-2 px-4 text-gray-600 text-xs leading-5">
                {description}
              </p>
              <Separator className="mx-auto my-2 max-w-20" />
            </>
          )}
          <div className="flex flex-col gap-2 p-3 pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="h-8 w-[120px] pl-1 text-xs">
                    Input
                  </TableHead>
                  <TableHead className="h-8 pl-1 text-xs">
                    Description
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inputFields.map((field) => (
                  <TableRow key={field.name}>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {field.name}
                        </span>
                        {field.required && (
                          <Badge variant="rose" className="!text-[11px] py-0">
                            Required
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-pre-line text-xs leading-5">
                      {field.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {alertTitle && (
              <Alert className="max-w-[400px] border-l-2 border-l-orange-500 bg-orange-50">
                <AlertCircle className="!text-orange-500 h-3.5 w-3.5" />
                <AlertTitle>{alertTitle}</AlertTitle>
                {alertDescription && (
                  <AlertDescription className="text-gray-600 text-xs leading-snug">
                    {alertDescription}
                  </AlertDescription>
                )}
              </Alert>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
