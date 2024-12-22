import { z } from "zod";

export const Model = z.object({
  name: z.string(),
  type: z.string(),
  base: z.string(),
  save_path: z.string(),
  description: z.string(),
  reference: z.string(),
  filename: z.string(),
  url: z.string(),
});

export const CivitalModelSchema = z.object({
  items: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
      type: z.string(),
      creator: z
        .object({
          username: z.string().nullish(),
          image: z.string().nullish().default(null),
        })
        .nullish(),
      tags: z.array(z.string()).nullish(),
      modelVersions: z.array(
        z.object({
          id: z.number().nullish(),
          modelId: z.number().nullish(),
          name: z.string().nullish(),
          createdAt: z.string().nullish(),
          updatedAt: z.string().nullish(),
          status: z.string().nullish(),
          publishedAt: z.string().nullish(),
          trainedWords: z.array(z.unknown()).nullish(),
          trainingStatus: z.string().nullish(),
          trainingDetails: z.string().nullish(),
          baseModel: z.string().nullish(),
          baseModelType: z.string().nullish(),
          earlyAccessTimeFrame: z.number().nullish(),
          description: z.string().nullish(),
          vaeId: z.number().nullish(),
          stats: z
            .object({
              downloadCount: z.number().nullish(),
              ratingCount: z.number().nullish(),
              rating: z.number().nullish(),
            })
            .nullish(),
          files: z.array(
            z
              .object({
                id: z.number().nullish(),
                sizeKB: z.number().nullish(),
                name: z.string().nullish(),
                type: z.string().nullish(),
                downloadUrl: z.string().nullish(),
              })
              .nullish()
          ),
          images: z.array(
            z.object({
              id: z.number().nullish(),
              url: z.string().nullish(),
              nsfw: z.string().nullish(),
              width: z.number().nullish(),
              height: z.number().nullish(),
              hash: z.string().nullish(),
              type: z.string().nullish(),
              metadata: z
                .object({
                  hash: z.string().nullish(),
                  width: z.number().nullish(),
                  height: z.number().nullish(),
                })
                .nullish(),
              meta: z.any().nullish(),
            })
          ),
          downloadUrl: z.string(),
        })
      ),
    })
  ),
  metadata: z
    .object({
      nextCursor: z.string().nullish(),
      nextPage: z.string().optional(),
    })
    .nullish(),
});
export const ModelList = z.array(Model);

export const ModelListWrapper = z.object({
  models: ModelList,
});
