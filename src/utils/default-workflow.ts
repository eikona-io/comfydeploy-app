const sd1_5 = {
  id: "6019867a-604b-4d50-bb6d-26475d9f4aa9",
  revision: 0,
  last_node_id: 14,
  last_link_id: 11,
  nodes: [
    {
      id: 3,
      type: "KSampler",
      pos: [863, 186],
      size: [315, 474],
      flags: {},
      order: 6,
      mode: 0,
      inputs: [
        {
          name: "model",
          type: "MODEL",
          link: 1,
        },
        {
          name: "positive",
          type: "CONDITIONING",
          link: 4,
        },
        {
          name: "negative",
          type: "CONDITIONING",
          link: 6,
        },
        {
          name: "latent_image",
          type: "LATENT",
          link: 2,
        },
      ],
      outputs: [
        {
          name: "LATENT",
          type: "LATENT",
          slot_index: 0,
          links: [7],
        },
      ],
      properties: {
        "Node name for S&R": "KSampler",
      },
      widgets_values: [
        1004563962940012,
        "randomize",
        20,
        8,
        "euler",
        "normal",
        1,
      ],
    },
    {
      id: 8,
      type: "VAEDecode",
      pos: [1209, 188],
      size: [210, 46],
      flags: {},
      order: 7,
      mode: 0,
      inputs: [
        {
          name: "samples",
          type: "LATENT",
          link: 7,
        },
        {
          name: "vae",
          type: "VAE",
          link: 8,
        },
      ],
      outputs: [
        {
          name: "IMAGE",
          type: "IMAGE",
          slot_index: 0,
          links: [9],
        },
      ],
      properties: {
        "Node name for S&R": "VAEDecode",
      },
      widgets_values: [],
    },
    {
      id: 9,
      type: "SaveImage",
      pos: [1451, 189],
      size: [210, 270],
      flags: {},
      order: 8,
      mode: 0,
      inputs: [
        {
          name: "images",
          type: "IMAGE",
          link: 9,
        },
      ],
      outputs: [],
      properties: {},
      widgets_values: ["ComfyUI", ""],
    },
    {
      id: 6,
      type: "CLIPTextEncode",
      pos: [415, 186],
      size: [422.84503173828125, 164.31304931640625],
      flags: {},
      order: 4,
      mode: 0,
      inputs: [
        {
          name: "clip",
          type: "CLIP",
          link: 3,
        },
        {
          name: "text",
          type: "STRING",
          widget: {
            name: "text",
          },
          link: 10,
        },
      ],
      outputs: [
        {
          name: "CONDITIONING",
          type: "CONDITIONING",
          slot_index: 0,
          links: [4],
        },
      ],
      properties: {
        "Node name for S&R": "CLIPTextEncode",
      },
      widgets_values: [
        "beautiful scenery nature glass bottle landscape, , purple galaxy bottle,",
      ],
    },
    {
      id: 7,
      type: "CLIPTextEncode",
      pos: [413, 389],
      size: [425.27801513671875, 180.6060791015625],
      flags: {},
      order: 5,
      mode: 0,
      inputs: [
        {
          name: "clip",
          type: "CLIP",
          link: 5,
        },
        {
          name: "text",
          type: "STRING",
          widget: {
            name: "text",
          },
          link: 11,
        },
      ],
      outputs: [
        {
          name: "CONDITIONING",
          type: "CONDITIONING",
          slot_index: 0,
          links: [6],
        },
      ],
      properties: {
        "Node name for S&R": "CLIPTextEncode",
      },
      widgets_values: ["text, watermark"],
    },
    {
      id: 13,
      type: "ComfyUIDeployExternalText",
      pos: [-84.390625, -61.3984375],
      size: [400, 200],
      flags: {},
      order: 0,
      mode: 0,
      inputs: [],
      outputs: [
        {
          name: "text",
          shape: 3,
          type: "STRING",
          slot_index: 0,
          links: [11],
        },
      ],
      properties: {
        "Node name for S&R": "ComfyUIDeployExternalText",
      },
      widgets_values: ["negative_prompt", "text, watermark", "", ""],
    },
    {
      id: 12,
      type: "ComfyUIDeployExternalText",
      pos: [-81.55859375, 191.56640625],
      size: [400, 200],
      flags: {},
      order: 1,
      mode: 0,
      inputs: [],
      outputs: [
        {
          name: "text",
          shape: 3,
          type: "STRING",
          slot_index: 0,
          links: [10],
        },
      ],
      properties: {
        "Node name for S&R": "ComfyUIDeployExternalText",
      },
      widgets_values: [
        "positive_prompt",
        "beautiful scenery nature glass bottle landscape, , purple galaxy bottle,",
        "",
        "",
      ],
    },
    {
      id: 4,
      type: "CheckpointLoaderSimple",
      pos: [1.1140031814575195, 474.3717956542969],
      size: [315, 98],
      flags: {},
      order: 2,
      mode: 0,
      inputs: [],
      outputs: [
        {
          name: "MODEL",
          type: "MODEL",
          slot_index: 0,
          links: [1],
        },
        {
          name: "CLIP",
          type: "CLIP",
          slot_index: 1,
          links: [3, 5],
        },
        {
          name: "VAE",
          type: "VAE",
          slot_index: 2,
          links: [8],
        },
      ],
      properties: {
        "Node name for S&R": "CheckpointLoaderSimple",
      },
      widgets_values: ["v1-5-pruned-emaonly-fp16.safetensors"],
    },
    {
      id: 5,
      type: "EmptyLatentImage",
      pos: [420.93292236328125, 631.154296875],
      size: [315, 106],
      flags: {},
      order: 3,
      mode: 0,
      inputs: [],
      outputs: [
        {
          name: "LATENT",
          type: "LATENT",
          slot_index: 0,
          links: [2],
        },
      ],
      properties: {
        "Node name for S&R": "EmptyLatentImage",
      },
      widgets_values: [512, 512, 1],
    },
  ],
  links: [
    [1, 4, 0, 3, 0, "MODEL"],
    [2, 5, 0, 3, 3, "LATENT"],
    [3, 4, 1, 6, 0, "CLIP"],
    [4, 6, 0, 3, 1, "CONDITIONING"],
    [5, 4, 1, 7, 0, "CLIP"],
    [6, 7, 0, 3, 2, "CONDITIONING"],
    [7, 3, 0, 8, 0, "LATENT"],
    [8, 4, 2, 8, 1, "VAE"],
    [9, 8, 0, 9, 0, "IMAGE"],
    [10, 12, 0, 6, 1, "STRING"],
    [11, 13, 0, 7, 1, "STRING"],
  ],
  groups: [
    {
      id: 1,
      title: "Input",
      bounding: [
        -115.6541748046875, -153.20025634765625, 463.41796875, 570.1640625,
      ],
      color: "#3f789e",
      font_size: 24,
      flags: {},
    },
  ],
  config: {},
  extra: {
    ds: {
      scale: 1,
      offset: [528.4148452244707, 336.45586524805117],
    },
  },
  version: 0.4,
};

const sd1_5_api = {
  "3": {
    inputs: {
      seed: 1004563962940012,
      steps: 20,
      cfg: 8,
      sampler_name: "euler",
      scheduler: "normal",
      denoise: 1,
      model: ["4", 0],
      positive: ["6", 0],
      negative: ["7", 0],
      latent_image: ["5", 0],
    },
    class_type: "KSampler",
    _meta: {
      title: "KSampler",
    },
  },
  "4": {
    inputs: {
      ckpt_name: "v1-5-pruned-emaonly-fp16.safetensors",
    },
    class_type: "CheckpointLoaderSimple",
    _meta: {
      title: "Load Checkpoint",
    },
  },
  "5": {
    inputs: {
      width: 512,
      height: 512,
      batch_size: 1,
    },
    class_type: "EmptyLatentImage",
    _meta: {
      title: "Empty Latent Image",
    },
  },
  "6": {
    inputs: {
      text: ["12", 0],
      clip: ["4", 1],
    },
    class_type: "CLIPTextEncode",
    _meta: {
      title: "CLIP Text Encode (Prompt)",
    },
  },
  "7": {
    inputs: {
      text: ["13", 0],
      clip: ["4", 1],
    },
    class_type: "CLIPTextEncode",
    _meta: {
      title: "CLIP Text Encode (Prompt)",
    },
  },
  "8": {
    inputs: {
      samples: ["3", 0],
      vae: ["4", 2],
    },
    class_type: "VAEDecode",
    _meta: {
      title: "VAE Decode",
    },
  },
  "9": {
    inputs: {
      filename_prefix: "ComfyUI",
      images: ["8", 0],
    },
    class_type: "SaveImage",
    _meta: {
      title: "Save Image",
    },
  },
  "12": {
    inputs: {
      input_id: "positive_prompt",
      default_value:
        "beautiful scenery nature glass bottle landscape, , purple galaxy bottle,",
      display_name: "",
      description: "",
    },
    class_type: "ComfyUIDeployExternalText",
    _meta: {
      title: "External Text (ComfyUI Deploy)",
    },
  },
  "13": {
    inputs: {
      input_id: "negative_prompt",
      default_value: "text, watermark",
      display_name: "",
      description: "",
    },
    class_type: "ComfyUIDeployExternalText",
    _meta: {
      title: "External Text (ComfyUI Deploy)",
    },
  },
};

export type defaultWorkflowTemplateType = {
  workflowId: string;
  workflowName: string;
  workflowDescription: string;
  workflowJson: string;
  workflowApi?: string;
  workflowImageUrl: string;
  hasEnvironment?: boolean;
};

const workflow_json_flux = {
  id: "7bab0619-4771-4b74-ade1-1d2be5784416",
  extra: {
    ds: {
      scale: 0.6010518407212623,
      offset: [968.1086001473603, 161.1595819834713],
    },
    node_versions: {
      "comfy-core": "0.3.19",
      "comfyui-deploy": "7b734c415aabd51b8bb8fad9fd719055b5ba359d",
    },
    frontendVersion: "1.18.10",
  },
  links: [
    [9, 8, 0, 9, 0, "IMAGE"],
    [45, 30, 1, 6, 0, "CLIP"],
    [46, 30, 2, 8, 1, "VAE"],
    [47, 30, 0, 31, 0, "MODEL"],
    [51, 27, 0, 31, 3, "LATENT"],
    [52, 31, 0, 8, 0, "LATENT"],
    [54, 30, 1, 33, 0, "CLIP"],
    [55, 33, 0, 31, 2, "CONDITIONING"],
    [56, 6, 0, 35, 0, "CONDITIONING"],
    [57, 35, 0, 31, 1, "CONDITIONING"],
    [58, 38, 0, 6, 1, "STRING"],
    [59, 40, 0, 27, 1, "INT"],
    [60, 39, 0, 27, 0, "INT"],
  ],
  nodes: [
    {
      id: 6,
      pos: [384, 192],
      mode: 0,
      size: [422.8500061035156, 164.30999755859375],
      type: "CLIPTextEncode",
      color: "#232",
      flags: {},
      order: 7,
      title: "CLIP Text Encode (Positive Prompt)",
      inputs: [
        { link: 45, name: "clip", type: "CLIP" },
        { link: 58, name: "text", type: "STRING", widget: { name: "text" } },
      ],
      bgcolor: "#353",
      outputs: [
        {
          name: "CONDITIONING",
          type: "CONDITIONING",
          links: [56],
          slot_index: 0,
        },
      ],
      properties: { "Node name for S&R": "CLIPTextEncode" },
      widgets_values: [
        "cute anime girl with massive fluffy fennec ears and a big fluffy tail blonde messy long hair blue eyes wearing a maid outfit with a long black gold leaf pattern dress and a white apron mouth open placing a fancy black forest cake with candles on top of a dinner table of an old dark Victorian mansion lit by candlelight with a bright window to the foggy forest and very expensive stuff everywhere there are paintings on the walls",
      ],
    },
    {
      id: 8,
      pos: [1151, 195],
      mode: 0,
      size: [210, 46],
      type: "VAEDecode",
      flags: {},
      order: 11,
      inputs: [
        { link: 52, name: "samples", type: "LATENT" },
        { link: 46, name: "vae", type: "VAE" },
      ],
      outputs: [{ name: "IMAGE", type: "IMAGE", links: [9], slot_index: 0 }],
      properties: { "Node name for S&R": "VAEDecode" },
      widgets_values: [],
    },
    {
      id: 9,
      pos: [1375, 194],
      mode: 0,
      size: [985.2999877929688, 1060.3800048828125],
      type: "SaveImage",
      flags: {},
      order: 12,
      inputs: [{ link: 9, name: "images", type: "IMAGE" }],
      outputs: [],
      properties: {},
      widgets_values: ["ComfyUI"],
    },
    {
      id: 31,
      pos: [816, 192],
      mode: 0,
      size: [315, 262],
      type: "KSampler",
      flags: {},
      order: 10,
      inputs: [
        { link: 47, name: "model", type: "MODEL" },
        { link: 57, name: "positive", type: "CONDITIONING" },
        { link: 55, name: "negative", type: "CONDITIONING" },
        { link: 51, name: "latent_image", type: "LATENT" },
      ],
      outputs: [{ name: "LATENT", type: "LATENT", links: [52], slot_index: 0 }],
      properties: { "Node name for S&R": "KSampler" },
      widgets_values: [
        1024035737089801,
        "randomize",
        20,
        1,
        "euler",
        "simple",
        1,
      ],
    },
    {
      id: 35,
      pos: [576, 96],
      mode: 0,
      size: [211.60000610351562, 58],
      type: "FluxGuidance",
      flags: {},
      order: 9,
      inputs: [{ link: 56, name: "conditioning", type: "CONDITIONING" }],
      outputs: [
        {
          name: "CONDITIONING",
          type: "CONDITIONING",
          links: [57],
          slot_index: 0,
        },
      ],
      properties: { "Node name for S&R": "FluxGuidance" },
      widgets_values: [3.5],
    },
    {
      id: 37,
      pos: [60, 345],
      mode: 0,
      size: [225, 88],
      type: "MarkdownNote",
      color: "#432",
      flags: {},
      order: 0,
      inputs: [],
      bgcolor: "#653",
      outputs: [],
      properties: {},
      widgets_values: [
        "🛈 [Learn more about this workflow](https://comfyanonymous.github.io/ComfyUI_examples/flux/#flux-dev-1)",
      ],
    },
    {
      id: 34,
      pos: [825, 510],
      mode: 0,
      size: [282.8599853515625, 164.0800018310547],
      type: "Note",
      color: "#432",
      flags: {},
      order: 1,
      inputs: [],
      bgcolor: "#653",
      outputs: [],
      properties: { text: "" },
      widgets_values: [
        "Note that Flux dev and schnell do not have any negative prompt so CFG should be set to 1.0. Setting CFG to 1.0 means the negative prompt is ignored.",
      ],
    },
    {
      id: 30,
      pos: [48, 192],
      mode: 0,
      size: [315, 98],
      type: "CheckpointLoaderSimple",
      flags: {},
      order: 2,
      inputs: [],
      outputs: [
        { name: "MODEL", type: "MODEL", links: [47], slot_index: 0 },
        { name: "CLIP", type: "CLIP", links: [45, 54], slot_index: 1 },
        { name: "VAE", type: "VAE", links: [46], slot_index: 2 },
      ],
      properties: { "Node name for S&R": "CheckpointLoaderSimple" },
      widgets_values: ["FLUX1/flux1-dev-fp8.safetensors"],
    },
    {
      id: 33,
      pos: [390, 400],
      mode: 0,
      size: [422.8500061035156, 164.30999755859375],
      type: "CLIPTextEncode",
      color: "#322",
      flags: { collapsed: true },
      order: 6,
      title: "CLIP Text Encode (Negative Prompt)",
      inputs: [{ link: 54, name: "clip", type: "CLIP" }],
      bgcolor: "#533",
      outputs: [
        {
          name: "CONDITIONING",
          type: "CONDITIONING",
          links: [55],
          slot_index: 0,
        },
      ],
      properties: { "Node name for S&R": "CLIPTextEncode" },
      widgets_values: [""],
    },
    {
      id: 27,
      pos: [461.8629455566406, 460.2491149902344],
      mode: 0,
      size: [315, 126],
      type: "EmptySD3LatentImage",
      color: "#323",
      flags: {},
      order: 8,
      inputs: [
        { link: 60, name: "width", type: "INT", widget: { name: "width" } },
        { link: 59, name: "height", type: "INT", widget: { name: "height" } },
      ],
      bgcolor: "#535",
      outputs: [{ name: "LATENT", type: "LATENT", links: [51], slot_index: 0 }],
      properties: { "Node name for S&R": "EmptySD3LatentImage" },
      widgets_values: [1024, 1024, 1],
    },
    {
      id: 38,
      pos: [-497.3238525390625, 306.5517578125],
      mode: 0,
      size: [400, 200],
      type: "ComfyUIDeployExternalText",
      flags: {},
      order: 3,
      inputs: [],
      outputs: [{ name: "text", type: "STRING", links: [58] }],
      properties: { "Node name for S&R": "ComfyUIDeployExternalText" },
      widgets_values: [
        "prompt",
        "cute anime girl with massive fluffy fennec ears and a big fluffy tail blonde messy long hair blue eyes wearing a maid outfit with a long black gold leaf pattern dress and a white apron mouth open placing a fancy black forest cake with candles on top of a dinner table of an old dark Victorian mansion lit by candlelight with a bright window to the foggy forest and very expensive stuff everywhere there are paintings on the walls",
        "Prompt",
        "The prompt to generate an image from.",
      ],
    },
    {
      id: 39,
      pos: [-507.4543762207031, 612.9552001953125],
      mode: 0,
      size: [453.5999755859375, 200],
      type: "ComfyUIDeployExternalNumberInt",
      flags: {},
      order: 4,
      inputs: [],
      outputs: [{ name: "value", type: "INT", links: [60], slot_index: 0 }],
      properties: { "Node name for S&R": "ComfyUIDeployExternalNumberInt" },
      widgets_values: ["width", 1024, "Width", "The width of the image."],
    },
    {
      id: 40,
      pos: [-497.8695068359375, 864.68994140625],
      mode: 0,
      size: [453.5999755859375, 200],
      type: "ComfyUIDeployExternalNumberInt",
      flags: {},
      order: 5,
      inputs: [],
      outputs: [{ name: "value", type: "INT", links: [59], slot_index: 0 }],
      properties: { "Node name for S&R": "ComfyUIDeployExternalNumberInt" },
      widgets_values: ["height", 1024, "Height", "The height of the image."],
    },
  ],
  config: {},
  groups: [
    {
      id: 1,
      color: "#3f789e",
      flags: {},
      title: "Input",
      bounding: [
        -508.010986328125, 186.76593017578125, 453.23040771484375,
        334.3218994140625,
      ],
      font_size: 24,
    },
    {
      id: 2,
      color: "#A88",
      flags: {},
      title: "Additional",
      bounding: [
        -517.1227416992188, 537.53759765625, 644.4954223632812,
        599.2609252929688,
      ],
      font_size: 24,
    },
  ],
  version: 0.4,
  revision: 0,
  last_link_id: 60,
  last_node_id: 40,
  workflow_api: {
    "6": {
      _meta: { title: "CLIP Text Encode (Positive Prompt)" },
      inputs: { clip: ["30", 1], text: ["38", 0] },
      class_type: "CLIPTextEncode",
    },
    "8": {
      _meta: { title: "VAE解码" },
      inputs: { vae: ["30", 2], samples: ["31", 0] },
      class_type: "VAEDecode",
    },
    "9": {
      _meta: { title: "保存图像" },
      inputs: { images: ["8", 0], filename_prefix: "ComfyUI" },
      class_type: "SaveImage",
    },
    "27": {
      _meta: { title: "空Latent图像（SD3）" },
      inputs: { width: ["39", 0], height: ["40", 0], batch_size: 1 },
      class_type: "EmptySD3LatentImage",
    },
    "30": {
      _meta: { title: "Checkpoint加载器（简易）" },
      inputs: { ckpt_name: "FLUX1/flux1-dev-fp8.safetensors" },
      class_type: "CheckpointLoaderSimple",
    },
    "31": {
      _meta: { title: "K采样器" },
      inputs: {
        cfg: 1,
        seed: 1024035737089801,
        model: ["30", 0],
        steps: 20,
        denoise: 1,
        negative: ["33", 0],
        positive: ["35", 0],
        scheduler: "simple",
        latent_image: ["27", 0],
        sampler_name: "euler",
      },
      class_type: "KSampler",
    },
    "33": {
      _meta: { title: "CLIP Text Encode (Negative Prompt)" },
      inputs: { clip: ["30", 1], text: "" },
      class_type: "CLIPTextEncode",
    },
    "35": {
      _meta: { title: "Flux引导" },
      inputs: { guidance: 3.5, conditioning: ["6", 0] },
      class_type: "FluxGuidance",
    },
    "38": {
      _meta: { title: "External Text (ComfyUI Deploy)" },
      inputs: {
        input_id: "prompt",
        description: "The prompt to generate an image from.",
        display_name: "Prompt",
        default_value:
          "cute anime girl with massive fluffy fennec ears and a big fluffy tail blonde messy long hair blue eyes wearing a maid outfit with a long black gold leaf pattern dress and a white apron mouth open placing a fancy black forest cake with candles on top of a dinner table of an old dark Victorian mansion lit by candlelight with a bright window to the foggy forest and very expensive stuff everywhere there are paintings on the walls",
      },
      class_type: "ComfyUIDeployExternalText",
    },
    "39": {
      _meta: { title: "External Number Int (ComfyUI Deploy)" },
      inputs: {
        input_id: "width",
        description: "The width of the image.",
        display_name: "Width",
        default_value: 1024,
      },
      class_type: "ComfyUIDeployExternalNumberInt",
    },
    "40": {
      _meta: { title: "External Number Int (ComfyUI Deploy)" },
      inputs: {
        input_id: "height",
        description: "The height of the image.",
        display_name: "Height",
        default_value: 1024,
      },
      class_type: "ComfyUIDeployExternalNumberInt",
    },
  },
  environment: {
    comfyui_version: "158419f3a0017c2ce123484b14b6c527716d6ec8",
    required_comfy_vesrion: true,
    gpu: "A10G",
    docker_command_steps: { steps: [] },
    max_containers: 1,
    install_custom_node_with_gpu: false,
    run_timeout: 300,
    scaledown_window: 60,
    extra_docker_commands: [],
    base_docker_image: null,
    python_version: null,
    extra_args: null,
    prestart_command: null,
    min_containers: 0,
    machine_hash:
      "d03d1d7971adb9bf990e472e8bb48e2ed7e70aeb2f666b82d88625f089ce1eea",
    disable_metadata: true,
  },
};

const workflow_json_hunyuan3d = {
  id: "70b37042-d37f-4947-aff4-fc95871f4365",
  extra: {
    ds: {
      scale: 0.6115909044841759,
      offset: [1817.8720653658825, 763.2611947154027],
    },
    node_versions: {
      "comfy-core": "0.3.14",
      ComfyUI_essentials: "76e9d1e4399bd025ce8b12c290753d58f9f53e93",
      "ComfyUI-Hunyuan3DWrapper": "d72f2e9f3fdb7907792df1a236853aff91abe6f2",
    },
    frontendVersion: "1.18.10",
    VHS_latentpreview: true,
    VHS_latentpreviewrate: 0,
  },
  links: [
    [30, 28, 0, 35, 0, "DELIGHTMODEL"],
    [57, 35, 0, 45, 0, "IMAGE"],
    [74, 55, 0, 56, 0, "REMBG_SESSION"],
    [86, 59, 0, 17, 0, "HY3DMESH"],
    [99, 64, 0, 35, 1, "IMAGE"],
    [133, 59, 0, 83, 0, "HY3DMESH"],
    [134, 83, 0, 79, 0, "HY3DMESH"],
    [139, 85, 0, 88, 0, "HY3DPAINTMODEL"],
    [142, 79, 1, 88, 3, "IMAGE"],
    [148, 79, 0, 90, 0, "IMAGE"],
    [151, 79, 2, 92, 1, "MESHRENDER"],
    [163, 98, 0, 99, 0, "HY3DMESH"],
    [185, 104, 0, 98, 0, "IMAGE"],
    [192, 88, 0, 111, 0, "IMAGE"],
    [193, 79, 0, 88, 2, "IMAGE"],
    [196, 35, 0, 88, 1, "IMAGE"],
    [199, 79, 1, 116, 0, "IMAGE"],
    [202, 88, 0, 117, 0, "IMAGE"],
    [203, 117, 0, 92, 0, "IMAGE"],
    [204, 119, 0, 118, 0, "UPSCALE_MODEL"],
    [205, 88, 0, 118, 1, "IMAGE"],
    [207, 92, 0, 125, 0, "IMAGE"],
    [209, 104, 0, 127, 0, "IMAGE"],
    [217, 92, 0, 129, 0, "IMAGE"],
    [218, 92, 1, 129, 1, "MASK"],
    [219, 92, 2, 129, 2, "MESHRENDER"],
    [220, 129, 0, 104, 0, "IMAGE"],
    [221, 129, 0, 126, 0, "IMAGE"],
    [222, 129, 1, 104, 1, "MASK"],
    [223, 129, 2, 98, 1, "MESHRENDER"],
    [226, 132, 0, 133, 0, "MASK"],
    [227, 133, 0, 64, 0, "IMAGE"],
    [231, 135, 0, 64, 2, "MASK"],
    [240, 52, 0, 136, 0, "*"],
    [241, 136, 0, 64, 1, "IMAGE"],
    [244, 56, 1, 138, 0, "MASK"],
    [250, 10, 1, 140, 0, "HY3DVAE"],
    [251, 140, 0, 59, 0, "HY3DMESH"],
    [252, 10, 0, 141, 0, "HY3DMODEL"],
    [255, 141, 0, 140, 1, "HY3DLATENT"],
    [256, 52, 0, 142, 0, "*"],
    [257, 142, 0, 56, 1, "IMAGE"],
    [258, 142, 0, 141, 1, "IMAGE"],
    [259, 56, 1, 143, 0, "*"],
    [260, 143, 0, 141, 2, "MASK"],
    [261, 143, 0, 135, 0, "*"],
    [262, 144, 0, 35, 3, "INT"],
    [263, 144, 0, 35, 4, "INT"],
    [264, 144, 0, 88, 7, "INT"],
    [265, 148, 0, 35, 2, "NOISESCHEDULER"],
    [266, 28, 0, 148, 0, "HY3DDIFFUSERSPIPE"],
    [267, 149, 0, 88, 5, "NOISESCHEDULER"],
    [268, 85, 0, 149, 0, "HY3DDIFFUSERSPIPE"],
    [272, 61, 0, 79, 1, "HY3DCAMERA"],
    [273, 61, 0, 88, 4, "HY3DCAMERA"],
    [274, 61, 0, 92, 2, "HY3DCAMERA"],
    [275, 17, 0, 153, 1, "STRING"],
    [276, 99, 0, 154, 1, "STRING"],
    [278, 157, 0, 52, 0, "IMAGE"],
  ],
  nodes: [
    {
      id: 64,
      pos: [-940, 1040],
      mode: 0,
      size: [315, 146],
      type: "ImageCompositeMasked",
      flags: {},
      order: 28,
      inputs: [
        {
          link: 227,
          name: "destination",
          type: "IMAGE",
        },
        {
          link: 241,
          name: "source",
          type: "IMAGE",
        },
        {
          link: 231,
          name: "mask",
          type: "MASK",
          shape: 7,
        },
      ],
      outputs: [
        {
          name: "IMAGE",
          type: "IMAGE",
          links: [99],
          slot_index: 0,
        },
      ],
      properties: {
        "Node name for S&R": "ImageCompositeMasked",
      },
      widgets_values: [0, 0, false],
    },
    {
      id: 83,
      pos: [323.44720458984375, 913.39697265625],
      mode: 0,
      size: [214.20001220703125, 26],
      type: "Hy3DMeshUVWrap",
      flags: {},
      order: 32,
      inputs: [
        {
          link: 133,
          name: "trimesh",
          type: "TRIMESH",
        },
      ],
      outputs: [
        {
          name: "trimesh",
          type: "TRIMESH",
          links: [134],
          slot_index: 0,
        },
      ],
      properties: {
        "Node name for S&R": "Hy3DMeshUVWrap",
      },
      widgets_values: [],
    },
    {
      id: 116,
      pos: [931.2645874023438, 1337.064208984375],
      mode: 0,
      size: [534.0819091796875, 375.8153991699219],
      type: "PreviewImage",
      flags: {},
      order: 38,
      inputs: [
        {
          link: 199,
          name: "images",
          type: "IMAGE",
        },
      ],
      outputs: [],
      properties: {
        "Node name for S&R": "PreviewImage",
      },
      widgets_values: [],
    },
    {
      id: 119,
      pos: [2335.203857421875, 728.801025390625],
      mode: 2,
      size: [315, 58],
      type: "UpscaleModelLoader",
      flags: {},
      order: 0,
      inputs: [],
      outputs: [
        {
          name: "UPSCALE_MODEL",
          type: "UPSCALE_MODEL",
          links: [204],
        },
      ],
      properties: {
        "Node name for S&R": "UpscaleModelLoader",
      },
      widgets_values: ["4x-UltraSharp.pth"],
    },
    {
      id: 98,
      pos: [3778.609130859375, 1248.801025390625],
      mode: 0,
      size: [226.79998779296875, 46],
      type: "Hy3DApplyTexture",
      flags: {},
      order: 47,
      inputs: [
        {
          link: 185,
          name: "texture",
          type: "IMAGE",
        },
        {
          link: 223,
          name: "renderer",
          type: "MESHRENDER",
        },
      ],
      outputs: [
        {
          name: "trimesh",
          type: "TRIMESH",
          links: [163],
          slot_index: 0,
        },
      ],
      properties: {
        "Node name for S&R": "Hy3DApplyTexture",
      },
      widgets_values: [],
    },
    {
      id: 104,
      pos: [3428.609130859375, 1058.801025390625],
      mode: 0,
      size: [239.40000915527344, 102],
      type: "CV2InpaintTexture",
      flags: {},
      order: 46,
      inputs: [
        {
          link: 220,
          name: "texture",
          type: "IMAGE",
        },
        {
          link: 222,
          name: "mask",
          type: "MASK",
        },
      ],
      outputs: [
        {
          name: "texture",
          type: "IMAGE",
          links: [185, 209],
          slot_index: 0,
        },
      ],
      properties: {
        "Node name for S&R": "CV2InpaintTexture",
      },
      widgets_values: [3, "ns"],
    },
    {
      id: 126,
      pos: [3198.609130859375, 1378.801025390625],
      mode: 0,
      size: [491.2337341308594, 523.9635620117188],
      type: "PreviewImage",
      flags: {},
      order: 45,
      title: "Preview Image: vertex inpainted texture",
      inputs: [
        {
          link: 221,
          name: "images",
          type: "IMAGE",
        },
      ],
      outputs: [],
      properties: {
        "Node name for S&R": "PreviewImage",
      },
      widgets_values: [],
    },
    {
      id: 120,
      pos: [2725.203857421875, 738.801025390625],
      mode: 0,
      size: [354.4071044921875, 125.7635726928711],
      type: "Note",
      color: "#432",
      flags: {},
      order: 1,
      inputs: [],
      bgcolor: "#653",
      outputs: [],
      properties: {},
      widgets_values: [
        "You can upscale the multiviews at this point for more texture details",
      ],
    },
    {
      id: 118,
      pos: [2315.634033203125, 851.9907836914062],
      mode: 2,
      size: [340.20001220703125, 46],
      type: "ImageUpscaleWithModel",
      flags: {},
      order: 41,
      inputs: [
        {
          link: 204,
          name: "upscale_model",
          type: "UPSCALE_MODEL",
        },
        {
          link: 205,
          name: "image",
          type: "IMAGE",
        },
      ],
      outputs: [
        {
          name: "IMAGE",
          type: "IMAGE",
          links: null,
        },
      ],
      properties: {
        "Node name for S&R": "ImageUpscaleWithModel",
      },
      widgets_values: [],
    },
    {
      id: 133,
      pos: [-910, 1270],
      mode: 0,
      size: [264.5999755859375, 26],
      type: "MaskToImage",
      flags: {
        collapsed: true,
      },
      order: 16,
      inputs: [
        {
          link: 226,
          name: "mask",
          type: "MASK",
        },
      ],
      outputs: [
        {
          name: "IMAGE",
          type: "IMAGE",
          links: [227],
          slot_index: 0,
        },
      ],
      properties: {
        "Node name for S&R": "MaskToImage",
      },
      widgets_values: [],
    },
    {
      id: 90,
      pos: [354.6097717285156, 1332.690673828125],
      mode: 0,
      size: [534.0819091796875, 375.8153991699219],
      type: "PreviewImage",
      flags: {},
      order: 36,
      inputs: [
        {
          link: 148,
          name: "images",
          type: "IMAGE",
        },
      ],
      outputs: [],
      properties: {
        "Node name for S&R": "PreviewImage",
      },
      widgets_values: [],
    },
    {
      id: 92,
      pos: [2662.9970703125, 1228.801025390625],
      mode: 0,
      size: [302.4000244140625, 66],
      type: "Hy3DBakeFromMultiview",
      flags: {},
      order: 42,
      inputs: [
        {
          link: 203,
          name: "images",
          type: "IMAGE",
        },
        {
          link: 151,
          name: "renderer",
          type: "MESHRENDER",
        },
        {
          link: 274,
          name: "camera_config",
          type: "HY3DCAMERA",
          shape: 7,
        },
      ],
      outputs: [
        {
          name: "texture",
          type: "IMAGE",
          links: [207, 217],
          slot_index: 0,
        },
        {
          name: "mask",
          type: "MASK",
          links: [218],
          slot_index: 1,
        },
        {
          name: "renderer",
          type: "MESHRENDER",
          links: [219],
          slot_index: 2,
        },
      ],
      properties: {
        "Node name for S&R": "Hy3DBakeFromMultiview",
      },
      widgets_values: [],
    },
    {
      id: 129,
      pos: [3060.599365234375, 1227.6019287109375],
      mode: 0,
      size: [277.20001220703125, 66],
      type: "Hy3DMeshVerticeInpaintTexture",
      flags: {},
      order: 44,
      inputs: [
        {
          link: 217,
          name: "texture",
          type: "IMAGE",
        },
        {
          link: 218,
          name: "mask",
          type: "MASK",
        },
        {
          link: 219,
          name: "renderer",
          type: "MESHRENDER",
        },
      ],
      outputs: [
        {
          name: "texture",
          type: "IMAGE",
          links: [220, 221],
        },
        {
          name: "mask",
          type: "MASK",
          links: [222],
        },
        {
          name: "renderer",
          type: "MESHRENDER",
          links: [223],
        },
      ],
      properties: {
        "Node name for S&R": "Hy3DMeshVerticeInpaintTexture",
      },
      widgets_values: [],
    },
    {
      id: 136,
      pos: [-1060, 1060],
      mode: 0,
      size: [75, 26],
      type: "Reroute",
      flags: {},
      order: 20,
      inputs: [
        {
          link: 240,
          name: "",
          type: "*",
        },
      ],
      outputs: [
        {
          name: "",
          type: "IMAGE",
          links: [241],
          slot_index: 0,
        },
      ],
      properties: {
        horizontal: false,
        showOutputText: false,
      },
    },
    {
      id: 135,
      pos: [-1050, 1100],
      mode: 0,
      size: [75, 26],
      type: "Reroute",
      flags: {},
      order: 26,
      inputs: [
        {
          link: 261,
          name: "",
          type: "*",
        },
      ],
      outputs: [
        {
          name: "",
          type: "MASK",
          links: [231],
          slot_index: 0,
        },
      ],
      properties: {
        horizontal: false,
        showOutputText: false,
      },
    },
    {
      id: 55,
      pos: [-312.4496154785156, -786.0094604492188],
      mode: 0,
      size: [340.20001220703125, 82],
      type: "TransparentBGSession+",
      flags: {},
      order: 2,
      inputs: [],
      outputs: [
        {
          name: "REMBG_SESSION",
          type: "REMBG_SESSION",
          links: [74],
          slot_index: 0,
        },
      ],
      properties: {
        "Node name for S&R": "TransparentBGSession+",
      },
      widgets_values: ["base", true],
    },
    {
      id: 138,
      pos: [138.2086639404297, -621.7325439453125],
      mode: 0,
      size: [210, 246],
      type: "MaskPreview+",
      flags: {},
      order: 23,
      inputs: [
        {
          link: 244,
          name: "mask",
          type: "MASK",
        },
      ],
      outputs: [],
      properties: {
        "Node name for S&R": "MaskPreview+",
      },
      widgets_values: [],
    },
    {
      id: 17,
      pos: [308.6851806640625, -259.24041748046875],
      mode: 0,
      size: [315.6768493652344, 106],
      type: "Hy3DExportMesh",
      flags: {},
      order: 31,
      inputs: [
        {
          link: 86,
          name: "trimesh",
          type: "TRIMESH",
        },
      ],
      outputs: [
        {
          name: "glb_path",
          type: "STRING",
          links: [275],
          slot_index: 0,
        },
      ],
      properties: {
        "Node name for S&R": "Hy3DExportMesh",
      },
      widgets_values: ["3D/Hy3D", "glb", true],
    },
    {
      id: 59,
      pos: [301.78021240234375, -124.21797180175781],
      mode: 0,
      size: [315, 174],
      type: "Hy3DPostprocessMesh",
      flags: {},
      order: 29,
      inputs: [
        {
          link: 251,
          name: "trimesh",
          type: "TRIMESH",
        },
        {
          link: null,
          name: "mask",
          type: "MASK",
          shape: 7,
        },
      ],
      outputs: [
        {
          name: "trimesh",
          type: "TRIMESH",
          links: [86, 133],
          slot_index: 0,
        },
      ],
      properties: {
        "Node name for S&R": "Hy3DPostprocessMesh",
      },
      widgets_values: [true, true, true, 50000, false],
    },
    {
      id: 141,
      pos: [-430, 5.956213474273682],
      mode: 0,
      size: [315, 218],
      type: "Hy3DGenerateMesh",
      flags: {},
      order: 25,
      inputs: [
        {
          link: 252,
          name: "pipeline",
          type: "HY3DMODEL",
        },
        {
          link: 258,
          name: "image",
          type: "IMAGE",
        },
        {
          link: 260,
          name: "mask",
          type: "MASK",
          shape: 7,
        },
      ],
      outputs: [
        {
          name: "latents",
          type: "HY3DLATENT",
          links: [255],
        },
      ],
      properties: {
        "Node name for S&R": "Hy3DGenerateMesh",
      },
      widgets_values: [
        5.5,
        50,
        123,
        "fixed",
        "FlowMatchEulerDiscreteScheduler",
        true,
      ],
    },
    {
      id: 142,
      pos: [-649.8002319335938, -400.6730651855469],
      mode: 0,
      size: [75, 26],
      type: "Reroute",
      flags: {},
      order: 21,
      inputs: [
        {
          link: 256,
          name: "",
          type: "*",
        },
      ],
      outputs: [
        {
          name: "",
          type: "IMAGE",
          links: [257, 258],
          slot_index: 0,
        },
      ],
      properties: {
        horizontal: false,
        showOutputText: false,
      },
    },
    {
      id: 56,
      pos: [-316.1974182128906, -643.1515502929688],
      mode: 0,
      size: [327.5999755859375, 46],
      type: "ImageRemoveBackground+",
      flags: {},
      order: 22,
      inputs: [
        {
          link: 74,
          name: "rembg_session",
          type: "REMBG_SESSION",
        },
        {
          link: 257,
          name: "image",
          type: "IMAGE",
        },
      ],
      outputs: [
        {
          name: "IMAGE",
          type: "IMAGE",
          links: [],
          slot_index: 0,
        },
        {
          name: "MASK",
          type: "MASK",
          links: [244, 259],
          slot_index: 1,
        },
      ],
      properties: {
        "Node name for S&R": "ImageRemoveBackground+",
      },
      widgets_values: [],
    },
    {
      id: 143,
      pos: [-699.34765625, -22.30767250061035],
      mode: 0,
      size: [75, 26],
      type: "Reroute",
      flags: {},
      order: 24,
      inputs: [
        {
          link: 259,
          name: "",
          type: "*",
        },
      ],
      outputs: [
        {
          name: "",
          type: "MASK",
          links: [260, 261],
          slot_index: 0,
        },
      ],
      properties: {
        horizontal: false,
        showOutputText: false,
      },
    },
    {
      id: 52,
      pos: [-1104.0650634765625, -401.0750427246094],
      mode: 0,
      size: [315, 218],
      type: "ImageResize+",
      flags: {},
      order: 17,
      inputs: [
        {
          link: 278,
          name: "image",
          type: "IMAGE",
        },
      ],
      outputs: [
        {
          name: "IMAGE",
          type: "IMAGE",
          links: [240, 256],
          slot_index: 0,
        },
        {
          name: "width",
          type: "INT",
          links: null,
        },
        {
          name: "height",
          type: "INT",
          links: null,
        },
      ],
      properties: {
        "Node name for S&R": "ImageResize+",
      },
      widgets_values: [518, 518, "lanczos", "pad", "always", 2],
    },
    {
      id: 132,
      pos: [-590, 1310],
      mode: 0,
      size: [315, 106],
      type: "SolidMask",
      flags: {},
      order: 3,
      inputs: [],
      outputs: [
        {
          name: "MASK",
          type: "MASK",
          links: [226],
          slot_index: 0,
        },
      ],
      properties: {
        "Node name for S&R": "SolidMask",
      },
      widgets_values: [0.8, 512, 512],
    },
    {
      id: 144,
      pos: [1624.705810546875, 745.9616088867188],
      mode: 0,
      size: [260.3999938964844, 84.1800765991211],
      type: "PrimitiveNode",
      flags: {},
      order: 4,
      title: "Primitive: reference image size",
      inputs: [],
      outputs: [
        {
          name: "INT",
          type: "INT",
          links: [262, 263, 264],
          widget: {
            name: "width",
          },
          slot_index: 0,
        },
      ],
      properties: {
        "Run widget replace on values": false,
      },
      widgets_values: [512, "fixed"],
    },
    {
      id: 73,
      pos: [-540, 1140],
      mode: 0,
      size: [259.3616943359375, 99.84209442138672],
      type: "Note",
      color: "#432",
      flags: {},
      order: 5,
      inputs: [],
      bgcolor: "#653",
      outputs: [],
      properties: {},
      widgets_values: [
        "The level of the background affects the delighting a lot, fully black generally doesn't work, too dark makes the image red, fully white can be overbright, adjust the background level to your liking with the mask value level",
      ],
    },
    {
      id: 137,
      pos: [-450, -300],
      mode: 0,
      size: [312.0663146972656, 88],
      type: "Note",
      color: "#432",
      flags: {},
      order: 6,
      inputs: [],
      bgcolor: "#653",
      outputs: [],
      properties: {},
      widgets_values: [
        "https://huggingface.co/Kijai/Hunyuan3D-2_safetensors/blob/main/hunyuan3d-dit-v2-0-fp16.safetensors",
      ],
    },
    {
      id: 146,
      pos: [-1097.3349609375, -139.42422485351562],
      mode: 0,
      size: [312.0663146972656, 88],
      type: "Note",
      color: "#432",
      flags: {},
      order: 7,
      inputs: [],
      bgcolor: "#653",
      outputs: [],
      properties: {},
      widgets_values: [
        "The image encoder used works at 518x518, every input is resized to that automatically, but better to do it here first in controlled fashion",
      ],
    },
    {
      id: 111,
      pos: [1828.6090087890625, 1388.801025390625],
      mode: 0,
      size: [801.6017456054688, 562.7461547851562],
      type: "PreviewImage",
      flags: {},
      order: 39,
      title: "Preview Image: Multiview results",
      inputs: [
        {
          link: 192,
          name: "images",
          type: "IMAGE",
        },
      ],
      outputs: [],
      properties: {
        "Node name for S&R": "PreviewImage",
      },
      widgets_values: [],
    },
    {
      id: 125,
      pos: [2658.609130859375, 1378.801025390625],
      mode: 0,
      size: [503.22430419921875, 521.7835083007812],
      type: "PreviewImage",
      flags: {},
      order: 43,
      title: "Preview Image: Initial baked texture",
      inputs: [
        {
          link: 207,
          name: "images",
          type: "IMAGE",
        },
      ],
      outputs: [],
      properties: {
        "Node name for S&R": "PreviewImage",
      },
      widgets_values: [],
    },
    {
      id: 127,
      pos: [3738.609130859375, 1378.801025390625],
      mode: 0,
      size: [471.61279296875, 520.6934204101562],
      type: "PreviewImage",
      flags: {},
      order: 48,
      title: "Preview Image: fully inpainted texture",
      inputs: [
        {
          link: 209,
          name: "images",
          type: "IMAGE",
        },
      ],
      outputs: [],
      properties: {
        "Node name for S&R": "PreviewImage",
      },
      widgets_values: [],
    },
    {
      id: 99,
      pos: [4053.56396484375, 1224.027099609375],
      mode: 0,
      size: [315, 106],
      type: "Hy3DExportMesh",
      flags: {},
      order: 49,
      inputs: [
        {
          link: 163,
          name: "trimesh",
          type: "TRIMESH",
        },
      ],
      outputs: [
        {
          name: "glb_path",
          type: "STRING",
          links: [276],
          slot_index: 0,
        },
      ],
      properties: {
        "Node name for S&R": "Hy3DExportMesh",
      },
      widgets_values: ["3D/Hy3D_textured", "glb", true],
    },
    {
      id: 88,
      pos: [1917.5408935546875, 897.4906005859375],
      mode: 0,
      size: [311.7241516113281, 274],
      type: "Hy3DSampleMultiView",
      flags: {},
      order: 37,
      inputs: [
        {
          link: 139,
          name: "pipeline",
          type: "HY3DDIFFUSERSPIPE",
        },
        {
          link: 196,
          name: "ref_image",
          type: "IMAGE",
        },
        {
          link: 193,
          name: "normal_maps",
          type: "IMAGE",
        },
        {
          link: 142,
          name: "position_maps",
          type: "IMAGE",
        },
        {
          link: 273,
          name: "camera_config",
          type: "HY3DCAMERA",
          shape: 7,
        },
        {
          link: 267,
          name: "scheduler",
          type: "NOISESCHEDULER",
          shape: 7,
        },
        {
          link: null,
          name: "samples",
          type: "LATENT",
          shape: 7,
        },
        {
          link: 264,
          name: "view_size",
          type: "INT",
          widget: {
            name: "view_size",
          },
        },
      ],
      outputs: [
        {
          name: "image",
          type: "IMAGE",
          links: [192, 202, 205],
          slot_index: 0,
        },
      ],
      properties: {
        "Node name for S&R": "Hy3DSampleMultiView",
      },
      widgets_values: [512, 25, 1024, "fixed", 1],
    },
    {
      id: 35,
      pos: [-560, 870],
      mode: 0,
      size: [278.7183837890625, 222],
      type: "Hy3DDelightImage",
      flags: {},
      order: 30,
      inputs: [
        {
          link: 30,
          name: "delight_pipe",
          type: "HY3DDIFFUSERSPIPE",
        },
        {
          link: 99,
          name: "image",
          type: "IMAGE",
        },
        {
          link: 265,
          name: "scheduler",
          type: "NOISESCHEDULER",
          shape: 7,
        },
        {
          link: 262,
          name: "width",
          type: "INT",
          widget: {
            name: "width",
          },
        },
        {
          link: 263,
          name: "height",
          type: "INT",
          widget: {
            name: "height",
          },
        },
      ],
      outputs: [
        {
          name: "image",
          type: "IMAGE",
          links: [57, 196],
          slot_index: 0,
        },
      ],
      properties: {
        "Node name for S&R": "Hy3DDelightImage",
      },
      widgets_values: [50, 512, 512, 1, 0, "fixed"],
    },
    {
      id: 45,
      pos: [-230, 1110],
      mode: 0,
      size: [370.2379455566406, 396.4273376464844],
      type: "PreviewImage",
      flags: {},
      order: 33,
      inputs: [
        {
          link: 57,
          name: "images",
          type: "IMAGE",
        },
      ],
      outputs: [],
      properties: {
        "Node name for S&R": "PreviewImage",
      },
      widgets_values: [],
    },
    {
      id: 148,
      pos: [-567.3681640625, 726.651611328125],
      mode: 0,
      size: [288.13494873046875, 82],
      type: "Hy3DDiffusersSchedulerConfig",
      flags: {},
      order: 19,
      inputs: [
        {
          link: 266,
          name: "pipeline",
          type: "HY3DDIFFUSERSPIPE",
        },
      ],
      outputs: [
        {
          name: "diffusers_scheduler",
          type: "NOISESCHEDULER",
          links: [265],
        },
      ],
      properties: {
        "Node name for S&R": "Hy3DDiffusersSchedulerConfig",
      },
      widgets_values: ["Euler A", "default"],
    },
    {
      id: 140,
      pos: [-35.7520866394043, -127.73638153076172],
      mode: 0,
      size: [315, 222],
      type: "Hy3DVAEDecode",
      flags: {},
      order: 27,
      inputs: [
        {
          link: 250,
          name: "vae",
          type: "HY3DVAE",
        },
        {
          link: 255,
          name: "latents",
          type: "HY3DLATENT",
        },
      ],
      outputs: [
        {
          name: "trimesh",
          type: "TRIMESH",
          links: [251],
          slot_index: 0,
        },
      ],
      properties: {
        "Node name for S&R": "Hy3DVAEDecode",
      },
      widgets_values: [1.01, 384, 32000, 0, "mc", true, true],
    },
    {
      id: 149,
      pos: [1929.843994140625, 1232.3370361328125],
      mode: 0,
      size: [288.13494873046875, 82],
      type: "Hy3DDiffusersSchedulerConfig",
      flags: {},
      order: 18,
      inputs: [
        {
          link: 268,
          name: "pipeline",
          type: "HY3DDIFFUSERSPIPE",
        },
      ],
      outputs: [
        {
          name: "diffusers_scheduler",
          type: "NOISESCHEDULER",
          links: [267],
          slot_index: 0,
        },
      ],
      properties: {
        "Node name for S&R": "Hy3DDiffusersSchedulerConfig",
      },
      widgets_values: ["Euler A", "default"],
    },
    {
      id: 79,
      pos: [593.6895141601562, 914.635009765625],
      mode: 0,
      size: [342.5999755859375, 170],
      type: "Hy3DRenderMultiView",
      flags: {},
      order: 35,
      inputs: [
        {
          link: 134,
          name: "trimesh",
          type: "TRIMESH",
        },
        {
          link: 272,
          name: "camera_config",
          type: "HY3DCAMERA",
          shape: 7,
        },
      ],
      outputs: [
        {
          name: "normal_maps",
          type: "IMAGE",
          links: [148, 193],
          slot_index: 0,
        },
        {
          name: "position_maps",
          type: "IMAGE",
          links: [142, 199],
          slot_index: 1,
        },
        {
          name: "renderer",
          type: "MESHRENDER",
          links: [151],
        },
        {
          name: "masks",
          type: "MASK",
          links: null,
        },
      ],
      properties: {
        "Node name for S&R": "Hy3DRenderMultiView",
      },
      widgets_values: [1024, 2048, "world"],
    },
    {
      id: 117,
      pos: [2288.609130859375, 958.801025390625],
      mode: 0,
      size: [315, 218],
      type: "ImageResize+",
      flags: {},
      order: 40,
      inputs: [
        {
          link: 202,
          name: "image",
          type: "IMAGE",
        },
      ],
      outputs: [
        {
          name: "IMAGE",
          type: "IMAGE",
          links: [203],
          slot_index: 0,
        },
        {
          name: "width",
          type: "INT",
          links: null,
        },
        {
          name: "height",
          type: "INT",
          links: null,
        },
      ],
      properties: {
        "Node name for S&R": "ImageResize+",
      },
      widgets_values: [2048, 2048, "lanczos", "stretch", "always", 0],
    },
    {
      id: 115,
      pos: [324.2544860839844, 1137.7796630859375],
      mode: 0,
      size: [244.82861328125, 119.78506469726562],
      type: "Note",
      color: "#432",
      flags: {},
      order: 8,
      inputs: [],
      bgcolor: "#653",
      outputs: [],
      properties: {},
      widgets_values: [
        "These are the default camera views used, customizing is fully experimental. To customize.",
      ],
    },
    {
      id: 61,
      pos: [592.6513061523438, 1132.274658203125],
      mode: 0,
      size: [342.9443054199219, 154],
      type: "Hy3DCameraConfig",
      flags: {},
      order: 9,
      inputs: [],
      outputs: [
        {
          name: "camera_config",
          type: "HY3DCAMERA",
          links: [272, 273, 274],
          slot_index: 0,
        },
      ],
      properties: {
        "Node name for S&R": "Hy3DCameraConfig",
      },
      widgets_values: [
        "0, 90, 180, 270, 0, 180",
        "0, 0, 0, 0, 90, -90",
        "1, 0.1, 0.5, 0.1, 0.05, 0.05",
        1.45,
        1.2,
      ],
    },
    {
      id: 153,
      pos: [725.4800415039062, -605.6441650390625],
      mode: 0,
      size: [899.2444458007812, 1024.1732177734375],
      type: "Preview3D",
      flags: {},
      order: 34,
      inputs: [
        {
          link: null,
          name: "camera_info",
          type: "LOAD3D_CAMERA",
          shape: 7,
        },
        {
          link: 275,
          name: "model_file",
          type: "STRING",
          widget: {
            name: "model_file",
          },
        },
      ],
      outputs: [],
      properties: {
        "Camera Info": {
          zoom: 1,
          target: {
            x: 0,
            y: 0,
            z: 0,
          },
          position: {
            x: 10.066904097353866,
            y: 10.066904097353866,
            z: 10.066904097353868,
          },
          cameraType: "perspective",
        },
        "Node name for S&R": "Preview3D",
      },
      widgets_values: ["", ""],
    },
    {
      id: 154,
      pos: [4520, 640],
      mode: 0,
      size: [977.4424438476562, 1298.644287109375],
      type: "Preview3D",
      flags: {},
      order: 50,
      inputs: [
        {
          link: null,
          name: "camera_info",
          type: "LOAD3D_CAMERA",
          shape: 7,
        },
        {
          link: 276,
          name: "model_file",
          type: "STRING",
          widget: {
            name: "model_file",
          },
        },
      ],
      outputs: [],
      properties: {
        "Node name for S&R": "Preview3D",
      },
      widgets_values: ["", ""],
    },
    {
      id: 155,
      pos: [835.9649658203125, -764.7407836914062],
      mode: 0,
      size: [317.4715270996094, 108.64700317382812],
      type: "Note",
      color: "#432",
      flags: {},
      order: 10,
      inputs: [],
      bgcolor: "#653",
      outputs: [],
      properties: {},
      widgets_values: [
        "If the Preview3D node doesn't work, right click on it and select \"fix node\" or re-create the whole node. It's part of ComfyUI and often gets updated causing mismatch with the version that's in the workflow.",
      ],
    },
    {
      id: 156,
      pos: [4580.03173828125, 445.3966064453125],
      mode: 0,
      size: [317.4715270996094, 108.64700317382812],
      type: "Note",
      color: "#432",
      flags: {},
      order: 11,
      inputs: [],
      bgcolor: "#653",
      outputs: [],
      properties: {},
      widgets_values: [
        "If the Preview3D node doesn't work, right click on it and select \"fix node\" or re-create the whole node. It's part of ComfyUI and often gets updated causing mismatch with the version that's in the workflow.",
      ],
    },
    {
      id: 10,
      pos: [-460, -150],
      mode: 0,
      size: [372.8913269042969, 126],
      type: "Hy3DModelLoader",
      flags: {},
      order: 12,
      inputs: [
        {
          link: null,
          name: "compile_args",
          type: "HY3DCOMPILEARGS",
          shape: 7,
        },
      ],
      outputs: [
        {
          name: "pipeline",
          type: "HY3DMODEL",
          links: [252],
          slot_index: 0,
        },
        {
          name: "vae",
          type: "HY3DVAE",
          links: [250],
          slot_index: 1,
        },
      ],
      properties: {
        "Node name for S&R": "Hy3DModelLoader",
      },
      widgets_values: ["hunyuan3d-dit-v2-0-fp16.safetensors", "sdpa", false],
    },
    {
      id: 157,
      pos: [-1084.6236572265625, -824.1287231445312],
      mode: 0,
      size: [309.1890563964844, 366],
      type: "ComfyUIDeployExternalImage",
      flags: {},
      order: 13,
      inputs: [
        {
          link: null,
          name: "default_value",
          type: "IMAGE",
          shape: 7,
        },
      ],
      outputs: [
        {
          name: "image",
          type: "IMAGE",
          links: [278],
        },
      ],
      properties: {
        "Node name for S&R": "ComfyUIDeployExternalImage",
      },
      widgets_values: [
        "input_image",
        "",
        "",
        "https://comfy-deploy-output.s3.us-east-2.amazonaws.com/assets/img_b8w6LweUwR6JxAPG.png",
        "",
      ],
    },
    {
      id: 85,
      pos: [1909.106689453125, 766.966796875],
      mode: 0,
      size: [327.5999755859375, 58],
      type: "DownloadAndLoadHy3DPaintModel",
      flags: {},
      order: 14,
      inputs: [
        {
          link: null,
          name: "compile_args",
          type: "HY3DCOMPILEARGS",
          shape: 7,
        },
      ],
      outputs: [
        {
          name: "multiview_pipe",
          type: "HY3DDIFFUSERSPIPE",
          links: [139, 268],
        },
      ],
      properties: {
        "Node name for S&R": "DownloadAndLoadHy3DPaintModel",
      },
      widgets_values: ["hunyuan3d-paint-v2-0"],
    },
    {
      id: 28,
      pos: [-940, 870],
      mode: 0,
      size: [307.71990966796875, 58],
      type: "DownloadAndLoadHy3DDelightModel",
      flags: {},
      order: 15,
      inputs: [
        {
          link: null,
          name: "compile_args",
          type: "HY3DCOMPILEARGS",
          shape: 7,
        },
      ],
      outputs: [
        {
          name: "delight_pipe",
          type: "HY3DDIFFUSERSPIPE",
          links: [30, 266],
          slot_index: 0,
        },
      ],
      properties: {
        "Node name for S&R": "DownloadAndLoadHy3DDelightModel",
      },
      widgets_values: ["hunyuan3d-delight-v2-0"],
    },
  ],
  config: {},
  groups: [
    {
      id: 1,
      color: "#3f789e",
      flags: {},
      title: "Group",
      bounding: [
        -1168.8038330078125, -876.5914306640625, 2881.048095703125,
        1462.5147705078125,
      ],
      font_size: 24,
    },
    {
      id: 2,
      color: "#b58b2a",
      flags: {},
      title: "Delight",
      bounding: [
        -1166.68408203125, 627.7207641601562, 1369.6767578125, 888.11328125,
      ],
      font_size: 24,
    },
    {
      id: 3,
      color: "#b06634",
      flags: {},
      title: "RenderTextures",
      bounding: [
        216.74928283691406, 632.1493530273438, 1327.30810546875,
        1491.8914794921875,
      ],
      font_size: 24,
    },
    {
      id: 4,
      color: "#a1309b",
      flags: {},
      title: "TextureSampling",
      bounding: [
        1591.5169677734375, 633.6101684570312, 2813.541015625,
        1487.335205078125,
      ],
      font_size: 24,
    },
  ],
  version: 0.4,
  revision: 0,
  last_link_id: 278,
  last_node_id: 157,
  workflow_api: {
    "10": {
      _meta: {
        title: "Hy3DModelLoader",
      },
      inputs: {
        model: "hunyuan3d-dit-v2-0-fp16.safetensors",
        cublas_ops: false,
        attention_mode: "sdpa",
      },
      class_type: "Hy3DModelLoader",
    },
    "17": {
      _meta: {
        title: "Hy3DExportMesh",
      },
      inputs: {
        trimesh: ["59", 0],
        save_file: true,
        file_format: "glb",
        filename_prefix: "3D/Hy3D",
      },
      class_type: "Hy3DExportMesh",
    },
    "28": {
      _meta: {
        title: "(Down)Load Hy3D DelightModel",
      },
      inputs: {
        model: "hunyuan3d-delight-v2-0",
      },
      class_type: "DownloadAndLoadHy3DDelightModel",
    },
    "35": {
      _meta: {
        title: "Hy3DDelightImage",
      },
      inputs: {
        seed: 0,
        image: ["64", 0],
        steps: 50,
        width: 512,
        height: 512,
        cfg_image: 1,
        scheduler: ["148", 0],
        delight_pipe: ["28", 0],
      },
      class_type: "Hy3DDelightImage",
    },
    "45": {
      _meta: {
        title: "预览图像",
      },
      inputs: {
        images: ["35", 0],
      },
      class_type: "PreviewImage",
    },
    "52": {
      _meta: {
        title: "🔧 Image Resize",
      },
      inputs: {
        image: ["157", 0],
        width: 518,
        height: 518,
        method: "pad",
        condition: "always",
        multiple_of: 2,
        interpolation: "lanczos",
      },
      class_type: "ImageResize+",
    },
    "55": {
      _meta: {
        title: "🔧 InSPyReNet TransparentBG",
      },
      inputs: {
        mode: "base",
        use_jit: true,
      },
      class_type: "TransparentBGSession+",
    },
    "56": {
      _meta: {
        title: "🔧 Image Remove Background",
      },
      inputs: {
        image: ["52", 0],
        rembg_session: ["55", 0],
      },
      class_type: "ImageRemoveBackground+",
    },
    "59": {
      _meta: {
        title: "Hy3D Postprocess Mesh",
      },
      inputs: {
        trimesh: ["140", 0],
        max_facenum: 50000,
        reduce_faces: true,
        smooth_normals: false,
        remove_floaters: true,
        remove_degenerate_faces: true,
      },
      class_type: "Hy3DPostprocessMesh",
    },
    "61": {
      _meta: {
        title: "Hy3D Camera Config",
      },
      inputs: {
        ortho_scale: 1.2,
        view_weights: "1, 0.1, 0.5, 0.1, 0.05, 0.05",
        camera_azimuths: "0, 90, 180, 270, 0, 180",
        camera_distance: 1.45,
        camera_elevations: "0, 0, 0, 0, 90, -90",
      },
      class_type: "Hy3DCameraConfig",
    },
    "64": {
      _meta: {
        title: "合成图像（遮罩）",
      },
      inputs: {
        x: 0,
        y: 0,
        mask: ["56", 1],
        source: ["52", 0],
        destination: ["133", 0],
        resize_source: false,
      },
      class_type: "ImageCompositeMasked",
    },
    "79": {
      _meta: {
        title: "Hy3D Render MultiView",
      },
      inputs: {
        trimesh: ["83", 0],
        render_size: 1024,
        normal_space: "world",
        texture_size: 2048,
        camera_config: ["61", 0],
      },
      class_type: "Hy3DRenderMultiView",
    },
    "83": {
      _meta: {
        title: "Hy3D Mesh UV Wrap",
      },
      inputs: {
        trimesh: ["59", 0],
      },
      class_type: "Hy3DMeshUVWrap",
    },
    "85": {
      _meta: {
        title: "(Down)Load Hy3D PaintModel",
      },
      inputs: {
        model: "hunyuan3d-paint-v2-0",
      },
      class_type: "DownloadAndLoadHy3DPaintModel",
    },
    "88": {
      _meta: {
        title: "Hy3D Sample MultiView",
      },
      inputs: {
        seed: 1024,
        steps: 25,
        pipeline: ["85", 0],
        ref_image: ["35", 0],
        scheduler: ["149", 0],
        view_size: 512,
        normal_maps: ["79", 0],
        camera_config: ["61", 0],
        position_maps: ["79", 1],
        denoise_strength: 1,
      },
      class_type: "Hy3DSampleMultiView",
    },
    "90": {
      _meta: {
        title: "预览图像",
      },
      inputs: {
        images: ["79", 0],
      },
      class_type: "PreviewImage",
    },
    "92": {
      _meta: {
        title: "Hy3D Bake From Multiview",
      },
      inputs: {
        images: ["117", 0],
        renderer: ["79", 2],
        camera_config: ["61", 0],
      },
      class_type: "Hy3DBakeFromMultiview",
    },
    "98": {
      _meta: {
        title: "Hy3D Apply Texture",
      },
      inputs: {
        texture: ["104", 0],
        renderer: ["129", 2],
      },
      class_type: "Hy3DApplyTexture",
    },
    "99": {
      _meta: {
        title: "Hy3DExportMesh",
      },
      inputs: {
        trimesh: ["98", 0],
        save_file: true,
        file_format: "glb",
        filename_prefix: "3D/Hy3D_textured",
      },
      class_type: "Hy3DExportMesh",
    },
    "104": {
      _meta: {
        title: "CV2 Inpaint Texture",
      },
      inputs: {
        mask: ["129", 1],
        texture: ["129", 0],
        inpaint_method: "ns",
        inpaint_radius: 3,
      },
      class_type: "CV2InpaintTexture",
    },
    "111": {
      _meta: {
        title: "Preview Image: Multiview results",
      },
      inputs: {
        images: ["88", 0],
      },
      class_type: "PreviewImage",
    },
    "116": {
      _meta: {
        title: "预览图像",
      },
      inputs: {
        images: ["79", 1],
      },
      class_type: "PreviewImage",
    },
    "117": {
      _meta: {
        title: "🔧 Image Resize",
      },
      inputs: {
        image: ["88", 0],
        width: 2048,
        height: 2048,
        method: "stretch",
        condition: "always",
        multiple_of: 0,
        interpolation: "lanczos",
      },
      class_type: "ImageResize+",
    },
    "125": {
      _meta: {
        title: "Preview Image: Initial baked texture",
      },
      inputs: {
        images: ["92", 0],
      },
      class_type: "PreviewImage",
    },
    "126": {
      _meta: {
        title: "Preview Image: vertex inpainted texture",
      },
      inputs: {
        images: ["129", 0],
      },
      class_type: "PreviewImage",
    },
    "127": {
      _meta: {
        title: "Preview Image: fully inpainted texture",
      },
      inputs: {
        images: ["104", 0],
      },
      class_type: "PreviewImage",
    },
    "129": {
      _meta: {
        title: "Hy3D Mesh Vertice Inpaint Texture",
      },
      inputs: {
        mask: ["92", 1],
        texture: ["92", 0],
        renderer: ["92", 2],
      },
      class_type: "Hy3DMeshVerticeInpaintTexture",
    },
    "132": {
      _meta: {
        title: "纯块遮罩",
      },
      inputs: {
        value: 0.8,
        width: 512,
        height: 512,
      },
      class_type: "SolidMask",
    },
    "133": {
      _meta: {
        title: "遮罩转换为图像",
      },
      inputs: {
        mask: ["132", 0],
      },
      class_type: "MaskToImage",
    },
    "138": {
      _meta: {
        title: "🔧 Mask Preview",
      },
      inputs: {
        mask: ["56", 1],
      },
      class_type: "MaskPreview+",
    },
    "140": {
      _meta: {
        title: "Hy3D VAE Decode",
      },
      inputs: {
        vae: ["10", 1],
        box_v: 1.01,
        latents: ["141", 0],
        mc_algo: "mc",
        mc_level: 0,
        num_chunks: 32000,
        force_offload: true,
        enable_flash_vdm: true,
        octree_resolution: 384,
      },
      class_type: "Hy3DVAEDecode",
    },
    "141": {
      _meta: {
        title: "Hy3DGenerateMesh",
      },
      inputs: {
        mask: ["56", 1],
        seed: 123,
        image: ["52", 0],
        steps: 50,
        pipeline: ["10", 0],
        scheduler: "FlowMatchEulerDiscreteScheduler",
        force_offload: true,
        guidance_scale: 5.5,
      },
      class_type: "Hy3DGenerateMesh",
    },
    "148": {
      _meta: {
        title: "Hy3D Diffusers Scheduler Config",
      },
      inputs: {
        sigmas: "default",
        pipeline: ["28", 0],
        scheduler: "Euler A",
      },
      class_type: "Hy3DDiffusersSchedulerConfig",
    },
    "149": {
      _meta: {
        title: "Hy3D Diffusers Scheduler Config",
      },
      inputs: {
        sigmas: "default",
        pipeline: ["85", 0],
        scheduler: "Euler A",
      },
      class_type: "Hy3DDiffusersSchedulerConfig",
    },
    "153": {
      _meta: {
        title: "预览3D",
      },
      inputs: {
        image: "",
        model_file: ["17", 0],
      },
      class_type: "Preview3D",
    },
    "154": {
      _meta: {
        title: "预览3D",
      },
      inputs: {
        image: "",
        model_file: ["99", 0],
      },
      class_type: "Preview3D",
    },
    "157": {
      _meta: {
        title: "External Image (ComfyUI Deploy)",
      },
      inputs: {
        input_id: "input_image",
        description: "",
        display_name: "",
        default_value_url:
          "https://comfy-deploy-output.s3.us-east-2.amazonaws.com/assets/img_b8w6LweUwR6JxAPG.png",
      },
      class_type: "ComfyUIDeployExternalImage",
    },
  },
  environment: {
    comfyui_version: "094306b626e9cf505690c5d8b445032b3b8a36fa",
    gpu: "L40S",
    docker_command_steps: {
      steps: [
        {
          id: "d8665947-0",
          data: "# PARSE DOCKER FILE\nFROM nvidia/cuda:12.6.3-cudnn-devel-ubuntu22.04\nENV TORCH_CUDA_ARCH_LIST=8.9",
          type: "commands",
        },
        {
          id: "b68a6f5d-d-ubuntu24",
          data: "RUN apt-get update && \\\n    apt-get install -yq --no-install-recommends \\\n    build-essential \\\n    git \\\n    git-lfs \\\n    curl \\\n    ninja-build \\\n    ffmpeg \\\n    poppler-utils \\\n    aria2 \\\n    python3-dev \\\n    python3-pip \\\n    software-properties-common \\\n    && apt-get clean \\\n    && rm -rf /var/lib/apt/lists/*\n",
          type: "commands",
        },
        {
          id: "ad1481ee-0",
          data: "# GCC\nRUN apt-get update && \\\n    apt-get install -yq --no-install-recommends \\\n        build-essential \\\n        g++ \\\n        gcc-12 \\\n        g++-12 && \\\n    apt-get clean && \\\n    rm -rf /var/lib/apt/lists/*\n\n\nRUN pip3 install --upgrade pip setuptools wheel",
          type: "commands",
        },
        {
          id: "0e80dd22-9",
          data: '# SET ENVS\n\nENV CUDA_HOME=/usr/local/cuda\nENV PATH=${CUDA_HOME}/bin:${PATH}\nENV LD_LIBRARY_PATH=${CUDA_HOME}/lib64:${LD_LIBRARY_PATH}\nENV CUDA_LAUNCH_BLOCKING=1\nENV TORCH_USE_CUDA_DSA=1\n\nENV TORCH_CUDA_FLAGS="--allow-unsupported-compiler"\nENV CC=/usr/bin/gcc-12\nENV CXX=/usr/bin/g++-12',
          type: "commands",
        },
        {
          id: "a53fb461-1",
          data: "RUN pip install --pre -U xformers torch torchvision torchaudio --index-url https://download.pytorch.org/whl/nightly/cu128",
          type: "commands",
        },
        {
          id: "triton-install",
          data: "# install Triton\nRUN pip install triton\nRUN pip install sageattention\n#RUN MAX_JOBS=4 pip install flash-attn --no-build-isolation",
          type: "commands",
        },
        {
          id: "bnb-env-setup",
          data: "# SET COMPILE\nENV USE_COMPILE_API=1\nENV CUDA_VISIBLE_DEVICES=0",
          type: "commands",
        },
        {
          id: "verify-core",
          data: "# Print\nRUN python3 -c \"import torch; print('PyTorch version:', torch.__version__); print('CUDA available:', torch.cuda.is_available()); print('CUDA version:', torch.version.cuda)\"",
          type: "commands",
        },
        {
          id: "d1780483-6",
          data: {
            url: "https://github.com/kijai/ComfyUI-KJNodes",
            hash: "52c2e31a903fec2dd654fb614ea82ba2757d5028",
            meta: {
              message: "rename CFGZeroStar to avoid conflict",
              committer: {
                date: "2025-03-26T10:29:56.000Z",
                name: "kijai",
                email: "40791699+kijai@users.noreply.github.com",
              },
              commit_url:
                "https://github.com/kijai/ComfyUI-KJNodes/commit/52c2e31a903fec2dd654fb614ea82ba2757d5028",
              latest_hash: "52c2e31a903fec2dd654fb614ea82ba2757d5028",
              stargazers_count: 1090,
            },
            name: "KJNodes for ComfyUI",
            files: [],
            install_type: "git-clone",
          },
          type: "custom-node",
        },
        {
          id: "1dc0e908-e",
          data: "#Moars\nWORKDIR /comfyui/custom_nodes\n \nRUN git clone --recurse-submodules https://github.com/kijai/ComfyUI-Hunyuan3DWrapper.git && \\\n    cd ComfyUI-Hunyuan3DWrapper && \\\n    pip install -r requirements.txt && \\\n    cd hy3dgen/texgen/custom_rasterizer && \\\n    python setup.py install && \\\n    cd ../../../ && \\\n    cd hy3dgen/texgen/custom_rasterizer && \\\n    python setup.py install",
          type: "commands",
        },
        {
          id: "35b86f8b-0",
          data: {
            url: "https://github.com/807502278/ComfyUI-WJNodes",
            hash: "9b1876b0521acbee6423c70b6e5574c9241b52ae",
            meta: {
              message: "Remove printing test information",
              committer: {
                date: "2025-03-27T11:23:48.000Z",
                name: "807502278",
                email: "807502278@qq.com",
              },
              latest_hash: "9b1876b0521acbee6423c70b6e5574c9241b52ae",
            },
            name: "ComfyUI-WJNodes",
            files: ["https://github.com/807502278/ComfyUI-WJNodes"],
            install_type: "git-clone",
          },
          type: "custom-node",
        },
        {
          id: "a4908cbd-0",
          data: {
            url: "https://github.com/cubiq/ComfyUI_essentials",
            hash: "33ff89fd354d8ec3ab6affb605a79a931b445d99",
            meta: {
              message: "interpolate_pos_encoding is not True by default",
              committer: {
                date: "2024-12-07T09:40:22.000Z",
                name: "cubiq",
                email: "matteo@elf.io",
              },
              latest_hash: "33ff89fd354d8ec3ab6affb605a79a931b445d99",
            },
            name: "ComfyUI_essentials",
            files: ["https://github.com/cubiq/ComfyUI_essentials"],
            install_type: "git-clone",
          },
          type: "custom-node",
        },
        {
          id: "e9e91d5e-2",
          data: {
            url: "https://github.com/BennyKok/comfyui-deploy",
            hash: "b889f79baf9e099d5e54bd20bab4aa1e7c3296c0",
            meta: {
              message: "Merge branch 'benny/support-comfy-api-key'",
              committer: {
                date: "2025-05-12T09:06:08.000Z",
                name: "BennyKok",
                email: "itechbenny@gmail.com",
              },
              latest_hash: "b889f79baf9e099d5e54bd20bab4aa1e7c3296c0",
            },
            name: "comfyui-deploy",
            files: ["https://github.com/BennyKok/comfyui-deploy"],
            install_type: "git-clone",
          },
          type: "custom-node",
        },
      ],
    },
    max_containers: 1,
    install_custom_node_with_gpu: false,
    run_timeout: 300,
    scaledown_window: 60,
    extra_docker_commands: null,
    base_docker_image: "nvidia/cuda:12.6.3-cudnn-devel-ubuntu22.04",
    python_version: "3.12",
    extra_args: null,
    prestart_command: null,
    min_containers: 0,
    machine_hash:
      "21ee31c943968cf30362b59ec49682852e7a28826f429da065c1e25582e67146",
    disable_metadata: true,
  },
};

const bagel_workflow = {
  id: "4d670fa5-e222-4474-b3e5-6c3f211659a8",
  extra: {
    ds: {
      scale: 1.155889959860239,
      offset: [-1736.9676847430605, -988.4071267851009],
    },
    frontendVersion: "1.20.7",
    VHS_MetadataImage: true,
    VHS_latentpreview: false,
    VHS_KeepIntermediate: true,
    VHS_latentpreviewrate: 0,
  },
  links: [
    [1, 1, 0, 2, 0, "BAGEL_MODEL"],
    [3, 2, 1, 4, 0, "STRING"],
    [9, 1, 0, 7, 0, "BAGEL_MODEL"],
    [12, 7, 0, 9, 0, "STRING"],
    [29, 1, 0, 26, 0, "BAGEL_MODEL"],
    [31, 26, 1, 28, 0, "STRING"],
    [32, 30, 0, 2, 1, "STRING"],
    [35, 1, 0, 20, 0, "BAGEL_MODEL"],
    [36, 31, 0, 20, 2, "STRING"],
    [37, 32, 0, 7, 2, "STRING"],
    [38, 19, 0, 33, 0, "IMAGE"],
    [39, 33, 0, 20, 1, "IMAGE"],
    [40, 20, 0, 34, 0, "IMAGE"],
    [41, 7, 0, 26, 1, "STRING"],
    [42, 23, 0, 35, 0, "IMAGE"],
    [43, 35, 0, 7, 1, "IMAGE"],
    [45, 2, 0, 37, 0, "IMAGE"],
    [51, 26, 0, 42, 0, "IMAGE"],
    [58, 51, 0, 47, 0, "IMAGE"],
    [59, 51, 1, 49, 0, "STRING"],
    [62, 48, 0, 51, 1, "STRING"],
    [63, 51, 0, 53, 0, "IMAGE"],
    [64, 1, 0, 51, 0, "BAGEL_MODEL"],
    [65, 45, 0, 26, 2, "INT"],
    [66, 45, 0, 20, 3, "INT"],
    [67, 45, 0, 2, 2, "INT"],
    [68, 45, 0, 51, 2, "INT"],
    [69, 2, 0, 46, 0, "IMAGE"],
    [70, 4, 0, 39, 0, "STRING"],
    [71, 9, 0, 38, 0, "STRING"],
    [72, 20, 1, 54, 0, "STRING"],
    [73, 54, 0, 41, 0, "STRING"],
    [74, 49, 0, 50, 0, "STRING"],
    [75, 28, 0, 40, 0, "STRING"],
  ],
  nodes: [
    {
      id: 35,
      pos: [1790.7972412109375, 63.095176696777344],
      mode: 0,
      size: [309.1890563964844, 154],
      type: "ComfyUIDeployExternalImage",
      flags: {},
      order: 8,
      inputs: [
        {
          link: 42,
          name: "default_value",
          type: "IMAGE",
          shape: 7,
        },
      ],
      outputs: [
        {
          name: "image",
          type: "IMAGE",
          links: [43],
        },
      ],
      properties: {
        "Node name for S&R": "ComfyUIDeployExternalImage",
      },
      widgets_values: [
        "ivl_img_input",
        "image-understanding-input",
        "",
        "",
        "",
      ],
    },
    {
      id: 34,
      pos: [3220.90380859375, 1188.750244140625],
      mode: 0,
      size: [281.9683532714844, 342],
      type: "ComfyDeployOutputImage",
      flags: {},
      order: 22,
      inputs: [
        {
          link: 40,
          name: "images",
          type: "IMAGE",
        },
      ],
      outputs: [],
      properties: {
        "Node name for S&R": "ComfyDeployOutputImage",
      },
      widgets_values: ["ComfyUI", "jpg", 90, "output_i2i"],
    },
    {
      id: 39,
      pos: [3191.69873046875, -455.1521301269531],
      mode: 0,
      size: [270, 106],
      type: "ComfyDeployOutputText",
      flags: {},
      order: 24,
      inputs: [
        {
          link: 70,
          name: "text",
          type: "STRING",
        },
      ],
      outputs: [],
      properties: {
        "Node name for S&R": "ComfyDeployOutputText",
      },
      widgets_values: ["ComfyUI", "txt", "output_t2i_thinking"],
    },
    {
      id: 40,
      pos: [3105.32080078125, 515.3018798828125],
      mode: 0,
      size: [270, 106],
      type: "ComfyDeployOutputText",
      flags: {},
      order: 30,
      inputs: [
        {
          link: 75,
          name: "text",
          type: "STRING",
        },
      ],
      outputs: [],
      properties: {
        "Node name for S&R": "ComfyDeployOutputText",
      },
      widgets_values: ["ComfyUI", "txt", "output_understanding_thinking"],
    },
    {
      id: 33,
      pos: [2307.723876953125, 1204.6800537109375],
      mode: 0,
      size: [309.1890563964844, 154],
      type: "ComfyUIDeployExternalImage",
      flags: {},
      order: 9,
      inputs: [
        {
          link: 38,
          name: "default_value",
          type: "IMAGE",
          shape: 7,
        },
      ],
      outputs: [
        {
          name: "image",
          type: "IMAGE",
          links: [39],
        },
      ],
      properties: {
        "Node name for S&R": "ComfyUIDeployExternalImage",
      },
      widgets_values: ["i2i_img_input", "edit-image-input", "", "", ""],
    },
    {
      id: 23,
      pos: [1412.9571533203125, 61.397342681884766],
      mode: 0,
      size: [274.080078125, 314.0000305175781],
      type: "LoadImage",
      flags: {},
      order: 0,
      inputs: [],
      outputs: [
        {
          name: "IMAGE",
          type: "IMAGE",
          links: [42],
        },
        {
          name: "MASK",
          type: "MASK",
          links: null,
        },
      ],
      properties: {
        "Node name for S&R": "LoadImage",
      },
      widgets_values: ["1ca61801-5b3a-4e43-bcc1-e64d4f0b0fb4.jpeg", "image"],
    },
    {
      id: 41,
      pos: [3243.80078125, 1597.9720458984375],
      mode: 0,
      size: [270, 106],
      type: "ComfyDeployOutputText",
      flags: {},
      order: 29,
      inputs: [
        {
          link: 73,
          name: "text",
          type: "STRING",
        },
      ],
      outputs: [],
      properties: {
        "Node name for S&R": "ComfyDeployOutputText",
      },
      widgets_values: ["ComfyUI", "txt", "output_i2i_thinking"],
    },
    {
      id: 48,
      pos: [1683.343505859375, 2556.740478515625],
      mode: 0,
      size: [400, 200],
      type: "ComfyUIDeployExternalText",
      flags: {},
      order: 1,
      inputs: [],
      outputs: [
        {
          name: "text",
          type: "STRING",
          links: [62],
        },
      ],
      properties: {
        "Node name for S&R": "ComfyUIDeployExternalText",
      },
      widgets_values: [
        "prompt_anim",
        "Create a 3d animation of a turtle racing a rabbit aesops fables illustration for childrens",
        "generate-anim-Prompt",
        "",
      ],
    },
    {
      id: 50,
      pos: [3379.82080078125, 2622.69189453125],
      mode: 0,
      size: [270, 106],
      type: "ComfyDeployOutputText",
      flags: {},
      order: 25,
      inputs: [
        {
          link: 74,
          name: "text",
          type: "STRING",
        },
      ],
      outputs: [],
      properties: {
        "Node name for S&R": "ComfyDeployOutputText",
      },
      widgets_values: ["ComfyUI", "txt", "output_anim_thinking"],
    },
    {
      id: 53,
      pos: [3043.62353515625, 2231.145751953125],
      mode: 0,
      size: [281.9683532714844, 342],
      type: "ComfyDeployOutputImage",
      flags: {},
      order: 18,
      inputs: [
        {
          link: 63,
          name: "images",
          type: "IMAGE",
        },
      ],
      outputs: [],
      properties: {
        "Node name for S&R": "ComfyDeployOutputImage",
      },
      widgets_values: ["ComfyUI", "jpg", 90, "output_anim"],
    },
    {
      id: 1,
      pos: [1739.8939208984375, -694.58203125],
      mode: 0,
      size: [315, 106],
      type: "BagelModelLoader",
      flags: {},
      order: 2,
      inputs: [],
      outputs: [
        {
          name: "model",
          type: "BAGEL_MODEL",
          label: "model",
          links: [1, 9, 29, 35, 64],
        },
      ],
      properties: {
        ver: "4bb49e5232604e4838463f130b3ba7026e428c1d",
        aux_id: "neverbiasu/ComfyUI-Bagel",
        "Node name for S&R": "BagelModelLoader",
      },
      widgets_values: ["models/BAGEL-7B-MoT", "bfloat16"],
    },
    {
      id: 46,
      pos: [2537.99755859375, -406.5367126464844],
      mode: 0,
      size: [270, 270],
      type: "SaveImage",
      flags: {},
      order: 15,
      inputs: [
        {
          link: 69,
          name: "images",
          type: "IMAGE",
        },
      ],
      outputs: [],
      properties: {},
      widgets_values: ["ComfyUI"],
    },
    {
      id: 37,
      pos: [3502.0390625, -561.8967895507812],
      mode: 0,
      size: [281.9683532714844, 342],
      type: "ComfyDeployOutputImage",
      flags: {},
      order: 14,
      inputs: [
        {
          link: 45,
          name: "images",
          type: "IMAGE",
        },
      ],
      outputs: [],
      properties: {
        "Node name for S&R": "ComfyDeployOutputImage",
      },
      widgets_values: ["ComfyUI", "jpg", 90, "output_t2i"],
    },
    {
      id: 4,
      pos: [2849.72265625, -448.93878173828125],
      mode: 0,
      size: [295.9617614746094, 404.6077880859375],
      type: "ShowText|pysssss",
      flags: {
        collapsed: false,
      },
      order: 16,
      inputs: [
        {
          link: 3,
          name: "text",
          type: "STRING",
          label: "text",
        },
      ],
      outputs: [
        {
          name: "STRING",
          type: "STRING",
          label: "STRING",
          links: [70],
          shape: 6,
        },
      ],
      properties: {
        ver: "1.2.5",
        cnr_id: "comfyui-custom-scripts",
        "Node name for S&R": "ShowText|pysssss",
      },
      widgets_values: [
        "<think>\nThe image should depict an elderly samurai in traditional Japanese attire, surrounded by autumnal elements like falling leaves and a serene garden setting, with a calm and reflective mood.\nThe comprehensive prompt is: An elderly samurai standing in a tranquil autumn garden, dressed in a weathered kimono with deep crimson and muted gold tones, his face lined with age and wisdom. He grips a sheathed katana with calm reverence, surrounded by gently falling maple leaves and a small koi pond reflecting the amber twilight. The atmosphere is serene and nostalgic, evoking honor, memory, and quiet strength. The scene is bathed in soft, warm lighting, with rich autumnal colors and a peaceful, timeless mood. Ultra-realistic details emphasize the texture of the kimono, the delicate motion of the leaves, and the subtle ripples in the pond, creating a harmonious and evocative composition.\n</think>",
      ],
    },
    {
      id: 38,
      pos: [2176.451171875, 846.496337890625],
      mode: 0,
      size: [270, 106],
      type: "ComfyDeployOutputText",
      flags: {},
      order: 26,
      inputs: [
        {
          link: 71,
          name: "text",
          type: "STRING",
        },
      ],
      outputs: [],
      properties: {
        "Node name for S&R": "ComfyDeployOutputText",
      },
      widgets_values: ["ComfyUI", "txt", "output_image_description"],
    },
    {
      id: 54,
      pos: [2812.54150390625, 1639.7513427734375],
      mode: 0,
      size: [295.9617614746094, 404.6077880859375],
      type: "ShowText|pysssss",
      flags: {},
      order: 23,
      inputs: [
        {
          link: 72,
          name: "text",
          type: "STRING",
          label: "text",
        },
      ],
      outputs: [
        {
          name: "STRING",
          type: "STRING",
          label: "STRING",
          links: [73],
          shape: 6,
        },
      ],
      properties: {
        ver: "1.2.5",
        cnr_id: "comfyui-custom-scripts",
        "Node name for S&R": "ShowText|pysssss",
      },
      widgets_values: [],
    },
    {
      id: 49,
      pos: [3037.84521484375, 2628.9052734375],
      mode: 0,
      size: [295.9617614746094, 404.6077880859375],
      type: "ShowText|pysssss",
      flags: {
        collapsed: false,
      },
      order: 19,
      inputs: [
        {
          link: 59,
          name: "text",
          type: "STRING",
          label: "text",
        },
      ],
      outputs: [
        {
          name: "STRING",
          type: "STRING",
          label: "STRING",
          links: [74],
          shape: 6,
        },
      ],
      properties: {
        ver: "1.2.5",
        cnr_id: "comfyui-custom-scripts",
        "Node name for S&R": "ShowText|pysssss",
      },
      widgets_values: [
        "<think>\nThe model should generate an image showing a turtle and a rabbit in a race, with the turtle moving slowly but steadily and the rabbit appearing to run quickly but ultimately losing to the turtle, emphasizing the moral of the story.\nHere's the finished detailed prompt: A vibrant and whimsical 3D animation of Aesop's Fables, featuring a turtle and a rabbit racing in a lush, colorful forest setting. The turtle is depicted moving slowly but steadily, its shell glistening with intricate textures, while the rabbit appears to run quickly but is shown slightly behind, emphasizing the moral of the story. The scene is lively and engaging, with dynamic motion and playful expressions on both characters. The lighting is soft and natural, with dappled sunlight filtering through the trees, creating a warm and inviting atmosphere. The background includes detailed foliage, flowers, and a winding path, adding depth and charm. The overall style is cartoonish and child-friendly, with smooth, rounded shapes and bright, harmonious colors.\n</think>",
      ],
    },
    {
      id: 30,
      pos: [1653.2440185546875, -518.94189453125],
      mode: 0,
      size: [400, 200],
      type: "ComfyUIDeployExternalText",
      flags: {},
      order: 3,
      inputs: [],
      outputs: [
        {
          name: "text",
          type: "STRING",
          links: [32],
        },
      ],
      properties: {
        "Node name for S&R": "ComfyUIDeployExternalText",
      },
      widgets_values: [
        "prompt_t2i",
        "An elderly samurai standing in a tranquil autumn garden, dressed in a weathered kimono with deep crimson and muted gold tones. His face is lined with age and wisdom, and he grips a sheathed katana with calm reverence. Maple leaves drift gently around him, and a small koi pond reflects the amber twilight. The atmosphere is serene and nostalgic, evoking honor, memory, and quiet strength.",
        "generate-image-Prompt",
        "",
      ],
    },
    {
      id: 31,
      pos: [2196.019287109375, 1575.060302734375],
      mode: 0,
      size: [400, 200],
      type: "ComfyUIDeployExternalText",
      flags: {},
      order: 4,
      inputs: [],
      outputs: [
        {
          name: "text",
          type: "STRING",
          links: [36],
        },
      ],
      properties: {
        "Node name for S&R": "ComfyUIDeployExternalText",
      },
      widgets_values: [
        "prompt_i2i",
        "Extend the image 9:16 ratio and generate A full body shot the long side of the image should be 1024",
        "edit-image-prompt",
        "",
      ],
    },
    {
      id: 42,
      pos: [3123.12255859375, 62.92445373535156],
      mode: 0,
      size: [281.9683532714844, 342],
      type: "ComfyDeployOutputImage",
      flags: {},
      order: 27,
      inputs: [
        {
          link: 51,
          name: "images",
          type: "IMAGE",
        },
      ],
      outputs: [],
      properties: {
        "Node name for S&R": "ComfyDeployOutputImage",
      },
      widgets_values: ["ComfyUI", "jpg", 90, "output_understanding_image"],
    },
    {
      id: 28,
      pos: [2721.386474609375, 603.6243286132812],
      mode: 0,
      size: [295.9617614746094, 404.6077880859375],
      type: "ShowText|pysssss",
      flags: {},
      order: 28,
      inputs: [
        {
          link: 31,
          name: "text",
          type: "STRING",
          label: "text",
        },
      ],
      outputs: [
        {
          name: "STRING",
          type: "STRING",
          label: "STRING",
          links: [75],
          shape: 6,
        },
      ],
      properties: {
        ver: "1.2.5",
        cnr_id: "comfyui-custom-scripts",
        "Node name for S&R": "ShowText|pysssss",
      },
      widgets_values: [
        "<think>\nThe model should generate an image of a person in a crouched position on asphalt, emphasizing street-style fashion with oversized sunglasses, chunky sneakers, and high socks, set against an urban environment.\nHere's the finished detailed prompt: A dynamic street-style shot featuring a person crouched on asphalt, wearing oversized sunglasses, chunky sneakers, and high socks, with a bold and urban backdrop. The scene is set in a gritty city environment with concrete textures, scattered debris, and muted tones, illuminated by natural daylight. The person's outfit is modern and edgy, with a focus on oversized silhouettes and bold accessories. The image has a sharp, ultra-realistic quality with cinematic lighting, emphasizing the textures of the asphalt and the urban surroundings, while the person's pose conveys a sense of movement and confidence.\n</think>",
      ],
    },
    {
      id: 2,
      pos: [2093.288330078125, -562.8455810546875],
      mode: 0,
      size: [376.3270568847656, 434.2239685058594],
      type: "BagelTextToImage",
      flags: {},
      order: 10,
      inputs: [
        {
          link: 1,
          name: "model",
          type: "BAGEL_MODEL",
          label: "model",
        },
        {
          link: 32,
          name: "prompt",
          type: "STRING",
          widget: {
            name: "prompt",
          },
        },
        {
          link: 67,
          name: "seed",
          type: "INT",
          widget: {
            name: "seed",
          },
        },
      ],
      outputs: [
        {
          name: "image",
          type: "IMAGE",
          label: "image",
          links: [45, 69],
        },
        {
          name: "thinking",
          type: "STRING",
          label: "thinking",
          links: [3],
        },
      ],
      properties: {
        ver: "4bb49e5232604e4838463f130b3ba7026e428c1d",
        aux_id: "neverbiasu/ComfyUI-Bagel",
        "Node name for S&R": "BagelTextToImage",
      },
      widgets_values: [
        "A female cosplayer portraying an ethereal fairy or elf, wearing a flowing dress made of delicate fabrics in soft, mystical colors like emerald green and silver. She has pointed ears, a gentle, enchanting expression, and her outfit is adorned with sparkling jewels and intricate patterns. The background is a magical forest with glowing plants, mystical creatures, and a serene atmosphere.",
        225609,
        "randomize",
        "1:1",
        4,
        50,
        true,
        0.4,
        3,
        0.1,
        "global",
        0.3,
      ],
    },
    {
      id: 26,
      pos: [2604.43115234375, 80.95854949951172],
      mode: 0,
      size: [376.3270568847656, 434.2239685058594],
      type: "BagelTextToImage",
      flags: {},
      order: 21,
      inputs: [
        {
          link: 29,
          name: "model",
          type: "BAGEL_MODEL",
          label: "model",
        },
        {
          link: 41,
          name: "prompt",
          type: "STRING",
          widget: {
            name: "prompt",
          },
        },
        {
          link: 65,
          name: "seed",
          type: "INT",
          widget: {
            name: "seed",
          },
        },
      ],
      outputs: [
        {
          name: "image",
          type: "IMAGE",
          label: "image",
          links: [51],
        },
        {
          name: "thinking",
          type: "STRING",
          label: "thinking",
          links: [31],
        },
      ],
      properties: {
        ver: "4bb49e5232604e4838463f130b3ba7026e428c1d",
        aux_id: "neverbiasu/ComfyUI-Bagel",
        "Node name for S&R": "BagelTextToImage",
      },
      widgets_values: [
        "A female cosplayer portraying an ethereal fairy or elf, wearing a flowing dress made of delicate fabrics in soft, mystical colors like emerald green and silver. She has pointed ears, a gentle, enchanting expression, and her outfit is adorned with sparkling jewels and intricate patterns. The background is a magical forest with glowing plants, mystical creatures, and a serene atmosphere.",
        890412,
        "randomize",
        "1:1",
        4,
        50,
        true,
        0.4,
        3,
        0,
        "global",
        0.3,
      ],
    },
    {
      id: 20,
      pos: [2678.106201171875, 1189.306640625],
      mode: 0,
      size: [400, 372],
      type: "BagelImageEdit",
      flags: {},
      order: 13,
      inputs: [
        {
          link: 35,
          name: "model",
          type: "BAGEL_MODEL",
        },
        {
          link: 39,
          name: "image",
          type: "IMAGE",
        },
        {
          link: 36,
          name: "prompt",
          type: "STRING",
          widget: {
            name: "prompt",
          },
        },
        {
          link: 66,
          name: "seed",
          type: "INT",
          widget: {
            name: "seed",
          },
        },
      ],
      outputs: [
        {
          name: "image",
          type: "IMAGE",
          links: [40],
        },
        {
          name: "thinking",
          type: "STRING",
          links: [72],
        },
      ],
      properties: {
        "Node name for S&R": "BagelImageEdit",
      },
      widgets_values: [
        "",
        609322,
        "randomize",
        4,
        2,
        50,
        false,
        0,
        3,
        0,
        "text_channel",
        0.3,
      ],
    },
    {
      id: 19,
      pos: [1978.532958984375, 1204.6800537109375],
      mode: 0,
      size: [274.080078125, 314.00006103515625],
      type: "LoadImage",
      flags: {},
      order: 5,
      inputs: [],
      outputs: [
        {
          name: "IMAGE",
          type: "IMAGE",
          links: [38],
        },
        {
          name: "MASK",
          type: "MASK",
          links: null,
        },
      ],
      properties: {
        "Node name for S&R": "LoadImage",
      },
      widgets_values: ["b37b543e-e194-40a2-bb07-88695b530fab.jpeg", "image"],
    },
    {
      id: 32,
      pos: [1236.9964599609375, 499.2970886230469],
      mode: 0,
      size: [400, 200],
      type: "ComfyUIDeployExternalText",
      flags: {},
      order: 6,
      inputs: [],
      outputs: [
        {
          name: "text",
          type: "STRING",
          links: [37],
        },
      ],
      properties: {
        "Node name for S&R": "ComfyUIDeployExternalText",
      },
      widgets_values: [
        "prompt_vl",
        "generate a vivid word image description of the image add the art style, aesthetics, type of shot or composition no more than 50 words long",
        "image-uderstanding-Prompt",
        "",
      ],
    },
    {
      id: 45,
      pos: [1152.972412109375, -177.17318725585938],
      mode: 0,
      size: [400, 200],
      type: "ComfyUIDeployExternalNumberInt",
      flags: {},
      order: 7,
      inputs: [],
      outputs: [
        {
          name: "value",
          type: "INT",
          links: [65, 66, 67, 68],
        },
      ],
      properties: {
        "Node name for S&R": "ComfyUIDeployExternalNumberInt",
      },
      widgets_values: ["seed", 455521445, "", ""],
    },
    {
      id: 7,
      pos: [2151.330810546875, 84.67277526855469],
      mode: 0,
      size: [400, 204],
      type: "BagelImageUnderstanding",
      flags: {},
      order: 12,
      inputs: [
        {
          link: 9,
          name: "model",
          type: "BAGEL_MODEL",
        },
        {
          link: 43,
          name: "image",
          type: "IMAGE",
        },
        {
          link: 37,
          name: "prompt",
          type: "STRING",
          widget: {
            name: "prompt",
          },
        },
      ],
      outputs: [
        {
          name: "text",
          type: "STRING",
          links: [12, 41],
        },
      ],
      properties: {
        "Node name for S&R": "BagelImageUnderstanding",
      },
      widgets_values: [
        "What do you see in this image?",
        false,
        false,
        0.3,
        512,
      ],
    },
    {
      id: 9,
      pos: [2162.37158203125, 366.0086669921875],
      mode: 0,
      size: [295.9617614746094, 404.6077880859375],
      type: "ShowText|pysssss",
      flags: {},
      order: 20,
      inputs: [
        {
          link: 12,
          name: "text",
          type: "STRING",
          label: "text",
        },
      ],
      outputs: [
        {
          name: "STRING",
          type: "STRING",
          label: "STRING",
          links: [71],
          shape: 6,
        },
      ],
      properties: {
        ver: "1.2.5",
        cnr_id: "comfyui-custom-scripts",
        "Node name for S&R": "ShowText|pysssss",
      },
      widgets_values: [
        "A dynamic street-style shot captures a person crouched on asphalt, wearing oversized sunglasses, chunky sneakers, and high socks, with a bold, urban backdrop.",
      ],
    },
    {
      id: 47,
      pos: [2710.28076171875, 2257.26953125],
      mode: 0,
      size: [210, 246.00001525878906],
      type: "PreviewImage",
      flags: {},
      order: 17,
      inputs: [
        {
          link: 58,
          name: "images",
          type: "IMAGE",
          label: "images",
        },
      ],
      outputs: [],
      properties: {
        ver: "0.3.30",
        cnr_id: "comfy-core",
        "Node name for S&R": "PreviewImage",
      },
      widgets_values: [],
    },
    {
      id: 51,
      pos: [2281.41162109375, 2514.998291015625],
      mode: 0,
      size: [376.3270568847656, 434.2239685058594],
      type: "BagelTextToImage",
      flags: {},
      order: 11,
      inputs: [
        {
          link: 64,
          name: "model",
          type: "BAGEL_MODEL",
          label: "model",
        },
        {
          link: 62,
          name: "prompt",
          type: "STRING",
          widget: {
            name: "prompt",
          },
        },
        {
          link: 68,
          name: "seed",
          type: "INT",
          widget: {
            name: "seed",
          },
        },
      ],
      outputs: [
        {
          name: "image",
          type: "IMAGE",
          label: "image",
          links: [58, 63],
        },
        {
          name: "thinking",
          type: "STRING",
          label: "thinking",
          links: [59],
        },
      ],
      properties: {
        ver: "4bb49e5232604e4838463f130b3ba7026e428c1d",
        aux_id: "neverbiasu/ComfyUI-Bagel",
        "Node name for S&R": "BagelTextToImage",
      },
      widgets_values: [
        "A female cosplayer portraying an ethereal fairy or elf, wearing a flowing dress made of delicate fabrics in soft, mystical colors like emerald green and silver. She has pointed ears, a gentle, enchanting expression, and her outfit is adorned with sparkling jewels and intricate patterns. The background is a magical forest with glowing plants, mystical creatures, and a serene atmosphere.",
        368164,
        "randomize",
        "1:1",
        4,
        50,
        true,
        0.4,
        3,
        0,
        "global",
        0.3,
      ],
    },
  ],
  config: {},
  groups: [],
  version: 0.4,
  revision: 0,
  last_link_id: 75,
  last_node_id: 55,
  workflow_api: {
    "1": {
      _meta: {
        title: "BAGEL Model Loader",
      },
      inputs: {
        precision: "bfloat16",
        model_path: "models/BAGEL-7B-MoT",
      },
      class_type: "BagelModelLoader",
    },
    "2": {
      _meta: {
        title: "BAGEL Text to Image",
      },
      inputs: {
        seed: ["45", 0],
        model: ["1", 0],
        prompt: ["30", 0],
        image_ratio: "1:1",
        cfg_interval: 0.4,
        num_timesteps: 50,
        show_thinking: true,
        cfg_renorm_min: 0.1,
        cfg_text_scale: 4,
        timestep_shift: 3,
        cfg_renorm_type: "global",
        text_temperature: 0.3,
      },
      class_type: "BagelTextToImage",
    },
    "4": {
      _meta: {
        title: "Show Text 🐍",
      },
      inputs: {
        text: ["2", 1],
        text_0:
          "<think>\nThe image should depict an elderly samurai in traditional Japanese attire, surrounded by autumnal elements like falling leaves and a serene garden setting, with a calm and reflective mood.\nThe comprehensive prompt is: An elderly samurai standing in a tranquil autumn garden, dressed in a weathered kimono with deep crimson and muted gold tones, his face lined with age and wisdom. He grips a sheathed katana with calm reverence, surrounded by gently falling maple leaves and a small koi pond reflecting the amber twilight. The atmosphere is serene and nostalgic, evoking honor, memory, and quiet strength. The scene is bathed in soft, warm lighting, with rich autumnal colors and a peaceful, timeless mood. Ultra-realistic details emphasize the texture of the kimono, the delicate motion of the leaves, and the subtle ripples in the pond, creating a harmonious and evocative composition.\n</think>",
      },
      class_type: "ShowText|pysssss",
    },
    "7": {
      _meta: {
        title: "BAGEL Image Understanding",
      },
      inputs: {
        image: ["35", 0],
        model: ["1", 0],
        prompt: ["32", 0],
        do_sample: false,
        show_thinking: false,
        max_new_tokens: 512,
        text_temperature: 0.3,
      },
      class_type: "BagelImageUnderstanding",
    },
    "9": {
      _meta: {
        title: "Show Text 🐍",
      },
      inputs: {
        text: ["7", 0],
        text_0:
          "A dynamic street-style shot captures a person crouched on asphalt, wearing oversized sunglasses, chunky sneakers, and high socks, with a bold, urban backdrop.",
      },
      class_type: "ShowText|pysssss",
    },
    "19": {
      _meta: {
        title: "Load Image",
      },
      inputs: {
        image: "b37b543e-e194-40a2-bb07-88695b530fab.jpeg",
      },
      class_type: "LoadImage",
    },
    "20": {
      _meta: {
        title: "BAGEL Image Edit",
      },
      inputs: {
        seed: ["45", 0],
        image: ["33", 0],
        model: ["1", 0],
        prompt: ["31", 0],
        cfg_interval: 0,
        cfg_img_scale: 2,
        num_timesteps: 50,
        show_thinking: false,
        cfg_renorm_min: 0,
        cfg_text_scale: 4,
        timestep_shift: 3,
        cfg_renorm_type: "text_channel",
        text_temperature: 0.3,
      },
      class_type: "BagelImageEdit",
    },
    "23": {
      _meta: {
        title: "Load Image",
      },
      inputs: {
        image: "1ca61801-5b3a-4e43-bcc1-e64d4f0b0fb4.jpeg",
      },
      class_type: "LoadImage",
    },
    "26": {
      _meta: {
        title: "BAGEL Text to Image",
      },
      inputs: {
        seed: ["45", 0],
        model: ["1", 0],
        prompt: ["7", 0],
        image_ratio: "1:1",
        cfg_interval: 0.4,
        num_timesteps: 50,
        show_thinking: true,
        cfg_renorm_min: 0,
        cfg_text_scale: 4,
        timestep_shift: 3,
        cfg_renorm_type: "global",
        text_temperature: 0.3,
      },
      class_type: "BagelTextToImage",
    },
    "28": {
      _meta: {
        title: "Show Text 🐍",
      },
      inputs: {
        text: ["26", 1],
        text_0:
          "<think>\nThe model should generate an image of a person in a crouched position on asphalt, emphasizing street-style fashion with oversized sunglasses, chunky sneakers, and high socks, set against an urban environment.\nHere's the finished detailed prompt: A dynamic street-style shot featuring a person crouched on asphalt, wearing oversized sunglasses, chunky sneakers, and high socks, with a bold and urban backdrop. The scene is set in a gritty city environment with concrete textures, scattered debris, and muted tones, illuminated by natural daylight. The person's outfit is modern and edgy, with a focus on oversized silhouettes and bold accessories. The image has a sharp, ultra-realistic quality with cinematic lighting, emphasizing the textures of the asphalt and the urban surroundings, while the person's pose conveys a sense of movement and confidence.\n</think>",
      },
      class_type: "ShowText|pysssss",
    },
    "30": {
      _meta: {
        title: "External Text (ComfyUI Deploy)",
      },
      inputs: {
        input_id: "prompt_t2i",
        description: "",
        display_name: "generate-image-Prompt",
        default_value:
          "An elderly samurai standing in a tranquil autumn garden, dressed in a weathered kimono with deep crimson and muted gold tones. His face is lined with age and wisdom, and he grips a sheathed katana with calm reverence. Maple leaves drift gently around him, and a small koi pond reflects the amber twilight. The atmosphere is serene and nostalgic, evoking honor, memory, and quiet strength.",
      },
      class_type: "ComfyUIDeployExternalText",
    },
    "31": {
      _meta: {
        title: "External Text (ComfyUI Deploy)",
      },
      inputs: {
        input_id: "prompt_i2i",
        description: "",
        display_name: "edit-image-prompt",
        default_value:
          "Extend the image 9:16 ratio and generate A full body shot the long side of the image should be 1024",
      },
      class_type: "ComfyUIDeployExternalText",
    },
    "32": {
      _meta: {
        title: "External Text (ComfyUI Deploy)",
      },
      inputs: {
        input_id: "prompt_vl",
        description: "",
        display_name: "image-uderstanding-Prompt",
        default_value:
          "generate a vivid word image description of the image add the art style, aesthetics, type of shot or composition no more than 50 words long",
      },
      class_type: "ComfyUIDeployExternalText",
    },
    "33": {
      _meta: {
        title: "External Image (ComfyUI Deploy)",
      },
      inputs: {
        input_id: "i2i_img_input",
        description: "",
        display_name: "edit-image-input",
        default_value: ["19", 0],
        default_value_url: "",
      },
      class_type: "ComfyUIDeployExternalImage",
    },
    "34": {
      _meta: {
        title: "Image Output (ComfyDeploy)",
      },
      inputs: {
        images: ["20", 0],
        quality: 90,
        file_type: "jpg",
        output_id: "output_i2i",
        filename_prefix: "ComfyUI",
      },
      class_type: "ComfyDeployOutputImage",
    },
    "35": {
      _meta: {
        title: "External Image (ComfyUI Deploy)",
      },
      inputs: {
        input_id: "ivl_img_input",
        description: "",
        display_name: "image-understanding-input",
        default_value: ["23", 0],
        default_value_url: "",
      },
      class_type: "ComfyUIDeployExternalImage",
    },
    "37": {
      _meta: {
        title: "Image Output (ComfyDeploy)",
      },
      inputs: {
        images: ["2", 0],
        quality: 90,
        file_type: "jpg",
        output_id: "output_t2i",
        filename_prefix: "ComfyUI",
      },
      class_type: "ComfyDeployOutputImage",
    },
    "38": {
      _meta: {
        title: "Text Output (ComfyDeploy)",
      },
      inputs: {
        text: ["9", 0],
        file_type: "txt",
        output_id: "output_image_description",
        filename_prefix: "ComfyUI",
      },
      class_type: "ComfyDeployOutputText",
    },
    "39": {
      _meta: {
        title: "Text Output (ComfyDeploy)",
      },
      inputs: {
        text: ["4", 0],
        file_type: "txt",
        output_id: "output_t2i_thinking",
        filename_prefix: "ComfyUI",
      },
      class_type: "ComfyDeployOutputText",
    },
    "40": {
      _meta: {
        title: "Text Output (ComfyDeploy)",
      },
      inputs: {
        text: ["28", 0],
        file_type: "txt",
        output_id: "output_understanding_thinking",
        filename_prefix: "ComfyUI",
      },
      class_type: "ComfyDeployOutputText",
    },
    "41": {
      _meta: {
        title: "Text Output (ComfyDeploy)",
      },
      inputs: {
        text: ["54", 0],
        file_type: "txt",
        output_id: "output_i2i_thinking",
        filename_prefix: "ComfyUI",
      },
      class_type: "ComfyDeployOutputText",
    },
    "42": {
      _meta: {
        title: "Image Output (ComfyDeploy)",
      },
      inputs: {
        images: ["26", 0],
        quality: 90,
        file_type: "jpg",
        output_id: "output_understanding_image",
        filename_prefix: "ComfyUI",
      },
      class_type: "ComfyDeployOutputImage",
    },
    "45": {
      _meta: {
        title: "External Number Int (ComfyUI Deploy)",
      },
      inputs: {
        input_id: "seed",
        description: "",
        display_name: "",
        default_value: 455521445,
      },
      class_type: "ComfyUIDeployExternalNumberInt",
    },
    "46": {
      _meta: {
        title: "Save Image",
      },
      inputs: {
        images: ["2", 0],
        filename_prefix: "ComfyUI",
      },
      class_type: "SaveImage",
    },
    "47": {
      _meta: {
        title: "Preview Image",
      },
      inputs: {
        images: ["51", 0],
      },
      class_type: "PreviewImage",
    },
    "48": {
      _meta: {
        title: "External Text (ComfyUI Deploy)",
      },
      inputs: {
        input_id: "prompt_anim",
        description: "",
        display_name: "generate-anim-Prompt",
        default_value:
          "Create a 3d animation of a turtle racing a rabbit aesops fables illustration for childrens",
      },
      class_type: "ComfyUIDeployExternalText",
    },
    "49": {
      _meta: {
        title: "Show Text 🐍",
      },
      inputs: {
        text: ["51", 1],
        text_0:
          "<think>\nThe model should generate an image showing a turtle and a rabbit in a race, with the turtle moving slowly but steadily and the rabbit appearing to run quickly but ultimately losing to the turtle, emphasizing the moral of the story.\nHere's the finished detailed prompt: A vibrant and whimsical 3D animation of Aesop's Fables, featuring a turtle and a rabbit racing in a lush, colorful forest setting. The turtle is depicted moving slowly but steadily, its shell glistening with intricate textures, while the rabbit appears to run quickly but is shown slightly behind, emphasizing the moral of the story. The scene is lively and engaging, with dynamic motion and playful expressions on both characters. The lighting is soft and natural, with dappled sunlight filtering through the trees, creating a warm and inviting atmosphere. The background includes detailed foliage, flowers, and a winding path, adding depth and charm. The overall style is cartoonish and child-friendly, with smooth, rounded shapes and bright, harmonious colors.\n</think>",
      },
      class_type: "ShowText|pysssss",
    },
    "50": {
      _meta: {
        title: "Text Output (ComfyDeploy)",
      },
      inputs: {
        text: ["49", 0],
        file_type: "txt",
        output_id: "output_anim_thinking",
        filename_prefix: "ComfyUI",
      },
      class_type: "ComfyDeployOutputText",
    },
    "51": {
      _meta: {
        title: "BAGEL Text to Image",
      },
      inputs: {
        seed: ["45", 0],
        model: ["1", 0],
        prompt: ["48", 0],
        image_ratio: "1:1",
        cfg_interval: 0.4,
        num_timesteps: 50,
        show_thinking: true,
        cfg_renorm_min: 0,
        cfg_text_scale: 4,
        timestep_shift: 3,
        cfg_renorm_type: "global",
        text_temperature: 0.3,
      },
      class_type: "BagelTextToImage",
    },
    "53": {
      _meta: {
        title: "Image Output (ComfyDeploy)",
      },
      inputs: {
        images: ["51", 0],
        quality: 90,
        file_type: "jpg",
        output_id: "output_anim",
        filename_prefix: "ComfyUI",
      },
      class_type: "ComfyDeployOutputImage",
    },
    "54": {
      _meta: {
        title: "Show Text 🐍",
      },
      inputs: {
        text: ["20", 1],
      },
      class_type: "ShowText|pysssss",
    },
  },
  environment: {
    comfyui_version: "094306b626e9cf505690c5d8b445032b3b8a36fa",
    gpu: "L40S",
    docker_command_steps: {
      steps: [
        {
          id: "d8665947-0",
          data: "FROM nvidia/cuda:12.8.1-cudnn-devel-ubuntu24.04\nENV TORCH_CUDA_ARCH_LIST=8.9",
          type: "commands",
        },
        {
          id: "b68a6f5d-d-ubuntu24",
          data: "RUN apt-get update && \\\n    apt-get install -yq --no-install-recommends \\\n    build-essential \\\n    git \\\n    git-lfs \\\n    curl \\\n    ninja-build \\\n    ffmpeg \\\n    poppler-utils \\\n    aria2 \\\n    python3-dev \\\n    python3-pip \\\n    software-properties-common \\\n    && apt-get clean \\\n    && rm -rf /var/lib/apt/lists/*\n\nRUN pip3 install --upgrade pip setuptools wheel",
          type: "commands",
        },
        {
          id: "0e80dd22-9",
          data: 'ENV CUDA_HOME=/usr/local/cuda\nENV PATH=${CUDA_HOME}/bin:${PATH}\nENV LD_LIBRARY_PATH=${CUDA_HOME}/lib64:${LD_LIBRARY_PATH}\nENV CUDA_LAUNCH_BLOCKING=1\nENV TORCH_USE_CUDA_DSA=1\n\nRUN if [ -d "/usr/local/cuda-12.8" ]; then \\\n      echo "Linking libraries from /usr/local/cuda-12.8" && \\\n      ln -sf /usr/local/cuda-12.8/targets/x86_64-linux/lib/libcudart.so /usr/lib/libcudart.so && \\\n      ln -sf /usr/local/cuda-12.8/targets/x86_64-linux/lib/libcublas.so /usr/lib/libcublas.so && \\\n      ln -sf /usr/local/cuda-12.8/targets/x86_64-linux/lib/libcublasLt.so /usr/lib/libcublasLt.so && \\\n      ln -sf /usr/local/cuda-12.8/targets/x86_64-linux/lib/libcufft.so /usr/lib/libcufft.so && \\\n      ln -sf /usr/local/cuda-12.8/targets/x86_64-linux/lib/libnvrtc.so /usr/lib/libnvrtc.so; \\\n    elif [ -d "/usr/local/cuda" ]; then \\\n      echo "Linking libraries from /usr/local/cuda" && \\\n      ln -sf /usr/local/cuda/targets/x86_64-linux/lib/libcudart.so /usr/lib/libcudart.so && \\\n      ln -sf /usr/local/cuda/targets/x86_64-linux/lib/libcublas.so /usr/lib/libcublas.so && \\\n      ln -sf /usr/local/cuda/targets/x86_64-linux/lib/libcublasLt.so /usr/lib/libcublasLt.so && \\\n      ln -sf /usr/local/cuda/targets/x86_64-linux/lib/libcufft.so /usr/lib/libcufft.so && \\\n      ln -sf /usr/local/cuda/targets/x86_64-linux/lib/libnvrtc.so /usr/lib/libnvrtc.so; \\\n    else \\\n      echo "Warning: Could not find CUDA directory for symlinking." ; \\\n    fi',
          type: "commands",
        },
        {
          id: "a53fb461-1",
          data: "RUN pip install --pre -U xformers torch torchvision torchaudio --index-url https://download.pytorch.org/whl/nightly/cu128",
          type: "commands",
        },
        {
          id: "triton-install",
          data: "\n#install\nRUN pip install triton\nRUN pip install sageattention\n#RUN MAX_JOBS=4 pip install flash-attn --no-build-isolation\n",
          type: "commands",
        },
        {
          id: "a6b8de0d-5",
          data: "RUN pip install https://huggingface.co/impactframes/linux_whl/resolve/main/flash_attn-2.7.4%2Bcu128torch2.7-cp312-cp312-linux_x86_64.whl",
          type: "commands",
        },
        {
          id: "bnb-env-setup",
          data: "ENV BNB_CUDA_VERSION=128\nENV USE_COMPILE_API=1\nENV CUDA_VISIBLE_DEVICES=0",
          type: "commands",
        },
        {
          id: "verify-core",
          data: "RUN python3 -c \"import torch; print('PyTorch version:', torch.__version__); print('CUDA available:', torch.cuda.is_available()); print('CUDA version:', torch.version.cuda)\"",
          type: "commands",
        },
        {
          id: "verify-bnb",
          data: 'RUN python3 -c "import bitsandbytes as bnb; print(\'BitsAndBytes version:\', bnb.__version__)" || echo "BitsAndBytes import check complete"',
          type: "commands",
        },
        {
          id: "f930aea2-6",
          data: {
            url: "https://github.com/ltdrdata/ComfyUI-Impact-Pack",
            hash: "f8e16df2be0ed2ce914ddd242ef9eadfa386bc2f",
            meta: {
              message: "bump version",
              committer: {
                date: "2025-05-18T23:33:30.000Z",
                name: "Dr.Lt.Data",
                email: "dr.lt.data@gmail.com",
              },
              commit_url:
                "https://github.com/ltdrdata/ComfyUI-Impact-Pack/commit/f8e16df2be0ed2ce914ddd242ef9eadfa386bc2f",
              latest_hash: "f8e16df2be0ed2ce914ddd242ef9eadfa386bc2f",
              stargazers_count: 2408,
            },
            name: "ComfyUI Impact Pack",
            files: [],
            install_type: "git-clone",
          },
          type: "custom-node",
        },
        {
          id: "87d04892-4",
          data: {
            url: "https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite",
            hash: "a7ce59e381934733bfae03b1be029756d6ce936d",
            meta: {
              message: "Fix Use Everywhere compatibility",
              committer: {
                date: "2025-04-26T20:27:20.000Z",
                name: "AustinMroz",
                email: "austinmroz@utexas.edu",
              },
              commit_url:
                "https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite/commit/a7ce59e381934733bfae03b1be029756d6ce936d",
              latest_hash: "a7ce59e381934733bfae03b1be029756d6ce936d",
              stargazers_count: 1000,
            },
            name: "ComfyUI-VideoHelperSuite",
            files: [],
            install_type: "git-clone",
          },
          type: "custom-node",
        },
        {
          id: "d1780483-6",
          data: {
            url: "https://github.com/kijai/ComfyUI-KJNodes",
            hash: "44565e9bffc89de454d06b4abe08137d1247652a",
            meta: {
              message: " Add choice of device for imageresize",
              committer: {
                date: "2025-05-20T13:50:55.000Z",
                name: "kijai",
                email: "40791699+kijai@users.noreply.github.com",
              },
              commit_url:
                "https://github.com/kijai/ComfyUI-KJNodes/commit/44565e9bffc89de454d06b4abe08137d1247652a",
              latest_hash: "44565e9bffc89de454d06b4abe08137d1247652a",
              stargazers_count: 1362,
            },
            name: "KJNodes for ComfyUI",
            files: [],
            install_type: "git-clone",
          },
          type: "custom-node",
        },
        {
          id: "85df8805-8",
          data: {
            url: "https://github.com/rgthree/rgthree-comfy",
            hash: "5288408220180af41ce50b0d29135e1ef5f83fdb",
            meta: {
              message:
                "Save the Display Any response to the pnginfo so it pre-exists when reloading the workflow.",
              committer: {
                date: "2025-05-19T03:59:31.000Z",
                name: "rgthree",
                email: "regis.gaughan@gmail.com",
              },
              commit_url:
                "https://github.com/rgthree/rgthree-comfy/commit/5288408220180af41ce50b0d29135e1ef5f83fdb",
              latest_hash: "5288408220180af41ce50b0d29135e1ef5f83fdb",
              stargazers_count: 1880,
            },
            name: "rgthree's ComfyUI Nodes",
            files: [],
            install_type: "git-clone",
          },
          type: "custom-node",
        },
        {
          id: "bf80e067-a",
          data: {
            url: "https://github.com/chflame163/ComfyUI_LayerStyle",
            hash: "a46b1e6d26d45be9784c49f7065ba44700ef2b63",
            meta: {
              message: "update readme images",
              committer: {
                date: "2025-05-17T12:58:01.000Z",
                name: "chflame163",
                email: "chflame@163.com",
              },
              commit_url:
                "https://github.com/chflame163/ComfyUI_LayerStyle/commit/a46b1e6d26d45be9784c49f7065ba44700ef2b63",
              latest_hash: "a46b1e6d26d45be9784c49f7065ba44700ef2b63",
              stargazers_count: 2258,
            },
            name: "ComfyUI Layer Style",
            files: [],
            install_type: "git-clone",
          },
          type: "custom-node",
        },
        {
          id: "4ab30b1c-4",
          data: {
            url: "https://github.com/cubiq/ComfyUI_essentials",
            hash: "9d9f4bedfc9f0321c19faf71855e228c93bd0dc9",
            meta: {
              message: "maintenance mode",
              committer: {
                date: "2025-04-14T07:33:21.000Z",
                name: "cubiq",
                email: "matteo@elf.io",
              },
              commit_url:
                "https://github.com/cubiq/ComfyUI_essentials/commit/9d9f4bedfc9f0321c19faf71855e228c93bd0dc9",
              latest_hash: "9d9f4bedfc9f0321c19faf71855e228c93bd0dc9",
              stargazers_count: 836,
            },
            name: "ComfyUI Essentials",
            files: [],
            install_type: "git-clone",
          },
          type: "custom-node",
        },
        {
          id: "8bfd5b9e-6",
          data: {
            url: "https://github.com/sipherxyz/comfyui-art-venture",
            hash: "fc00f4a094be1ba41d6c7bfcc157fb075d289573",
            meta: {
              message: "fix(web): error when redefine value property",
              committer: {
                date: "2025-04-15T08:23:05.000Z",
                name: "Tung Nguyen",
                email: "tung.nguyen@atherlabs.com",
              },
              commit_url:
                "https://github.com/sipherxyz/comfyui-art-venture/commit/fc00f4a094be1ba41d6c7bfcc157fb075d289573",
              latest_hash: "fc00f4a094be1ba41d6c7bfcc157fb075d289573",
              stargazers_count: 253,
            },
            name: "comfyui-art-venture",
            files: [],
            install_type: "git-clone",
          },
          type: "custom-node",
        },
        {
          id: "ffe77db4-f",
          data: {
            url: "https://github.com/comfy-deploy/comfyui-llm-toolkit",
            hash: "ed2cb7e9989e1405c95cd7a057d8bcca0aa94230",
            meta: {
              message: "Add files via upload",
              committer: {
                date: "2025-05-24T13:25:38.000Z",
                name: "GitHub",
                email: "noreply@github.com",
              },
              commit_url:
                "https://github.com/comfy-deploy/comfyui-llm-toolkit/commit/ed2cb7e9989e1405c95cd7a057d8bcca0aa94230",
              latest_hash: "ed2cb7e9989e1405c95cd7a057d8bcca0aa94230",
              stargazers_count: 12,
            },
            name: "ComfyUI LLM Toolkit",
            files: [],
            install_type: "git-clone",
          },
          type: "custom-node",
        },
        {
          id: "4387e0dd-3",
          data: {
            url: "https://github.com/pythongosssss/ComfyUI-Custom-Scripts",
            hash: "aac13aa7ce35b07d43633c3bbe654a38c00d74f5",
            meta: {
              message: "Update pyproject.toml",
              committer: {
                date: "2025-04-30T12:00:09.000Z",
                name: "GitHub",
                email: "noreply@github.com",
              },
              latest_hash: "aac13aa7ce35b07d43633c3bbe654a38c00d74f5",
            },
            name: "ComfyUI-Custom-Scripts",
            files: ["https://github.com/pythongosssss/ComfyUI-Custom-Scripts"],
            install_type: "git-clone",
          },
          type: "custom-node",
        },
        {
          id: "35d617c0-f",
          data: "# 2) Install all other requirements from default PyPI\nRUN pip3 install --no-cache-dir \\\n    accelerate \\\n    decord \\\n    einops \\\n    huggingface_hub \\\n    matplotlib \\\n    numpy \\\n    opencv_python \\\n    pyarrow \\\n    PyYAML \\\n    requests \\\n    safetensors \\\n    scipy \\\n    sentencepiece \\\n    transformers \\\n    bitsandbytes \\    \n    wandb",
          type: "commands",
        },
        {
          id: "comfyui-deploy",
          data: {
            url: "https://github.com/BennyKok/comfyui-deploy",
            hash: "7b734c415aabd51b8bb8fad9fd719055b5ba359d",
            meta: {
              message: "fix: import",
              committer: {
                date: "2025-05-27T07:14:29.000Z",
                name: "BennyKok",
                email: "itechbenny@gmail.com",
              },
              commit_url:
                "https://github.com/BennyKok/comfyui-deploy/commit/7b734c415aabd51b8bb8fad9fd719055b5ba359d",
              latest_hash: "7b734c415aabd51b8bb8fad9fd719055b5ba359d",
              stargazers_count: 1335,
            },
            name: "ComfyUI Deploy",
            files: ["https://github.com/BennyKok/comfyui-deploy"],
            install_type: "git-clone",
          },
          type: "custom-node",
        },
        {
          id: "cad23787-8",
          data: {
            url: "https://github.com/city96/ComfyUI-GGUF",
            hash: "a2b75978fd50c0227a58316619b79d525b88e570",
            meta: {
              message: "Create pyproject.toml",
              committer: {
                date: "2025-05-08T23:08:35.000Z",
                name: "City",
                email: "125218114+city96@users.noreply.github.com",
              },
              latest_hash: "a2b75978fd50c0227a58316619b79d525b88e570",
            },
            name: "ComfyUI-GGUF",
            files: ["https://github.com/city96/ComfyUI-GGUF"],
            install_type: "git-clone",
          },
          type: "custom-node",
        },
        {
          id: "b9fa9cae-8",
          data: {
            url: "https://github.com/if-ai/BAGEL.git",
            hash: "07dd135c45eb6c2843e0b478776ca49f4297de74",
            meta: {
              message:
                "Fix: Remove undefined 'seed' variable call in ImageUnderstanding",
              committer: {
                date: "2025-05-30T06:24:09.000Z",
                name: "impactframes",
                email: "if@impactframes.ai",
              },
              commit_url:
                "https://github.com/if-ai/BAGEL/commit/07dd135c45eb6c2843e0b478776ca49f4297de74",
              latest_hash: "07dd135c45eb6c2843e0b478776ca49f4297de74",
              stargazers_count: 0,
            },
            name: "BAGEL.git",
            files: ["https://github.com/if-ai/BAGEL.git"],
            install_type: "git-clone",
          },
          type: "custom-node",
        },
      ],
    },
    max_containers: 2,
    install_custom_node_with_gpu: false,
    run_timeout: 300,
    scaledown_window: 60,
    extra_docker_commands: [],
    base_docker_image: "nvidia/cuda:12.6.3-cudnn-devel-ubuntu22.04",
    python_version: "3.12",
    extra_args: null,
    prestart_command: null,
    min_containers: 0,
    machine_hash:
      "610da88340d2be9d3e520d84b384a7b7dd45b3825652e4fc885b8173f1d7df5d",
    disable_metadata: true,
  },
};

const any_2_live_action_api_only = {
  "id": "681a6e0d-bf4d-49fc-8a57-34db7c8f2131",
  "extra": {
      "ds": {
          "scale": 0.12100000000000065,
          "offset": [
              15958.740349063357,
              -258.4147089661042
          ]
      },
      "node_versions": {
          "comfy-core": "0.3.26",
          "ComfyUI-WanVideoWrapper": "5a2383621a05825d0d0437781afcb8552d9590fd",
          "ComfyUI-VideoHelperSuite": "0a75c7958fe320efcb052f1d9f8451fd20c730a8"
      },
      "frontendVersion": "1.20.7",
      "VHS_MetadataImage": true,
      "VHS_latentpreview": false,
      "VHS_KeepIntermediate": true,
      "VHS_latentpreviewrate": 0
  },
  "links": [
      [
          534,
          292,
          0,
          290,
          0,
          "*"
      ],
      [
          536,
          290,
          0,
          293,
          0,
          "*"
      ],
      [
          550,
          289,
          0,
          297,
          0,
          "IMAGE"
      ],
      [
          559,
          299,
          0,
          230,
          0,
          "IMAGE"
      ],
      [
          560,
          169,
          0,
          229,
          0,
          "IMAGE"
      ],
      [
          587,
          313,
          0,
          310,
          0,
          "IMAGE"
      ],
      [
          592,
          314,
          0,
          312,
          0,
          "IMAGE"
      ],
      [
          598,
          319,
          0,
          317,
          0,
          "IMAGE"
      ],
      [
          611,
          297,
          0,
          308,
          0,
          "IMAGE"
      ],
      [
          615,
          334,
          0,
          336,
          0,
          "IMAGE"
      ],
      [
          617,
          230,
          0,
          279,
          0,
          "IMAGE"
      ],
      [
          618,
          336,
          0,
          335,
          0,
          "IMAGE"
      ],
      [
          620,
          310,
          0,
          327,
          0,
          "IMAGE"
      ],
      [
          621,
          230,
          0,
          308,
          1,
          "IMAGE"
      ],
      [
          622,
          336,
          0,
          327,
          1,
          "IMAGE"
      ],
      [
          638,
          309,
          0,
          292,
          0,
          "*"
      ],
      [
          643,
          347,
          0,
          345,
          3,
          "FACE_BOOST"
      ],
      [
          659,
          352,
          0,
          354,
          3,
          "FACE_BOOST"
      ],
      [
          671,
          361,
          0,
          229,
          1,
          "INT"
      ],
      [
          672,
          360,
          0,
          229,
          2,
          "INT"
      ],
      [
          683,
          297,
          0,
          288,
          0,
          "IMAGE"
      ],
      [
          684,
          229,
          0,
          288,
          1,
          "IMAGE"
      ],
      [
          686,
          310,
          0,
          311,
          0,
          "IMAGE"
      ],
      [
          687,
          312,
          0,
          311,
          1,
          "IMAGE"
      ],
      [
          828,
          437,
          0,
          299,
          0,
          "IMAGE"
      ],
      [
          829,
          436,
          0,
          334,
          0,
          "IMAGE"
      ],
      [
          830,
          310,
          0,
          436,
          0,
          "IMAGE"
      ],
      [
          831,
          312,
          0,
          436,
          1,
          "IMAGE"
      ],
      [
          832,
          297,
          0,
          437,
          0,
          "IMAGE"
      ],
      [
          833,
          229,
          0,
          437,
          1,
          "IMAGE"
      ],
      [
          855,
          453,
          0,
          452,
          0,
          "*"
      ],
      [
          857,
          452,
          0,
          455,
          0,
          "*"
      ],
      [
          858,
          309,
          0,
          453,
          0,
          "*"
      ],
      [
          900,
          458,
          0,
          468,
          0,
          "IMAGE"
      ],
      [
          915,
          475,
          0,
          474,
          0,
          "IMAGE"
      ],
      [
          951,
          488,
          0,
          490,
          3,
          "FACE_BOOST"
      ],
      [
          952,
          490,
          0,
          492,
          0,
          "IMAGE"
      ],
      [
          956,
          489,
          0,
          495,
          3,
          "FACE_BOOST"
      ],
      [
          963,
          497,
          0,
          501,
          0,
          "IMAGE"
      ],
      [
          977,
          492,
          0,
          500,
          0,
          "IMAGE"
      ],
      [
          978,
          500,
          0,
          493,
          0,
          "IMAGE"
      ],
      [
          979,
          500,
          0,
          499,
          1,
          "IMAGE"
      ],
      [
          981,
          500,
          0,
          496,
          0,
          "IMAGE"
      ],
      [
          982,
          495,
          0,
          497,
          0,
          "IMAGE"
      ],
      [
          983,
          501,
          0,
          496,
          1,
          "IMAGE"
      ],
      [
          984,
          501,
          0,
          494,
          0,
          "IMAGE"
      ],
      [
          1024,
          518,
          0,
          525,
          0,
          "IMAGE"
      ],
      [
          1060,
          361,
          0,
          537,
          1,
          "INT"
      ],
      [
          1061,
          361,
          0,
          538,
          1,
          "INT"
      ],
      [
          1062,
          361,
          0,
          539,
          1,
          "INT"
      ],
      [
          1063,
          360,
          0,
          537,
          2,
          "INT"
      ],
      [
          1064,
          360,
          0,
          538,
          2,
          "INT"
      ],
      [
          1065,
          360,
          0,
          539,
          2,
          "INT"
      ],
      [
          1074,
          526,
          0,
          538,
          0,
          "IMAGE"
      ],
      [
          1075,
          527,
          0,
          539,
          0,
          "IMAGE"
      ],
      [
          1076,
          506,
          0,
          537,
          0,
          "IMAGE"
      ],
      [
          1108,
          539,
          0,
          525,
          1,
          "IMAGE"
      ],
      [
          1113,
          537,
          0,
          518,
          0,
          "IMAGE"
      ],
      [
          1114,
          538,
          0,
          518,
          1,
          "IMAGE"
      ],
      [
          1146,
          564,
          0,
          560,
          0,
          "DAMODEL"
      ],
      [
          1159,
          570,
          0,
          571,
          0,
          "STRING"
      ],
      [
          1160,
          570,
          0,
          572,
          0,
          "STRING"
      ],
      [
          1164,
          537,
          0,
          574,
          0,
          "*"
      ],
      [
          1177,
          361,
          0,
          581,
          0,
          "*"
      ],
      [
          1178,
          360,
          0,
          582,
          0,
          "*"
      ],
      [
          1182,
          341,
          0,
          583,
          0,
          "*"
      ],
      [
          1190,
          539,
          0,
          588,
          0,
          "*"
      ],
      [
          1191,
          538,
          0,
          589,
          0,
          "*"
      ],
      [
          1228,
          570,
          0,
          604,
          0,
          "STRING"
      ],
      [
          1244,
          297,
          0,
          612,
          0,
          "IMAGE"
      ],
      [
          1245,
          229,
          0,
          612,
          1,
          "IMAGE"
      ],
      [
          1246,
          313,
          0,
          613,
          0,
          "IMAGE"
      ],
      [
          1247,
          314,
          0,
          613,
          1,
          "IMAGE"
      ],
      [
          1286,
          634,
          0,
          635,
          0,
          "IMAGE"
      ],
      [
          1295,
          636,
          0,
          634,
          1,
          "IMAGE"
      ],
      [
          1300,
          612,
          0,
          638,
          0,
          "IMAGE"
      ],
      [
          1301,
          613,
          0,
          639,
          0,
          "IMAGE"
      ],
      [
          1303,
          640,
          0,
          641,
          0,
          "IMAGE"
      ],
      [
          1365,
          613,
          0,
          655,
          0,
          "IMAGE"
      ],
      [
          1367,
          655,
          0,
          656,
          0,
          "IMAGE"
      ],
      [
          1368,
          612,
          0,
          657,
          0,
          "IMAGE"
      ],
      [
          1370,
          657,
          0,
          658,
          0,
          "IMAGE"
      ],
      [
          1373,
          660,
          0,
          661,
          0,
          "*"
      ],
      [
          1374,
          661,
          0,
          488,
          0,
          "COMBO"
      ],
      [
          1376,
          661,
          0,
          489,
          0,
          "COMBO"
      ],
      [
          1378,
          661,
          0,
          352,
          0,
          "COMBO"
      ],
      [
          1380,
          661,
          0,
          347,
          0,
          "COMBO"
      ],
      [
          1399,
          500,
          0,
          495,
          0,
          "IMAGE"
      ],
      [
          1408,
          469,
          0,
          655,
          1,
          "IMAGE"
      ],
      [
          1409,
          468,
          0,
          657,
          1,
          "IMAGE"
      ],
      [
          1411,
          657,
          0,
          636,
          0,
          "IMAGE"
      ],
      [
          1412,
          655,
          0,
          636,
          1,
          "IMAGE"
      ],
      [
          1419,
          608,
          0,
          668,
          0,
          "IMAGE"
      ],
      [
          1463,
          640,
          0,
          608,
          0,
          "IMAGE"
      ],
      [
          1486,
          637,
          0,
          634,
          0,
          "IMAGE"
      ],
      [
          1500,
          317,
          0,
          448,
          0,
          "IMAGE"
      ],
      [
          1502,
          468,
          0,
          663,
          0,
          "*"
      ],
      [
          1503,
          469,
          0,
          664,
          0,
          "*"
      ],
      [
          1509,
          345,
          0,
          458,
          0,
          "IMAGE"
      ],
      [
          1510,
          229,
          0,
          681,
          0,
          "*"
      ],
      [
          1511,
          312,
          0,
          682,
          0,
          "*"
      ],
      [
          1518,
          683,
          0,
          350,
          0,
          "IMAGE"
      ],
      [
          1519,
          684,
          0,
          472,
          0,
          "IMAGE"
      ],
      [
          1520,
          354,
          0,
          470,
          0,
          "IMAGE"
      ],
      [
          1521,
          470,
          0,
          469,
          0,
          "IMAGE"
      ],
      [
          1522,
          469,
          0,
          472,
          1,
          "IMAGE"
      ],
      [
          1523,
          469,
          0,
          471,
          0,
          "IMAGE"
      ],
      [
          1524,
          468,
          0,
          350,
          1,
          "IMAGE"
      ],
      [
          1525,
          468,
          0,
          349,
          0,
          "IMAGE"
      ],
      [
          1533,
          474,
          0,
          448,
          3,
          "IMAGE"
      ],
      [
          1558,
          637,
          0,
          695,
          0,
          "IMAGE"
      ],
      [
          1588,
          448,
          0,
          445,
          0,
          "IMAGE"
      ],
      [
          1589,
          445,
          0,
          447,
          0,
          "IMAGE"
      ],
      [
          1590,
          447,
          0,
          446,
          0,
          "IMAGE"
      ],
      [
          1656,
          361,
          0,
          714,
          0,
          "*"
      ],
      [
          1657,
          360,
          0,
          715,
          0,
          "*"
      ],
      [
          1658,
          714,
          0,
          317,
          1,
          "INT"
      ],
      [
          1659,
          715,
          0,
          317,
          2,
          "INT"
      ],
      [
          1660,
          714,
          0,
          474,
          1,
          "INT"
      ],
      [
          1661,
          715,
          0,
          474,
          2,
          "INT"
      ],
      [
          1662,
          714,
          0,
          447,
          1,
          "INT"
      ],
      [
          1663,
          715,
          0,
          447,
          2,
          "INT"
      ],
      [
          1668,
          581,
          0,
          230,
          1,
          "INT"
      ],
      [
          1669,
          582,
          0,
          230,
          2,
          "INT"
      ],
      [
          1670,
          581,
          0,
          336,
          1,
          "INT"
      ],
      [
          1671,
          582,
          0,
          336,
          2,
          "INT"
      ],
      [
          1672,
          581,
          0,
          310,
          1,
          "INT"
      ],
      [
          1673,
          582,
          0,
          310,
          2,
          "INT"
      ],
      [
          1674,
          581,
          0,
          312,
          1,
          "INT"
      ],
      [
          1675,
          582,
          0,
          312,
          2,
          "INT"
      ],
      [
          1676,
          581,
          0,
          297,
          1,
          "INT"
      ],
      [
          1677,
          582,
          0,
          297,
          2,
          "INT"
      ],
      [
          1717,
          560,
          0,
          566,
          0,
          "IMAGE"
      ],
      [
          1718,
          646,
          0,
          719,
          0,
          "IMAGE"
      ],
      [
          1720,
          560,
          0,
          565,
          0,
          "IMAGE"
      ],
      [
          1721,
          646,
          0,
          720,
          0,
          "IMAGE"
      ],
      [
          1779,
          711,
          0,
          718,
          0,
          "*"
      ],
      [
          1802,
          559,
          0,
          292,
          3,
          "IMAGE"
      ],
      [
          1821,
          581,
          0,
          740,
          1,
          "INT"
      ],
      [
          1822,
          582,
          0,
          740,
          2,
          "INT"
      ],
      [
          1823,
          608,
          0,
          740,
          0,
          "IMAGE"
      ],
      [
          1946,
          740,
          0,
          735,
          0,
          "*"
      ],
      [
          1947,
          735,
          0,
          770,
          0,
          "IMAGE"
      ],
      [
          1949,
          772,
          0,
          694,
          0,
          "STRING"
      ],
      [
          1950,
          773,
          0,
          692,
          0,
          "STRING"
      ],
      [
          1984,
          652,
          0,
          490,
          0,
          "IMAGE"
      ],
      [
          1986,
          787,
          0,
          786,
          0,
          "FLOAT"
      ],
      [
          1988,
          787,
          0,
          559,
          2,
          "FLOAT"
      ],
      [
          1997,
          559,
          0,
          791,
          0,
          "*"
      ],
      [
          1998,
          791,
          0,
          646,
          0,
          "IMAGE"
      ],
      [
          1999,
          791,
          0,
          560,
          1,
          "IMAGE"
      ],
      [
          2001,
          570,
          0,
          793,
          2,
          "STRING"
      ],
      [
          2017,
          718,
          0,
          628,
          0,
          "*"
      ],
      [
          2028,
          803,
          0,
          608,
          1,
          "IMAGE"
      ],
      [
          2030,
          803,
          0,
          749,
          0,
          "*"
      ],
      [
          2033,
          801,
          0,
          640,
          0,
          "IMAGE"
      ],
      [
          2037,
          802,
          0,
          640,
          1,
          "IMAGE"
      ],
      [
          2040,
          801,
          0,
          448,
          1,
          "IMAGE"
      ],
      [
          2043,
          802,
          0,
          448,
          2,
          "IMAGE"
      ],
      [
          2068,
          302,
          0,
          309,
          1,
          "STRING"
      ],
      [
          2084,
          786,
          0,
          711,
          2,
          "FLOAT"
      ],
      [
          2088,
          710,
          0,
          750,
          0,
          "*"
      ],
      [
          2091,
          786,
          0,
          710,
          2,
          "FLOAT"
      ],
      [
          2176,
          863,
          0,
          864,
          0,
          "IMAGE"
      ],
      [
          2178,
          865,
          0,
          866,
          0,
          "IMAGE"
      ],
      [
          2189,
          868,
          0,
          869,
          0,
          "IMAGE"
      ],
      [
          2190,
          867,
          0,
          870,
          0,
          "IMAGE"
      ],
      [
          2191,
          589,
          0,
          867,
          0,
          "IMAGE"
      ],
      [
          2192,
          588,
          0,
          868,
          0,
          "IMAGE"
      ],
      [
          2196,
          803,
          0,
          873,
          0,
          "IMAGE"
      ],
      [
          2200,
          873,
          2,
          875,
          0,
          "IMAGE"
      ],
      [
          2214,
          873,
          0,
          878,
          0,
          "IMAGE"
      ],
      [
          2228,
          873,
          0,
          882,
          0,
          "IMAGE"
      ],
      [
          2229,
          867,
          0,
          882,
          1,
          "IMAGE"
      ],
      [
          2230,
          868,
          0,
          882,
          2,
          "IMAGE"
      ],
      [
          2231,
          882,
          0,
          883,
          0,
          "IMAGE"
      ],
      [
          2246,
          474,
          0,
          888,
          0,
          "IMAGE"
      ],
      [
          2247,
          873,
          0,
          888,
          1,
          "IMAGE"
      ],
      [
          2248,
          873,
          1,
          888,
          2,
          "MASK"
      ],
      [
          2249,
          888,
          0,
          889,
          0,
          "IMAGE"
      ],
      [
          2250,
          888,
          0,
          292,
          1,
          "IMAGE"
      ],
      [
          2254,
          583,
          0,
          710,
          3,
          "INT"
      ],
      [
          2255,
          583,
          0,
          559,
          3,
          "INT"
      ],
      [
          2256,
          583,
          0,
          711,
          3,
          "INT"
      ],
      [
          2394,
          957,
          0,
          950,
          0,
          "IMAGE"
      ],
      [
          2395,
          963,
          0,
          951,
          0,
          "IMAGE"
      ],
      [
          2398,
          950,
          0,
          955,
          0,
          "IMAGE"
      ],
      [
          2399,
          951,
          0,
          956,
          0,
          "IMAGE"
      ],
      [
          2400,
          956,
          0,
          957,
          0,
          "IMAGE"
      ],
      [
          2401,
          949,
          0,
          957,
          3,
          "FACE_BOOST"
      ],
      [
          2408,
          953,
          0,
          963,
          3,
          "FACE_BOOST"
      ],
      [
          2410,
          772,
          0,
          960,
          0,
          "STRING"
      ],
      [
          2411,
          773,
          0,
          965,
          0,
          "STRING"
      ],
      [
          2420,
          660,
          0,
          953,
          0,
          "COMBO"
      ],
      [
          2421,
          660,
          0,
          949,
          0,
          "COMBO"
      ],
      [
          2427,
          652,
          0,
          499,
          0,
          "IMAGE"
      ],
      [
          2449,
          956,
          0,
          973,
          0,
          "IMAGE"
      ],
      [
          2450,
          955,
          0,
          974,
          0,
          "IMAGE"
      ],
      [
          2478,
          682,
          0,
          863,
          0,
          "IMAGE"
      ],
      [
          2481,
          317,
          0,
          983,
          0,
          "*"
      ],
      [
          2482,
          983,
          0,
          982,
          0,
          "IMAGE"
      ],
      [
          2486,
          474,
          0,
          985,
          0,
          "*"
      ],
      [
          2487,
          985,
          0,
          982,
          3,
          "IMAGE"
      ],
      [
          2488,
          982,
          0,
          453,
          1,
          "IMAGE"
      ],
      [
          2491,
          421,
          0,
          986,
          0,
          "*"
      ],
      [
          2492,
          422,
          0,
          987,
          0,
          "*"
      ],
      [
          2493,
          443,
          0,
          988,
          0,
          "*"
      ],
      [
          2494,
          533,
          0,
          989,
          0,
          "*"
      ],
      [
          2507,
          992,
          0,
          448,
          4,
          "STRING"
      ],
      [
          2509,
          990,
          0,
          437,
          4,
          "STRING"
      ],
      [
          2511,
          991,
          0,
          436,
          4,
          "STRING"
      ],
      [
          2515,
          455,
          4,
          997,
          0,
          "*"
      ],
      [
          2518,
          293,
          4,
          996,
          0,
          "*"
      ],
      [
          2529,
          993,
          0,
          570,
          1,
          "STRING"
      ],
      [
          2532,
          447,
          0,
          998,
          0,
          "*"
      ],
      [
          2533,
          998,
          0,
          652,
          0,
          "*"
      ],
      [
          2539,
          999,
          0,
          963,
          0,
          "IMAGE"
      ],
      [
          2547,
          983,
          0,
          637,
          0,
          "IMAGE"
      ],
      [
          2548,
          985,
          0,
          637,
          1,
          "IMAGE"
      ],
      [
          2549,
          996,
          0,
          993,
          0,
          "*"
      ],
      [
          2550,
          888,
          0,
          570,
          0,
          "IMAGE"
      ],
      [
          2646,
          1053,
          0,
          1052,
          0,
          "*"
      ],
      [
          2647,
          1051,
          0,
          1053,
          0,
          "*"
      ],
      [
          2648,
          309,
          0,
          1051,
          0,
          "*"
      ],
      [
          2649,
          288,
          0,
          1051,
          1,
          "IMAGE"
      ],
      [
          2650,
          1052,
          4,
          994,
          0,
          "*"
      ],
      [
          2652,
          1056,
          0,
          1055,
          0,
          "*"
      ],
      [
          2653,
          1054,
          0,
          1056,
          0,
          "*"
      ],
      [
          2654,
          309,
          0,
          1054,
          0,
          "*"
      ],
      [
          2655,
          311,
          0,
          1054,
          1,
          "IMAGE"
      ],
      [
          2656,
          1055,
          4,
          995,
          0,
          "*"
      ],
      [
          2662,
          501,
          0,
          1001,
          0,
          "*"
      ],
      [
          2667,
          575,
          0,
          448,
          6,
          "INT"
      ],
      [
          2669,
          575,
          0,
          437,
          6,
          "INT"
      ],
      [
          2670,
          575,
          0,
          436,
          6,
          "INT"
      ],
      [
          2672,
          1059,
          0,
          575,
          0,
          "*"
      ],
      [
          2673,
          1063,
          0,
          1062,
          0,
          "VIDEO"
      ],
      [
          2674,
          1063,
          1,
          1064,
          0,
          "STRING"
      ],
      [
          2676,
          1065,
          0,
          1066,
          0,
          "VIDEO"
      ],
      [
          2679,
          1068,
          0,
          1065,
          2,
          "FLOAT"
      ],
      [
          2680,
          793,
          0,
          1065,
          0,
          "IMAGE"
      ],
      [
          2681,
          793,
          3,
          1068,
          0,
          "VHS_VIDEOINFO"
      ],
      [
          2684,
          888,
          0,
          1063,
          0,
          "IMAGE"
      ],
      [
          2685,
          993,
          0,
          1063,
          1,
          "STRING"
      ],
      [
          2686,
          1072,
          0,
          1063,
          2,
          "COMBO"
      ],
      [
          2687,
          1072,
          0,
          570,
          2,
          "COMBO"
      ],
      [
          2688,
          1072,
          0,
          448,
          5,
          "COMBO"
      ],
      [
          2689,
          1072,
          0,
          436,
          5,
          "COMBO"
      ],
      [
          2690,
          1072,
          0,
          437,
          5,
          "COMBO"
      ],
      [
          2692,
          1001,
          0,
          803,
          0,
          "*"
      ],
      [
          2693,
          663,
          0,
          801,
          0,
          "*"
      ],
      [
          2694,
          664,
          0,
          802,
          0,
          "*"
      ],
      [
          2695,
          995,
          0,
          991,
          0,
          "*"
      ],
      [
          2696,
          994,
          0,
          990,
          0,
          "*"
      ],
      [
          2697,
          997,
          0,
          992,
          0,
          "*"
      ],
      [
          2698,
          793,
          0,
          999,
          0,
          "*"
      ],
      [
          2701,
          681,
          0,
          865,
          0,
          "IMAGE"
      ],
      [
          2703,
          863,
          0,
          1073,
          0,
          "*"
      ],
      [
          2704,
          865,
          0,
          1074,
          0,
          "*"
      ],
      [
          2705,
          1074,
          0,
          963,
          1,
          "IMAGE"
      ],
      [
          2707,
          1073,
          0,
          495,
          1,
          "IMAGE"
      ],
      [
          2708,
          1073,
          0,
          354,
          1,
          "IMAGE"
      ],
      [
          2709,
          1073,
          0,
          957,
          1,
          "IMAGE"
      ],
      [
          2710,
          1074,
          0,
          345,
          1,
          "IMAGE"
      ],
      [
          2712,
          1074,
          0,
          490,
          1,
          "IMAGE"
      ],
      [
          2713,
          230,
          0,
          683,
          0,
          "*"
      ],
      [
          2714,
          336,
          0,
          684,
          0,
          "*"
      ],
      [
          2715,
          684,
          0,
          354,
          0,
          "IMAGE"
      ],
      [
          2716,
          683,
          0,
          345,
          0,
          "IMAGE"
      ],
      [
          2717,
          683,
          0,
          982,
          1,
          "IMAGE"
      ],
      [
          2718,
          684,
          0,
          982,
          2,
          "IMAGE"
      ]
  ],
  "nodes": [
      {
          "id": 472,
          "pos": [
              -10631.32421875,
              3916.14306640625
          ],
          "mode": 0,
          "size": [
              497.44195556640625,
              569.3330688476562
          ],
          "type": "Image Comparer (rgthree)",
          "color": "#232",
          "flags": {},
          "order": 143,
          "inputs": [
              {
                  "dir": 3,
                  "link": 1519,
                  "name": "image_a",
                  "type": "IMAGE"
              },
              {
                  "dir": 3,
                  "link": 1522,
                  "name": "image_b",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#353",
          "outputs": [],
          "properties": {
              "ver": "5d771b8b56a343c24a26e8cea1f0c87c3d58102f",
              "cnr_id": "rgthree-comfy",
              "comparer_mode": "Slide"
          },
          "widgets_values": [
              [
                  {
                      "url": "/api/view?filename=rgthree.compare._temp_ndtvv_00007_.png&type=temp&subfolder=&rand=0.5166150054096998",
                      "name": "A",
                      "selected": true
                  },
                  {
                      "url": "/api/view?filename=rgthree.compare._temp_ndtvv_00008_.png&type=temp&subfolder=&rand=0.5344775561796046",
                      "name": "B",
                      "selected": true
                  }
              ]
          ]
      },
      {
          "id": 489,
          "pos": [
              -10071.37890625,
              4257.80615234375
          ],
          "mode": 0,
          "size": [
              292.73046875,
              178
          ],
          "type": "ReActorFaceBoost",
          "color": "#232",
          "flags": {},
          "order": 71,
          "inputs": [
              {
                  "link": 1376,
                  "name": "boost_model",
                  "type": "COMBO",
                  "widget": {
                      "name": "boost_model"
                  }
              }
          ],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "FACE_BOOST",
                  "type": "FACE_BOOST",
                  "links": [
                      956
                  ]
              }
          ],
          "properties": {
              "ver": "48a3ad27f99f775dcf63e61276e0110d256597ef",
              "cnr_id": "comfyui-reactor",
              "Node name for S&R": "ReActorFaceBoost"
          },
          "widgets_values": [
              true,
              "GPEN-BFR-512.onnx",
              "Bicubic",
              1,
              0.5,
              false
          ]
      },
      {
          "id": 497,
          "pos": [
              -9435.5771484375,
              3760.089599609375
          ],
          "mode": 0,
          "size": [
              265.4513854980469,
              369.30712890625
          ],
          "type": "ColorAdjustment",
          "color": "#232",
          "flags": {},
          "order": 173,
          "inputs": [
              {
                  "link": 982,
                  "name": "image",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      963
                  ]
              }
          ],
          "properties": {
              "ver": "8cf32f0eed017dffc2f7cc1e1e27a1765bf77f6d",
              "aux_id": "LAOGOU-666/Comfyui_LG_Tools",
              "cnr_id": "comfyui_lg_tools",
              "Node name for S&R": "ColorAdjustment"
          },
          "widgets_values": [
              1.139396845233569,
              0.8817826157532459,
              0.9157544104446935,
              ""
          ]
      },
      {
          "id": 492,
          "pos": [
              -9439.853515625,
              2946.910888671875
          ],
          "mode": 0,
          "size": [
              265.4513854980469,
              369.30712890625
          ],
          "type": "ColorAdjustment",
          "color": "#232",
          "flags": {},
          "order": 168,
          "inputs": [
              {
                  "link": 952,
                  "name": "image",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      977
                  ]
              }
          ],
          "properties": {
              "ver": "8cf32f0eed017dffc2f7cc1e1e27a1765bf77f6d",
              "aux_id": "LAOGOU-666/Comfyui_LG_Tools",
              "cnr_id": "comfyui_lg_tools",
              "Node name for S&R": "ColorAdjustment"
          },
          "widgets_values": [
              1.139396845233569,
              0.8817826157532459,
              0.9157544104446935,
              ""
          ]
      },
      {
          "id": 496,
          "pos": [
              -9160.283203125,
              3891.919677734375
          ],
          "mode": 0,
          "size": [
              497.44195556640625,
              569.3330688476562
          ],
          "type": "Image Comparer (rgthree)",
          "color": "#232",
          "flags": {},
          "order": 175,
          "inputs": [
              {
                  "dir": 3,
                  "link": 981,
                  "name": "image_a",
                  "type": "IMAGE"
              },
              {
                  "dir": 3,
                  "link": 983,
                  "name": "image_b",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#353",
          "outputs": [],
          "properties": {
              "ver": "5d771b8b56a343c24a26e8cea1f0c87c3d58102f",
              "cnr_id": "rgthree-comfy",
              "comparer_mode": "Slide"
          },
          "widgets_values": [
              [
                  {
                      "url": "/api/view?filename=rgthree.compare._temp_alrjk_00007_.png&type=temp&subfolder=&rand=0.14750866024254183",
                      "name": "A",
                      "selected": true
                  },
                  {
                      "url": "/api/view?filename=rgthree.compare._temp_alrjk_00008_.png&type=temp&subfolder=&rand=0.34541111146402703",
                      "name": "B",
                      "selected": true
                  }
              ]
          ]
      },
      {
          "id": 359,
          "pos": [
              -6683.78759765625,
              1988.38232421875
          ],
          "mode": 0,
          "size": [
              210,
              58
          ],
          "type": "INTConstant",
          "color": "#1b4669",
          "flags": {},
          "order": 0,
          "title": "Width",
          "inputs": [],
          "bgcolor": "#29699c",
          "outputs": [
              {
                  "name": "value",
                  "type": "INT",
                  "links": []
              }
          ],
          "properties": {
              "ver": "3e3a1a8aac61dc4515f6a7da74e026f05a80299f",
              "cnr_id": "comfyui-kjnodes",
              "Node name for S&R": "INTConstant"
          },
          "widgets_values": [
              1280
          ]
      },
      {
          "id": 347,
          "pos": [
              -11545.0234375,
              3468.401611328125
          ],
          "mode": 0,
          "size": [
              292.73046875,
              178
          ],
          "type": "ReActorFaceBoost",
          "color": "#232",
          "flags": {},
          "order": 73,
          "inputs": [
              {
                  "link": 1380,
                  "name": "boost_model",
                  "type": "COMBO",
                  "widget": {
                      "name": "boost_model"
                  }
              }
          ],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "FACE_BOOST",
                  "type": "FACE_BOOST",
                  "links": [
                      643
                  ]
              }
          ],
          "properties": {
              "ver": "48a3ad27f99f775dcf63e61276e0110d256597ef",
              "cnr_id": "comfyui-reactor",
              "Node name for S&R": "ReActorFaceBoost"
          },
          "widgets_values": [
              true,
              "GPEN-BFR-512.pth",
              "Bicubic",
              1,
              0.5,
              false
          ]
      },
      {
          "id": 612,
          "pos": [
              -9567.36328125,
              42.8927001953125
          ],
          "mode": 0,
          "size": [
              270,
              78
          ],
          "type": "AILab_ImageStitch",
          "color": "#222",
          "flags": {},
          "order": 83,
          "inputs": [
              {
                  "link": 1244,
                  "name": "image1",
                  "type": "IMAGE"
              },
              {
                  "link": 1245,
                  "name": "image2",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      1300,
                      1368
                  ]
              }
          ],
          "properties": {
              "ver": "daf0b01deb1c529dfb543093bba2ed586aad7886",
              "cnr_id": "comfyui-rmbg",
              "Node name for S&R": "AILab_ImageStitch"
          },
          "widgets_values": [
              "bottom"
          ]
      },
      {
          "id": 638,
          "pos": [
              -8962.84375,
              230.5310821533203
          ],
          "mode": 0,
          "size": [
              140,
              246.0001220703125
          ],
          "type": "PreviewImage",
          "color": "#222",
          "flags": {},
          "order": 96,
          "inputs": [
              {
                  "link": 1300,
                  "name": "images",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "PreviewImage"
          },
          "widgets_values": []
      },
      {
          "id": 299,
          "pos": [
              -9194.2958984375,
              71.9891586303711
          ],
          "mode": 0,
          "size": [
              196.41659545898438,
              26
          ],
          "type": "ImageRemoveAlpha+",
          "color": "#222",
          "flags": {
              "collapsed": false
          },
          "order": 123,
          "inputs": [
              {
                  "link": 828,
                  "name": "image",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      559
                  ]
              }
          ],
          "properties": {
              "ver": "33ff89fd354d8ec3ab6affb605a79a931b445d99",
              "cnr_id": "comfyui_essentials",
              "Node name for S&R": "ImageRemoveAlpha+"
          },
          "widgets_values": []
      },
      {
          "id": 488,
          "pos": [
              -10091.3916015625,
              3451.490966796875
          ],
          "mode": 0,
          "size": [
              292.73046875,
              178
          ],
          "type": "ReActorFaceBoost",
          "color": "#232",
          "flags": {},
          "order": 70,
          "inputs": [
              {
                  "link": 1374,
                  "name": "boost_model",
                  "type": "COMBO",
                  "widget": {
                      "name": "boost_model"
                  }
              }
          ],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "FACE_BOOST",
                  "type": "FACE_BOOST",
                  "links": [
                      951
                  ]
              }
          ],
          "properties": {
              "ver": "48a3ad27f99f775dcf63e61276e0110d256597ef",
              "cnr_id": "comfyui-reactor",
              "Node name for S&R": "ReActorFaceBoost"
          },
          "widgets_values": [
              true,
              "GPEN-BFR-512.pth",
              "Bicubic",
              1,
              0.5,
              false
          ]
      },
      {
          "id": 613,
          "pos": [
              -9547.8896484375,
              1096.7598876953125
          ],
          "mode": 0,
          "size": [
              270,
              78
          ],
          "type": "AILab_ImageStitch",
          "color": "#222",
          "flags": {},
          "order": 58,
          "inputs": [
              {
                  "link": 1246,
                  "name": "image1",
                  "type": "IMAGE"
              },
              {
                  "link": 1247,
                  "name": "image2",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      1301,
                      1365
                  ]
              }
          ],
          "properties": {
              "ver": "daf0b01deb1c529dfb543093bba2ed586aad7886",
              "cnr_id": "comfyui-rmbg",
              "Node name for S&R": "AILab_ImageStitch"
          },
          "widgets_values": [
              "bottom"
          ]
      },
      {
          "id": 350,
          "pos": [
              -10646.33203125,
              3076.563720703125
          ],
          "mode": 0,
          "size": [
              497.44195556640625,
              569.3330688476562
          ],
          "type": "Image Comparer (rgthree)",
          "color": "#232",
          "flags": {},
          "order": 147,
          "inputs": [
              {
                  "dir": 3,
                  "link": 1518,
                  "name": "image_a",
                  "type": "IMAGE"
              },
              {
                  "dir": 3,
                  "link": 1524,
                  "name": "image_b",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#353",
          "outputs": [],
          "properties": {
              "ver": "5d771b8b56a343c24a26e8cea1f0c87c3d58102f",
              "cnr_id": "rgthree-comfy",
              "comparer_mode": "Slide"
          },
          "widgets_values": [
              [
                  {
                      "url": "/api/view?filename=rgthree.compare._temp_ymbcd_00007_.png&type=temp&subfolder=&rand=0.6793163083622482",
                      "name": "A",
                      "selected": true
                  },
                  {
                      "url": "/api/view?filename=rgthree.compare._temp_ymbcd_00008_.png&type=temp&subfolder=&rand=0.6523167321804854",
                      "name": "B",
                      "selected": true
                  }
              ]
          ]
      },
      {
          "id": 297,
          "pos": [
              -9564.5537109375,
              -288.364501953125
          ],
          "mode": 0,
          "size": [
              270,
              266
          ],
          "type": "ImageResizeKJv2",
          "color": "#222",
          "flags": {
              "collapsed": false
          },
          "order": 64,
          "inputs": [
              {
                  "link": 550,
                  "name": "image",
                  "type": "IMAGE"
              },
              {
                  "link": 1676,
                  "name": "width",
                  "type": "INT",
                  "widget": {
                      "name": "width"
                  }
              },
              {
                  "link": 1677,
                  "name": "height",
                  "type": "INT",
                  "widget": {
                      "name": "height"
                  }
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      611,
                      683,
                      832,
                      1244
                  ]
              },
              {
                  "name": "width",
                  "type": "INT",
                  "links": []
              },
              {
                  "name": "height",
                  "type": "INT",
                  "links": []
              }
          ],
          "properties": {
              "ver": "5dcda71011870278c35d92ff77a677ed2e538f2d",
              "cnr_id": "comfyui-kjnodes",
              "Node name for S&R": "ImageResizeKJv2"
          },
          "widgets_values": [
              512,
              512,
              "lanczos",
              "pad",
              "255,255,255",
              "center",
              16,
              "cpu"
          ]
      },
      {
          "id": 458,
          "pos": [
              -10927.8974609375,
              2949.510009765625
          ],
          "mode": 0,
          "size": [
              265.4513854980469,
              369.30712890625
          ],
          "type": "ColorAdjustment",
          "color": "#232",
          "flags": {},
          "order": 136,
          "inputs": [
              {
                  "link": 1509,
                  "name": "image",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      900
                  ]
              }
          ],
          "properties": {
              "ver": "8cf32f0eed017dffc2f7cc1e1e27a1765bf77f6d",
              "aux_id": "LAOGOU-666/Comfyui_LG_Tools",
              "cnr_id": "comfyui_lg_tools",
              "Node name for S&R": "ColorAdjustment"
          },
          "widgets_values": [
              1.139396845233569,
              0.8817826157532459,
              0.9157544104446935,
              ""
          ]
      },
      {
          "id": 470,
          "pos": [
              -10904.8759765625,
              3754.712158203125
          ],
          "mode": 0,
          "size": [
              265.4513854980469,
              369.30712890625
          ],
          "type": "ColorAdjustment",
          "color": "#232",
          "flags": {},
          "order": 135,
          "inputs": [
              {
                  "link": 1520,
                  "name": "image",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      1521
                  ]
              }
          ],
          "properties": {
              "ver": "8cf32f0eed017dffc2f7cc1e1e27a1765bf77f6d",
              "aux_id": "LAOGOU-666/Comfyui_LG_Tools",
              "cnr_id": "comfyui_lg_tools",
              "Node name for S&R": "ColorAdjustment"
          },
          "widgets_values": [
              1.139396845233569,
              0.8817826157532459,
              0.9157544104446935,
              ""
          ]
      },
      {
          "id": 469,
          "pos": [
              -10569.625,
              3764.519287109375
          ],
          "mode": 0,
          "size": [
              270,
              82
          ],
          "type": "LTXVFilmGrain",
          "color": "#232",
          "flags": {},
          "order": 138,
          "inputs": [
              {
                  "link": 1521,
                  "name": "images",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      1408,
                      1503,
                      1522,
                      1523
                  ]
              }
          ],
          "properties": {
              "ver": "6e9e6de05624b0aab09b81a2f4a5f473fa97988a",
              "cnr_id": "ComfyUI-LTXVideo",
              "Node name for S&R": "LTXVFilmGrain"
          },
          "widgets_values": [
              0.020000000000000004,
              0.5
          ]
      },
      {
          "id": 468,
          "pos": [
              -10630.88671875,
              2947.184814453125
          ],
          "mode": 0,
          "size": [
              270,
              82
          ],
          "type": "LTXVFilmGrain",
          "color": "#232",
          "flags": {},
          "order": 139,
          "inputs": [
              {
                  "link": 900,
                  "name": "images",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      1409,
                      1502,
                      1524,
                      1525
                  ]
              }
          ],
          "properties": {
              "ver": "6e9e6de05624b0aab09b81a2f4a5f473fa97988a",
              "cnr_id": "ComfyUI-LTXVideo",
              "Node name for S&R": "LTXVFilmGrain"
          },
          "widgets_values": [
              0.020000000000000004,
              0.5
          ]
      },
      {
          "id": 658,
          "pos": [
              -8297.7041015625,
              3528.3701171875
          ],
          "mode": 0,
          "size": [
              270,
              270.000244140625
          ],
          "type": "SaveImage",
          "color": "#222",
          "flags": {},
          "order": 152,
          "inputs": [
              {
                  "link": 1370,
                  "name": "images",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "SaveImage"
          },
          "widgets_values": [
              "CAST_ACTRESS_IN_ROLE"
          ]
      },
      {
          "id": 354,
          "pos": [
              -11220.21875,
              3992.220947265625
          ],
          "mode": 0,
          "size": [
              285.287109375,
              358
          ],
          "type": "ReActorFaceSwap",
          "color": "#232",
          "flags": {},
          "order": 132,
          "inputs": [
              {
                  "link": 2715,
                  "name": "input_image",
                  "type": "IMAGE"
              },
              {
                  "link": 2708,
                  "name": "source_image",
                  "type": "IMAGE",
                  "shape": 7
              },
              {
                  "link": null,
                  "name": "face_model",
                  "type": "FACE_MODEL",
                  "shape": 7
              },
              {
                  "link": 659,
                  "name": "face_boost",
                  "type": "FACE_BOOST",
                  "shape": 7
              }
          ],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "SWAPPED_IMAGE",
                  "type": "IMAGE",
                  "links": [
                      1520
                  ]
              },
              {
                  "name": "FACE_MODEL",
                  "type": "FACE_MODEL",
                  "links": null
              },
              {
                  "name": "ORIGINAL_IMAGE",
                  "type": "IMAGE",
                  "links": null
              }
          ],
          "properties": {
              "ver": "48a3ad27f99f775dcf63e61276e0110d256597ef",
              "cnr_id": "comfyui-reactor",
              "Node name for S&R": "ReActorFaceSwap"
          },
          "widgets_values": [
              true,
              "inswapper_128.onnx",
              "retinaface_resnet50",
              "codeformer-v0.1.0.pth",
              1,
              0.6000000000000001,
              "no",
              "no",
              "0",
              "0",
              1
          ]
      },
      {
          "id": 564,
          "pos": [
              -8220.0458984375,
              913.1327514648438
          ],
          "mode": 4,
          "size": [
              365.3121032714844,
              58
          ],
          "type": "DownloadAndLoadDepthAnythingV2Model",
          "color": "#223",
          "flags": {},
          "order": 1,
          "inputs": [],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "da_v2_model",
                  "type": "DAMODEL",
                  "links": [
                      1146
                  ]
              }
          ],
          "properties": {
              "ver": "9d7cb8c1e53b01744a75b599d3e91c93464a2d33",
              "cnr_id": "comfyui-depthanythingv2",
              "Node name for S&R": "DownloadAndLoadDepthAnythingV2Model"
          },
          "widgets_values": [
              "depth_anything_v2_vitl_fp16.safetensors"
          ]
      },
      {
          "id": 358,
          "pos": [
              -6685.65087890625,
              2103.598876953125
          ],
          "mode": 0,
          "size": [
              210,
              58
          ],
          "type": "INTConstant",
          "color": "#1b4669",
          "flags": {},
          "order": 2,
          "title": "Height",
          "inputs": [],
          "bgcolor": "#29699c",
          "outputs": [
              {
                  "name": "value",
                  "type": "INT",
                  "links": []
              }
          ],
          "properties": {
              "ver": "3e3a1a8aac61dc4515f6a7da74e026f05a80299f",
              "cnr_id": "comfyui-kjnodes",
              "Node name for S&R": "INTConstant"
          },
          "widgets_values": [
              768
          ]
      },
      {
          "id": 361,
          "pos": [
              -6696.12548828125,
              2234.52685546875
          ],
          "mode": 0,
          "size": [
              210,
              58
          ],
          "type": "INTConstant",
          "color": "#1b4669",
          "flags": {},
          "order": 3,
          "title": "Width",
          "inputs": [],
          "bgcolor": "#29699c",
          "outputs": [
              {
                  "name": "value",
                  "type": "INT",
                  "links": [
                      671,
                      1060,
                      1061,
                      1062,
                      1177,
                      1656
                  ]
              }
          ],
          "properties": {
              "ver": "3e3a1a8aac61dc4515f6a7da74e026f05a80299f",
              "cnr_id": "comfyui-kjnodes",
              "Node name for S&R": "INTConstant"
          },
          "widgets_values": [
              720
          ]
      },
      {
          "id": 360,
          "pos": [
              -6691.81298828125,
              2351.658935546875
          ],
          "mode": 0,
          "size": [
              210,
              58
          ],
          "type": "INTConstant",
          "color": "#1b4669",
          "flags": {},
          "order": 4,
          "title": "Height",
          "inputs": [],
          "bgcolor": "#29699c",
          "outputs": [
              {
                  "name": "value",
                  "type": "INT",
                  "links": [
                      672,
                      1063,
                      1064,
                      1065,
                      1178,
                      1657
                  ]
              }
          ],
          "properties": {
              "ver": "3e3a1a8aac61dc4515f6a7da74e026f05a80299f",
              "cnr_id": "comfyui-kjnodes",
              "Node name for S&R": "INTConstant"
          },
          "widgets_values": [
              1280
          ]
      },
      {
          "id": 714,
          "pos": [
              -6351.4658203125,
              2127.343017578125
          ],
          "mode": 4,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#223",
          "flags": {},
          "order": 39,
          "inputs": [
              {
                  "link": 1656,
                  "name": "",
                  "type": "*",
                  "widget": {
                      "name": "value"
                  }
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "",
                  "type": "INT",
                  "links": [
                      1658,
                      1660,
                      1662
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 715,
          "pos": [
              -6349.9677734375,
              2174.954833984375
          ],
          "mode": 4,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#223",
          "flags": {},
          "order": 41,
          "inputs": [
              {
                  "link": 1657,
                  "name": "",
                  "type": "*",
                  "widget": {
                      "name": "value"
                  }
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "",
                  "type": "INT",
                  "links": [
                      1659,
                      1661,
                      1663
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 310,
          "pos": [
              -9537.3798828125,
              720.5894775390625
          ],
          "mode": 0,
          "size": [
              270,
              266
          ],
          "type": "ImageResizeKJv2",
          "color": "#222",
          "flags": {
              "collapsed": false
          },
          "order": 62,
          "inputs": [
              {
                  "link": 587,
                  "name": "image",
                  "type": "IMAGE"
              },
              {
                  "link": 1672,
                  "name": "width",
                  "type": "INT",
                  "widget": {
                      "name": "width"
                  }
              },
              {
                  "link": 1673,
                  "name": "height",
                  "type": "INT",
                  "widget": {
                      "name": "height"
                  }
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      620,
                      686,
                      830
                  ]
              },
              {
                  "name": "width",
                  "type": "INT",
                  "links": []
              },
              {
                  "name": "height",
                  "type": "INT",
                  "links": []
              }
          ],
          "properties": {
              "ver": "5dcda71011870278c35d92ff77a677ed2e538f2d",
              "cnr_id": "comfyui-kjnodes",
              "Node name for S&R": "ImageResizeKJv2"
          },
          "widgets_values": [
              512,
              512,
              "lanczos",
              "pad",
              "255,255,255",
              "center",
              16,
              "cpu"
          ]
      },
      {
          "id": 646,
          "pos": [
              -8209.9677734375,
              1121.839599609375
          ],
          "mode": 4,
          "size": [
              270,
              82
          ],
          "type": "AIO_Preprocessor",
          "color": "#223",
          "flags": {
              "collapsed": false
          },
          "order": 98,
          "inputs": [
              {
                  "link": 1998,
                  "name": "image",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      1718,
                      1721
                  ]
              }
          ],
          "properties": {
              "ver": "1.0.7",
              "cnr_id": "comfyui_controlnet_aux",
              "Node name for S&R": "AIO_Preprocessor"
          },
          "widgets_values": [
              "DWPreprocessor",
              512
          ]
      },
      {
          "id": 566,
          "pos": [
              -8022.4453125,
              1012.74658203125
          ],
          "mode": 4,
          "size": [
              258.1479187011719,
              258
          ],
          "type": "PreviewImage",
          "color": "#223",
          "flags": {
              "collapsed": true
          },
          "order": 112,
          "inputs": [
              {
                  "link": 1717,
                  "name": "images",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#335",
          "outputs": [],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "PreviewImage"
          },
          "widgets_values": []
      },
      {
          "id": 641,
          "pos": [
              -7785.08740234375,
              2795.273681640625
          ],
          "mode": 0,
          "size": [
              140,
              246
          ],
          "type": "PreviewImage",
          "color": "#222",
          "flags": {},
          "order": 160,
          "inputs": [
              {
                  "link": 1303,
                  "name": "images",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "PreviewImage"
          },
          "widgets_values": []
      },
      {
          "id": 349,
          "pos": [
              -10926.1435546875,
              3365.941650390625
          ],
          "mode": 0,
          "size": [
              262.88043212890625,
              299.83282470703125
          ],
          "type": "SaveImage",
          "color": "#232",
          "flags": {},
          "order": 148,
          "inputs": [
              {
                  "link": 1525,
                  "name": "images",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#353",
          "outputs": [],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "SaveImage"
          },
          "widgets_values": [
              "FEMALE_CHARACTER_FACESWAP"
          ]
      },
      {
          "id": 471,
          "pos": [
              -10908.1298828125,
              4187.2802734375
          ],
          "mode": 0,
          "size": [
              262.88043212890625,
              299.83282470703125
          ],
          "type": "SaveImage",
          "color": "#232",
          "flags": {},
          "order": 144,
          "inputs": [
              {
                  "link": 1523,
                  "name": "images",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#353",
          "outputs": [],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "SaveImage"
          },
          "widgets_values": [
              "MALE_CHARACTER_FACESWAP"
          ]
      },
      {
          "id": 493,
          "pos": [
              -9440.2353515625,
              3358.823974609375
          ],
          "mode": 0,
          "size": [
              262.88043212890625,
              299.83282470703125
          ],
          "type": "SaveImage",
          "color": "#232",
          "flags": {},
          "order": 170,
          "inputs": [
              {
                  "link": 978,
                  "name": "images",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#353",
          "outputs": [],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "SaveImage"
          },
          "widgets_values": [
              "COUPLE_FACESWAP"
          ]
      },
      {
          "id": 494,
          "pos": [
              -9435.958984375,
              4171.99755859375
          ],
          "mode": 0,
          "size": [
              262.88043212890625,
              299.83282470703125
          ],
          "type": "SaveImage",
          "color": "#232",
          "flags": {},
          "order": 176,
          "inputs": [
              {
                  "link": 984,
                  "name": "images",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#353",
          "outputs": [],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "SaveImage"
          },
          "widgets_values": [
              "COUPLE_FINAL"
          ]
      },
      {
          "id": 656,
          "pos": [
              -8256.158203125,
              4567.32568359375
          ],
          "mode": 0,
          "size": [
              210,
              270
          ],
          "type": "SaveImage",
          "color": "#222",
          "flags": {},
          "order": 150,
          "inputs": [
              {
                  "link": 1367,
                  "name": "images",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "SaveImage"
          },
          "widgets_values": [
              "CAST_ACTOR_IN_ROLE"
          ]
      },
      {
          "id": 668,
          "pos": [
              -7630.5751953125,
              2792.53271484375
          ],
          "mode": 0,
          "size": [
              140,
              246.00006103515625
          ],
          "type": "PreviewImage",
          "color": "#222",
          "flags": {},
          "order": 182,
          "inputs": [
              {
                  "link": 1419,
                  "name": "images",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "PreviewImage"
          },
          "widgets_values": []
      },
      {
          "id": 608,
          "pos": [
              -7756.73583984375,
              3211.601318359375
          ],
          "mode": 0,
          "size": [
              270,
              78
          ],
          "type": "AILab_ImageStitch",
          "color": "#222",
          "flags": {},
          "order": 179,
          "inputs": [
              {
                  "link": 1463,
                  "name": "image1",
                  "type": "IMAGE"
              },
              {
                  "link": 2028,
                  "name": "image2",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      1419,
                      1823
                  ]
              }
          ],
          "properties": {
              "ver": "daf0b01deb1c529dfb543093bba2ed586aad7886",
              "cnr_id": "comfyui-rmbg",
              "Node name for S&R": "AILab_ImageStitch"
          },
          "widgets_values": [
              "right"
          ]
      },
      {
          "id": 581,
          "pos": [
              -6356.67529296875,
              2630.71240234375
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#223",
          "flags": {},
          "order": 38,
          "inputs": [
              {
                  "link": 1177,
                  "name": "",
                  "type": "*",
                  "widget": {
                      "name": "value"
                  }
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "",
                  "type": "INT",
                  "links": [
                      1668,
                      1670,
                      1672,
                      1674,
                      1676,
                      1821
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 582,
          "pos": [
              -6355.1767578125,
              2678.326416015625
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#223",
          "flags": {},
          "order": 40,
          "inputs": [
              {
                  "link": 1178,
                  "name": "",
                  "type": "*",
                  "widget": {
                      "name": "value"
                  }
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "",
                  "type": "INT",
                  "links": [
                      1669,
                      1671,
                      1673,
                      1675,
                      1677,
                      1822
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 735,
          "pos": [
              -6358.7490234375,
              2392.908203125
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#223",
          "flags": {},
          "order": 188,
          "inputs": [
              {
                  "link": 1946,
                  "name": "",
                  "type": "*"
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "",
                  "type": "IMAGE",
                  "links": [
                      1947
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 525,
          "pos": [
              -6997.5322265625,
              1700.5390625
          ],
          "mode": 0,
          "size": [
              140,
              46
          ],
          "type": "ImageBatch",
          "color": "#223",
          "flags": {},
          "order": 92,
          "inputs": [
              {
                  "link": 1024,
                  "name": "image1",
                  "type": "IMAGE"
              },
              {
                  "link": 1108,
                  "name": "image2",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": []
              }
          ],
          "properties": {
              "ver": "0.3.39",
              "cnr_id": "comfy-core",
              "Node name for S&R": "ImageBatch",
              "widget_ue_connectable": {}
          },
          "widgets_values": []
      },
      {
          "id": 518,
          "pos": [
              -7163.9873046875,
              1705.26025390625
          ],
          "mode": 0,
          "size": [
              140,
              46
          ],
          "type": "ImageBatch",
          "color": "#223",
          "flags": {},
          "order": 77,
          "inputs": [
              {
                  "link": 1113,
                  "name": "image1",
                  "type": "IMAGE"
              },
              {
                  "link": 1114,
                  "name": "image2",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      1024
                  ]
              }
          ],
          "properties": {
              "ver": "0.3.39",
              "cnr_id": "comfy-core",
              "Node name for S&R": "ImageBatch",
              "widget_ue_connectable": {}
          },
          "widgets_values": []
      },
      {
          "id": 538,
          "pos": [
              -7447.125,
              920.9718627929688
          ],
          "mode": 0,
          "size": [
              270,
              266
          ],
          "type": "ImageResizeKJv2",
          "color": "#223",
          "flags": {
              "collapsed": false
          },
          "order": 49,
          "inputs": [
              {
                  "link": 1074,
                  "name": "image",
                  "type": "IMAGE"
              },
              {
                  "link": 1061,
                  "name": "width",
                  "type": "INT",
                  "widget": {
                      "name": "width"
                  }
              },
              {
                  "link": 1064,
                  "name": "height",
                  "type": "INT",
                  "widget": {
                      "name": "height"
                  }
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      1114,
                      1191
                  ]
              },
              {
                  "name": "width",
                  "type": "INT",
                  "links": []
              },
              {
                  "name": "height",
                  "type": "INT",
                  "links": []
              }
          ],
          "properties": {
              "ver": "5dcda71011870278c35d92ff77a677ed2e538f2d",
              "cnr_id": "comfyui-kjnodes",
              "Node name for S&R": "ImageResizeKJv2"
          },
          "widgets_values": [
              512,
              512,
              "lanczos",
              "pad",
              "255,255,255",
              "center",
              16,
              "cpu"
          ]
      },
      {
          "id": 539,
          "pos": [
              -7130.197265625,
              923.931640625
          ],
          "mode": 0,
          "size": [
              270,
              266
          ],
          "type": "ImageResizeKJv2",
          "color": "#223",
          "flags": {
              "collapsed": false
          },
          "order": 50,
          "inputs": [
              {
                  "link": 1075,
                  "name": "image",
                  "type": "IMAGE"
              },
              {
                  "link": 1062,
                  "name": "width",
                  "type": "INT",
                  "widget": {
                      "name": "width"
                  }
              },
              {
                  "link": 1065,
                  "name": "height",
                  "type": "INT",
                  "widget": {
                      "name": "height"
                  }
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      1108,
                      1190
                  ]
              },
              {
                  "name": "width",
                  "type": "INT",
                  "links": []
              },
              {
                  "name": "height",
                  "type": "INT",
                  "links": []
              }
          ],
          "properties": {
              "ver": "5dcda71011870278c35d92ff77a677ed2e538f2d",
              "cnr_id": "comfyui-kjnodes",
              "Node name for S&R": "ImageResizeKJv2"
          },
          "widgets_values": [
              512,
              512,
              "lanczos",
              "pad",
              "255,255,255",
              "center",
              16,
              "cpu"
          ]
      },
      {
          "id": 749,
          "pos": [
              -6208.66015625,
              2630.036376953125
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#223",
          "flags": {},
          "order": 180,
          "inputs": [
              {
                  "link": 2030,
                  "name": "",
                  "type": "*"
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "",
                  "type": "IMAGE",
                  "links": []
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 327,
          "pos": [
              -8737.546875,
              659.457763671875
          ],
          "mode": 0,
          "size": [
              422.5988464355469,
              498.01922607421875
          ],
          "type": "Image Comparer (rgthree)",
          "color": "#222",
          "flags": {},
          "order": 127,
          "inputs": [
              {
                  "dir": 3,
                  "link": 620,
                  "name": "image_a",
                  "type": "IMAGE"
              },
              {
                  "dir": 3,
                  "link": 622,
                  "name": "image_b",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [],
          "properties": {
              "ver": "5d771b8b56a343c24a26e8cea1f0c87c3d58102f",
              "cnr_id": "rgthree-comfy",
              "comparer_mode": "Slide"
          },
          "widgets_values": [
              [
                  {
                      "url": "/api/view?filename=rgthree.compare._temp_oacct_00007_.png&type=temp&subfolder=&rand=0.9711930179294311",
                      "name": "A",
                      "selected": true
                  },
                  {
                      "url": "/api/view?filename=rgthree.compare._temp_oacct_00008_.png&type=temp&subfolder=&rand=0.7209030323496606",
                      "name": "B",
                      "selected": true
                  }
              ]
          ]
      },
      {
          "id": 352,
          "pos": [
              -11517.453125,
              4216.392578125
          ],
          "mode": 0,
          "size": [
              292.73046875,
              178
          ],
          "type": "ReActorFaceBoost",
          "color": "#232",
          "flags": {},
          "order": 72,
          "inputs": [
              {
                  "link": 1378,
                  "name": "boost_model",
                  "type": "COMBO",
                  "widget": {
                      "name": "boost_model"
                  }
              }
          ],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "FACE_BOOST",
                  "type": "FACE_BOOST",
                  "links": [
                      659
                  ]
              }
          ],
          "properties": {
              "ver": "48a3ad27f99f775dcf63e61276e0110d256597ef",
              "cnr_id": "comfyui-reactor",
              "Node name for S&R": "ReActorFaceBoost"
          },
          "widgets_values": [
              true,
              "GPEN-BFR-512.pth",
              "Bicubic",
              1,
              0.5,
              false
          ]
      },
      {
          "id": 499,
          "pos": [
              -9159.94921875,
              3086.894287109375
          ],
          "mode": 0,
          "size": [
              497.44195556640625,
              569.3330688476562
          ],
          "type": "Image Comparer (rgthree)",
          "color": "#232",
          "flags": {},
          "order": 171,
          "inputs": [
              {
                  "dir": 3,
                  "link": 2427,
                  "name": "image_a",
                  "type": "IMAGE"
              },
              {
                  "dir": 3,
                  "link": 979,
                  "name": "image_b",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#353",
          "outputs": [],
          "properties": {
              "ver": "5d771b8b56a343c24a26e8cea1f0c87c3d58102f",
              "cnr_id": "rgthree-comfy",
              "comparer_mode": "Slide"
          },
          "widgets_values": [
              [
                  {
                      "url": "/api/view?filename=rgthree.compare._temp_dtobq_00007_.png&type=temp&subfolder=&rand=0.8266045350180395",
                      "name": "A",
                      "selected": true
                  },
                  {
                      "url": "/api/view?filename=rgthree.compare._temp_dtobq_00008_.png&type=temp&subfolder=&rand=0.5426516809222217",
                      "name": "B",
                      "selected": true
                  }
              ]
          ]
      },
      {
          "id": 565,
          "pos": [
              -8209.0263671875,
              1257.8895263671875
          ],
          "mode": 4,
          "size": [
              352.8114013671875,
              334
          ],
          "type": "VHS_VideoCombine",
          "color": "#223",
          "flags": {
              "collapsed": false
          },
          "order": 113,
          "inputs": [
              {
                  "link": 1720,
                  "name": "images",
                  "type": "IMAGE"
              },
              {
                  "link": null,
                  "name": "audio",
                  "type": "AUDIO",
                  "shape": 7
              },
              {
                  "link": null,
                  "name": "meta_batch",
                  "type": "VHS_BatchManager",
                  "shape": 7
              },
              {
                  "link": null,
                  "name": "vae",
                  "type": "VAE",
                  "shape": 7
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "Filenames",
                  "type": "VHS_FILENAMES",
                  "links": null
              }
          ],
          "properties": {
              "ver": "f7369389620ff244ddd6086cf0fa792a569086f2",
              "cnr_id": "comfyui-videohelpersuite",
              "Node name for S&R": "VHS_VideoCombine"
          },
          "widgets_values": {
              "crf": 19,
              "format": "video/h264-mp4",
              "pix_fmt": "yuv420p",
              "pingpong": false,
              "frame_rate": 24,
              "loop_count": 0,
              "save_output": true,
              "videopreview": {
                  "hidden": false,
                  "params": {
                      "url": "https://comfy-deploy-output.s3.us-east-2.amazonaws.com/outputs/runs/2110086a-40b5-453e-afdb-f03c8bab1bc7/Any2LiveActionRecast_depth_2_00001.mp4",
                      "type": "output",
                      "format": "video/h264-mp4",
                      "filename": "depth_map_00001.mp4",
                      "fullpath": "/comfyui/output/depth_map_00001.mp4",
                      "workflow": "depth_map_00001.png",
                      "is_public": true,
                      "subfolder": "",
                      "frame_rate": 24,
                      "upload_duration": 3.4407487549997313
                  },
                  "paused": false
              },
              "save_metadata": true,
              "trim_to_audio": false,
              "filename_prefix": "depth_map"
          }
      },
      {
          "id": 719,
          "pos": [
              -8211.9052734375,
              1313.360107421875
          ],
          "mode": 4,
          "size": [
              352.8114013671875,
              334
          ],
          "type": "VHS_VideoCombine",
          "color": "#223",
          "flags": {},
          "order": 110,
          "inputs": [
              {
                  "link": 1718,
                  "name": "images",
                  "type": "IMAGE"
              },
              {
                  "link": null,
                  "name": "audio",
                  "type": "AUDIO",
                  "shape": 7
              },
              {
                  "link": null,
                  "name": "meta_batch",
                  "type": "VHS_BatchManager",
                  "shape": 7
              },
              {
                  "link": null,
                  "name": "vae",
                  "type": "VAE",
                  "shape": 7
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "Filenames",
                  "type": "VHS_FILENAMES",
                  "links": null
              }
          ],
          "properties": {
              "ver": "f7369389620ff244ddd6086cf0fa792a569086f2",
              "cnr_id": "comfyui-videohelpersuite",
              "Node name for S&R": "VHS_VideoCombine"
          },
          "widgets_values": {
              "crf": 19,
              "format": "video/h264-mp4",
              "pix_fmt": "yuv420p",
              "pingpong": false,
              "frame_rate": 24,
              "loop_count": 0,
              "save_output": true,
              "videopreview": {
                  "hidden": false,
                  "params": {
                      "url": "https://comfy-deploy-output.s3.us-east-2.amazonaws.com/outputs/runs/2110086a-40b5-453e-afdb-f03c8bab1bc7/Any2LiveActionRecast_depth_2_00001.mp4",
                      "type": "output",
                      "format": "video/h264-mp4",
                      "filename": "OP_map_00001.mp4",
                      "fullpath": "/comfyui/output/OP_map_00001.mp4",
                      "workflow": "OP_map_00001.png",
                      "is_public": true,
                      "subfolder": "",
                      "frame_rate": 24,
                      "upload_duration": 3.4407487549997313
                  },
                  "paused": false
              },
              "save_metadata": true,
              "trim_to_audio": false,
              "filename_prefix": "OP_map"
          }
      },
      {
          "id": 720,
          "pos": [
              -8026.22509765625,
              1064.34814453125
          ],
          "mode": 4,
          "size": [
              140,
              246
          ],
          "type": "PreviewImage",
          "color": "#223",
          "flags": {
              "collapsed": true
          },
          "order": 111,
          "inputs": [
              {
                  "link": 1721,
                  "name": "images",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#335",
          "outputs": [],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "PreviewImage"
          },
          "widgets_values": []
      },
      {
          "id": 791,
          "pos": [
              -7586.90625,
              918.9949951171875
          ],
          "mode": 4,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#223",
          "flags": {
              "pinned": true
          },
          "order": 87,
          "inputs": [
              {
                  "link": 1997,
                  "name": "",
                  "type": "*"
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "",
                  "type": "IMAGE",
                  "links": [
                      1998,
                      1999
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 639,
          "pos": [
              -8968.392578125,
              1300.722900390625
          ],
          "mode": 0,
          "size": [
              140,
              246.0001220703125
          ],
          "type": "PreviewImage",
          "color": "#222",
          "flags": {
              "collapsed": false
          },
          "order": 79,
          "inputs": [
              {
                  "link": 1301,
                  "name": "images",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "PreviewImage"
          },
          "widgets_values": []
      },
      {
          "id": 604,
          "pos": [
              -6034.5771484375,
              2227.049072265625
          ],
          "mode": 0,
          "size": [
              270,
              106
          ],
          "type": "ComfyDeployOutputText",
          "color": "#233",
          "flags": {},
          "order": 201,
          "inputs": [
              {
                  "link": 1228,
                  "name": "text",
                  "type": "STRING"
              }
          ],
          "bgcolor": "#355",
          "outputs": [],
          "properties": {
              "ver": "b889f79baf9e099d5e54bd20bab4aa1e7c3296c0",
              "cnr_id": "comfyui-deploy",
              "Node name for S&R": "ComfyDeployOutputText"
          },
          "widgets_values": [
              "FAL_KLING_VIDEO",
              "txt",
              "output_text"
          ]
      },
      {
          "id": 571,
          "pos": [
              -6035.4033203125,
              2395.433349609375
          ],
          "mode": 0,
          "size": [
              270,
              130
          ],
          "type": "SaveText|pysssss",
          "color": "#233",
          "flags": {},
          "order": 199,
          "inputs": [
              {
                  "link": 1159,
                  "name": "text",
                  "type": "STRING"
              }
          ],
          "bgcolor": "#355",
          "outputs": [
              {
                  "name": "STRING",
                  "type": "STRING",
                  "links": null
              }
          ],
          "properties": {
              "ver": "1.2.5",
              "cnr_id": "comfyui-custom-scripts",
              "Node name for S&R": "SaveText|pysssss"
          },
          "widgets_values": [
              "input",
              "file.txt",
              "append",
              true
          ]
      },
      {
          "id": 718,
          "pos": [
              -6889.578125,
              1762.3331298828125
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#223",
          "flags": {},
          "order": 88,
          "inputs": [
              {
                  "link": 1779,
                  "name": "",
                  "type": "*"
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "",
                  "type": "IMAGE",
                  "links": [
                      2017
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 309,
          "pos": [
              -5723.88818359375,
              389.48614501953125
          ],
          "mode": 0,
          "size": [
              283.5269470214844,
              58
          ],
          "type": "OpenAIProviderNode",
          "color": "#222",
          "flags": {},
          "order": 42,
          "inputs": [
              {
                  "link": null,
                  "name": "context",
                  "type": "*",
                  "shape": 7
              },
              {
                  "link": 2068,
                  "name": "llm_model",
                  "type": "STRING",
                  "widget": {
                      "name": "llm_model"
                  }
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "context",
                  "type": "*",
                  "links": [
                      638,
                      858,
                      2648,
                      2654
                  ]
              }
          ],
          "properties": {
              "ver": "3d82dbfe091d84868212e5f275deb5447fa4e659",
              "cnr_id": "llm-toolkit",
              "llm_model": "gpt-4o",
              "Node name for S&R": "OpenAIProviderNode"
          },
          "widgets_values": [
              "gpt-4o"
          ]
      },
      {
          "id": 302,
          "pos": [
              -5724.90771484375,
              493.2318420410156
          ],
          "mode": 0,
          "size": [
              400,
              200
          ],
          "type": "ComfyUIDeployExternalText",
          "color": "#222",
          "flags": {},
          "order": 5,
          "inputs": [],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "text",
                  "type": "STRING",
                  "links": [
                      2068
                  ]
              }
          ],
          "properties": {
              "ver": "b889f79baf9e099d5e54bd20bab4aa1e7c3296c0",
              "cnr_id": "comfyui-deploy",
              "Node name for S&R": "ComfyUIDeployExternalText"
          },
          "widgets_values": [
              "llm_model",
              "gpt-4.5-preview-2025-02-27",
              "",
              "03-mini, \ngpt-4.5-preview-2025-02-27,"
          ]
      },
      {
          "id": 628,
          "pos": [
              -6359.712890625,
              2266.089111328125
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#223",
          "flags": {},
          "order": 100,
          "inputs": [
              {
                  "link": 2017,
                  "name": "",
                  "type": "*"
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "",
                  "type": "IMAGE",
                  "links": []
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 787,
          "pos": [
              -6194.2763671875,
              1330.041015625
          ],
          "mode": 0,
          "size": [
              400,
              208
          ],
          "type": "ComfyUIDeployExternalNumberSlider",
          "color": "#222",
          "flags": {},
          "order": 6,
          "inputs": [],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "value",
                  "type": "FLOAT",
                  "links": [
                      1986,
                      1988
                  ]
              }
          ],
          "properties": {
              "ver": "ceb53bcb228176b854c7d72140a0dbedaa212eea",
              "cnr_id": "comfyui-deploy",
              "Node name for S&R": "ComfyUIDeployExternalNumberSlider"
          },
          "widgets_values": [
              "FPS",
              24.000000000000004,
              0,
              1,
              "",
              "15 if using WAN VACE 24 if Phantom\n"
          ]
      },
      {
          "id": 537,
          "pos": [
              -7761.49853515625,
              927.237548828125
          ],
          "mode": 0,
          "size": [
              270,
              266
          ],
          "type": "ImageResizeKJv2",
          "color": "#223",
          "flags": {
              "collapsed": false
          },
          "order": 56,
          "inputs": [
              {
                  "link": 1076,
                  "name": "image",
                  "type": "IMAGE"
              },
              {
                  "link": 1060,
                  "name": "width",
                  "type": "INT",
                  "widget": {
                      "name": "width"
                  }
              },
              {
                  "link": 1063,
                  "name": "height",
                  "type": "INT",
                  "widget": {
                      "name": "height"
                  }
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      1113,
                      1164
                  ]
              },
              {
                  "name": "width",
                  "type": "INT",
                  "links": []
              },
              {
                  "name": "height",
                  "type": "INT",
                  "links": []
              }
          ],
          "properties": {
              "ver": "5dcda71011870278c35d92ff77a677ed2e538f2d",
              "cnr_id": "comfyui-kjnodes",
              "Node name for S&R": "ImageResizeKJv2"
          },
          "widgets_values": [
              512,
              512,
              "lanczos",
              "pad",
              "255,255,255",
              "center",
              16,
              "cpu"
          ]
      },
      {
          "id": 312,
          "pos": [
              -9547.1201171875,
              1330.4923095703125
          ],
          "mode": 0,
          "size": [
              270,
              266
          ],
          "type": "ImageResizeKJv2",
          "color": "#222",
          "flags": {
              "collapsed": false
          },
          "order": 63,
          "inputs": [
              {
                  "link": 592,
                  "name": "image",
                  "type": "IMAGE"
              },
              {
                  "link": 1674,
                  "name": "width",
                  "type": "INT",
                  "widget": {
                      "name": "width"
                  }
              },
              {
                  "link": 1675,
                  "name": "height",
                  "type": "INT",
                  "widget": {
                      "name": "height"
                  }
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      687,
                      831,
                      1511
                  ]
              },
              {
                  "name": "width",
                  "type": "INT",
                  "links": []
              },
              {
                  "name": "height",
                  "type": "INT",
                  "links": []
              }
          ],
          "properties": {
              "ver": "5dcda71011870278c35d92ff77a677ed2e538f2d",
              "cnr_id": "comfyui-kjnodes",
              "Node name for S&R": "ImageResizeKJv2"
          },
          "widgets_values": [
              480,
              832,
              "lanczos",
              "crop",
              "172,172,172",
              "center",
              16,
              "cpu"
          ]
      },
      {
          "id": 770,
          "pos": [
              -7447.798828125,
              2797.9072265625
          ],
          "mode": 0,
          "size": [
              270,
              270
          ],
          "type": "SaveImage",
          "color": "#222",
          "flags": {},
          "order": 192,
          "inputs": [
              {
                  "link": 1947,
                  "name": "images",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "SaveImage"
          },
          "widgets_values": [
              "REF_STITCH"
          ]
      },
      {
          "id": 311,
          "pos": [
              -9492.6435546875,
              1222.8880615234375
          ],
          "mode": 0,
          "size": [
              140,
              46
          ],
          "type": "ImageBatch",
          "color": "#222",
          "flags": {},
          "order": 80,
          "inputs": [
              {
                  "link": 686,
                  "name": "image1",
                  "type": "IMAGE"
              },
              {
                  "link": 687,
                  "name": "image2",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      2655
                  ]
              }
          ],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "ImageBatch"
          },
          "widgets_values": []
      },
      {
          "id": 341,
          "pos": [
              -6184.3056640625,
              1053.247314453125
          ],
          "mode": 0,
          "size": [
              400,
              200
          ],
          "type": "ComfyUIDeployExternalNumberInt",
          "color": "#222",
          "flags": {},
          "order": 7,
          "inputs": [],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "value",
                  "type": "INT",
                  "links": [
                      1182
                  ]
              }
          ],
          "properties": {
              "ver": "b889f79baf9e099d5e54bd20bab4aa1e7c3296c0",
              "cnr_id": "comfyui-deploy",
              "Node name for S&R": "ComfyUIDeployExternalNumberInt"
          },
          "widgets_values": [
              "FRAMES",
              81,
              "",
              ""
          ]
      },
      {
          "id": 870,
          "pos": [
              -7066.0439453125,
              3188.236083984375
          ],
          "mode": 0,
          "size": [
              249.37225341796875,
              258
          ],
          "type": "PreviewImage",
          "color": "#222",
          "flags": {},
          "order": 103,
          "inputs": [
              {
                  "link": 2190,
                  "name": "images",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "PreviewImage"
          },
          "widgets_values": []
      },
      {
          "id": 869,
          "pos": [
              -6720.35546875,
              3192.75927734375
          ],
          "mode": 0,
          "size": [
              218.04722595214844,
              258
          ],
          "type": "PreviewImage",
          "color": "#222",
          "flags": {},
          "order": 104,
          "inputs": [
              {
                  "link": 2189,
                  "name": "images",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "PreviewImage"
          },
          "widgets_values": []
      },
      {
          "id": 866,
          "pos": [
              -7057.3779296875,
              2841.966796875
          ],
          "mode": 0,
          "size": [
              233.3152618408203,
              258
          ],
          "type": "PreviewImage",
          "color": "#222",
          "flags": {},
          "order": 101,
          "inputs": [
              {
                  "link": 2178,
                  "name": "images",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "PreviewImage"
          },
          "widgets_values": []
      },
      {
          "id": 750,
          "pos": [
              -6205.47119140625,
              2757.405029296875
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#223",
          "flags": {},
          "order": 86,
          "inputs": [
              {
                  "link": 2088,
                  "name": "",
                  "type": "*"
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "",
                  "type": "IMAGE",
                  "links": []
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 803,
          "pos": [
              -6238.22802734375,
              3050.0595703125
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#222",
          "flags": {},
          "order": 178,
          "inputs": [
              {
                  "link": 2692,
                  "name": "",
                  "type": "*"
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "",
                  "type": "IMAGE",
                  "links": [
                      2028,
                      2030,
                      2196
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 474,
          "pos": [
              -9542.6591796875,
              2392.724853515625
          ],
          "mode": 0,
          "size": [
              270,
              266
          ],
          "type": "ImageResizeKJv2",
          "color": "#222",
          "flags": {
              "collapsed": false
          },
          "order": 66,
          "inputs": [
              {
                  "link": 915,
                  "name": "image",
                  "type": "IMAGE"
              },
              {
                  "link": 1660,
                  "name": "width",
                  "type": "INT",
                  "widget": {
                      "name": "width"
                  }
              },
              {
                  "link": 1661,
                  "name": "height",
                  "type": "INT",
                  "widget": {
                      "name": "height"
                  }
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      1533,
                      2246,
                      2486
                  ]
              },
              {
                  "name": "width",
                  "type": "INT",
                  "links": []
              },
              {
                  "name": "height",
                  "type": "INT",
                  "links": []
              }
          ],
          "properties": {
              "ver": "5dcda71011870278c35d92ff77a677ed2e538f2d",
              "cnr_id": "comfyui-kjnodes",
              "Node name for S&R": "ImageResizeKJv2"
          },
          "widgets_values": [
              480,
              832,
              "lanczos",
              "crop",
              "172,172,172",
              "center",
              16,
              "cpu"
          ]
      },
      {
          "id": 740,
          "pos": [
              -7460.01171875,
              3192.537353515625
          ],
          "mode": 0,
          "size": [
              270,
              266
          ],
          "type": "ImageResizeKJv2",
          "color": "#222",
          "flags": {
              "collapsed": true
          },
          "order": 183,
          "inputs": [
              {
                  "link": 1823,
                  "name": "image",
                  "type": "IMAGE"
              },
              {
                  "link": 1821,
                  "name": "width",
                  "type": "INT",
                  "widget": {
                      "name": "width"
                  }
              },
              {
                  "link": 1822,
                  "name": "height",
                  "type": "INT",
                  "widget": {
                      "name": "height"
                  }
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      1946
                  ]
              },
              {
                  "name": "width",
                  "type": "INT",
                  "links": []
              },
              {
                  "name": "height",
                  "type": "INT",
                  "links": []
              }
          ],
          "properties": {
              "ver": "5dcda71011870278c35d92ff77a677ed2e538f2d",
              "cnr_id": "comfyui-kjnodes",
              "Node name for S&R": "ImageResizeKJv2"
          },
          "widgets_values": [
              480,
              832,
              "lanczos",
              "pad_edge",
              "172,172,172",
              "center",
              16,
              "cpu"
          ]
      },
      {
          "id": 583,
          "pos": [
              -6204.70849609375,
              2285.77978515625
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#223",
          "flags": {},
          "order": 44,
          "inputs": [
              {
                  "link": 1182,
                  "name": "",
                  "type": "*",
                  "widget": {
                      "name": "value"
                  }
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "",
                  "type": "INT",
                  "links": [
                      2254,
                      2255,
                      2256
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 883,
          "pos": [
              -7474.74267578125,
              3416.79931640625
          ],
          "mode": 0,
          "size": [
              140,
              246
          ],
          "type": "PreviewImage",
          "color": "#222",
          "flags": {},
          "order": 189,
          "inputs": [
              {
                  "link": 2231,
                  "name": "images",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "PreviewImage"
          },
          "widgets_values": []
      },
      {
          "id": 882,
          "pos": [
              -7475.09521484375,
              3713.847900390625
          ],
          "mode": 0,
          "size": [
              270,
              142
          ],
          "type": "ImageBatchMulti",
          "color": "#222",
          "flags": {
              "collapsed": true
          },
          "order": 185,
          "inputs": [
              {
                  "link": 2228,
                  "name": "image_1",
                  "type": "IMAGE"
              },
              {
                  "link": 2229,
                  "name": "image_2",
                  "type": "IMAGE"
              },
              {
                  "link": 2230,
                  "name": "image_3",
                  "type": "IMAGE"
              },
              {
                  "link": null,
                  "name": "image_4",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "images",
                  "type": "IMAGE",
                  "links": [
                      2231
                  ]
              }
          ],
          "properties": {
              "ver": "44565e9bffc89de454d06b4abe08137d1247652a",
              "cnr_id": "comfyui-kjnodes"
          },
          "widgets_values": [
              3,
              null
          ]
      },
      {
          "id": 640,
          "pos": [
              -7766.2216796875,
              3085.93896484375
          ],
          "mode": 0,
          "size": [
              270,
              78
          ],
          "type": "AILab_ImageStitch",
          "color": "#222",
          "flags": {},
          "order": 157,
          "inputs": [
              {
                  "link": 2033,
                  "name": "image1",
                  "type": "IMAGE"
              },
              {
                  "link": 2037,
                  "name": "image2",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      1303,
                      1463
                  ]
              }
          ],
          "properties": {
              "ver": "daf0b01deb1c529dfb543093bba2ed586aad7886",
              "cnr_id": "comfyui-rmbg",
              "Node name for S&R": "AILab_ImageStitch"
          },
          "widgets_values": [
              "bottom"
          ]
      },
      {
          "id": 949,
          "pos": [
              -4777.896484375,
              3754.0224609375
          ],
          "mode": 0,
          "size": [
              292.73046875,
              178
          ],
          "type": "ReActorFaceBoost",
          "color": "#232",
          "flags": {},
          "order": 47,
          "inputs": [
              {
                  "link": 2421,
                  "name": "boost_model",
                  "type": "COMBO",
                  "widget": {
                      "name": "boost_model"
                  }
              }
          ],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "FACE_BOOST",
                  "type": "FACE_BOOST",
                  "links": [
                      2401
                  ]
              }
          ],
          "properties": {
              "ver": "48a3ad27f99f775dcf63e61276e0110d256597ef",
              "cnr_id": "comfyui-reactor",
              "Node name for S&R": "ReActorFaceBoost"
          },
          "widgets_values": [
              true,
              "GPEN-BFR-512.onnx",
              "Bicubic",
              1,
              0.5,
              false
          ]
      },
      {
          "id": 950,
          "pos": [
              -4142.09228515625,
              3256.297607421875
          ],
          "mode": 0,
          "size": [
              265.4513854980469,
              369.30712890625
          ],
          "type": "ColorAdjustment",
          "color": "#232",
          "flags": {},
          "order": 214,
          "inputs": [
              {
                  "link": 2394,
                  "name": "image",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      2398
                  ]
              }
          ],
          "properties": {
              "ver": "8cf32f0eed017dffc2f7cc1e1e27a1765bf77f6d",
              "aux_id": "LAOGOU-666/Comfyui_LG_Tools",
              "cnr_id": "comfyui_lg_tools",
              "Node name for S&R": "ColorAdjustment"
          },
          "widgets_values": [
              1.139396845233569,
              0.8817826157532459,
              0.9157544104446935,
              ""
          ]
      },
      {
          "id": 951,
          "pos": [
              -4149.83544921875,
              2023.2674560546875
          ],
          "mode": 0,
          "size": [
              265.4513854980469,
              369.30712890625
          ],
          "type": "ColorAdjustment",
          "color": "#232",
          "flags": {},
          "order": 209,
          "inputs": [
              {
                  "link": 2395,
                  "name": "image",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      2399
                  ]
              }
          ],
          "properties": {
              "ver": "8cf32f0eed017dffc2f7cc1e1e27a1765bf77f6d",
              "aux_id": "LAOGOU-666/Comfyui_LG_Tools",
              "cnr_id": "comfyui_lg_tools",
              "Node name for S&R": "ColorAdjustment"
          },
          "widgets_values": [
              1.139396845233569,
              0.8817826157532459,
              0.9157544104446935,
              ""
          ]
      },
      {
          "id": 954,
          "pos": [
              -4468.31201171875,
              3369.259521484375
          ],
          "mode": 0,
          "size": [
              210,
              88
          ],
          "type": "Note",
          "color": "#232",
          "flags": {},
          "order": 8,
          "inputs": [],
          "bgcolor": "#353",
          "outputs": [],
          "properties": {},
          "widgets_values": [
              "if man on the right   1 \notherwise 0"
          ]
      },
      {
          "id": 965,
          "pos": [
              -4765.7958984375,
              3365.127197265625
          ],
          "mode": 0,
          "size": [
              270,
              58
          ],
          "type": "PrimitiveString",
          "color": "#232",
          "flags": {},
          "order": 55,
          "inputs": [
              {
                  "link": 2411,
                  "name": "value",
                  "type": "STRING",
                  "widget": {
                      "name": "value"
                  }
              }
          ],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "STRING",
                  "type": "STRING",
                  "links": []
              }
          ],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "PrimitiveString"
          },
          "widgets_values": [
              "1"
          ]
      },
      {
          "id": 660,
          "pos": [
              -5722.20068359375,
              1047.77978515625
          ],
          "mode": 0,
          "size": [
              400,
              214
          ],
          "type": "ComfyUIDeployExternalEnum",
          "color": "#222",
          "flags": {},
          "order": 9,
          "inputs": [],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "text",
                  "type": "*",
                  "links": [
                      1373,
                      2420,
                      2421
                  ]
              }
          ],
          "properties": {
              "ver": "b889f79baf9e099d5e54bd20bab4aa1e7c3296c0",
              "cnr_id": "comfyui-deploy",
              "Node name for S&R": "ComfyUIDeployExternalEnum"
          },
          "widgets_values": [
              "boost_model",
              "GPEN-BFR-512.pth",
              "[\"none\",\"codeformer-v0.1.0.pth\",\"codeformer.pth\",\"GFPGANv1.3.pth\",\"GFPGANv1.4.pth\",\"GPEN-BFR-512.pth\"]",
              "",
              ""
          ]
      },
      {
          "id": 695,
          "pos": [
              -7959.3544921875,
              3813.179931640625
          ],
          "mode": 0,
          "size": [
              210,
              258
          ],
          "type": "PreviewImage",
          "color": "#222",
          "flags": {},
          "order": 109,
          "inputs": [
              {
                  "link": 1558,
                  "name": "images",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "PreviewImage"
          },
          "widgets_values": []
      },
      {
          "id": 501,
          "pos": [
              -9144.669921875,
              3763.116943359375
          ],
          "mode": 0,
          "size": [
              270,
              82
          ],
          "type": "LTXVFilmGrain",
          "color": "#232",
          "flags": {},
          "order": 174,
          "inputs": [
              {
                  "link": 963,
                  "name": "images",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      983,
                      984,
                      2662
                  ]
              }
          ],
          "properties": {
              "ver": "6e9e6de05624b0aab09b81a2f4a5f473fa97988a",
              "cnr_id": "ComfyUI-LTXVideo",
              "Node name for S&R": "LTXVFilmGrain"
          },
          "widgets_values": [
              0.020000000000000004,
              0.5
          ]
      },
      {
          "id": 500,
          "pos": [
              -9144.05859375,
              2949.974853515625
          ],
          "mode": 0,
          "size": [
              270,
              82
          ],
          "type": "LTXVFilmGrain",
          "color": "#232",
          "flags": {},
          "order": 169,
          "inputs": [
              {
                  "link": 977,
                  "name": "images",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      978,
                      979,
                      981,
                      1399
                  ]
              }
          ],
          "properties": {
              "ver": "6e9e6de05624b0aab09b81a2f4a5f473fa97988a",
              "cnr_id": "ComfyUI-LTXVideo",
              "Node name for S&R": "LTXVFilmGrain"
          },
          "widgets_values": [
              0.020000000000000004,
              0.5
          ]
      },
      {
          "id": 335,
          "pos": [
              -9242.0283203125,
              1282.003662109375
          ],
          "mode": 0,
          "size": [
              270,
              270
          ],
          "type": "SaveImage",
          "color": "#222",
          "flags": {},
          "order": 126,
          "inputs": [
              {
                  "link": 618,
                  "name": "images",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "SaveImage"
          },
          "widgets_values": [
              "MALE_CHARACTER"
          ]
      },
      {
          "id": 710,
          "pos": [
              -7480.439453125,
              1914.6307373046875
          ],
          "mode": 0,
          "size": [
              252.056640625,
              736.545166015625
          ],
          "type": "VHS_LoadVideo",
          "color": "#223",
          "flags": {},
          "order": 67,
          "inputs": [
              {
                  "link": null,
                  "name": "meta_batch",
                  "type": "VHS_BatchManager",
                  "shape": 7
              },
              {
                  "link": null,
                  "name": "vae",
                  "type": "VAE",
                  "shape": 7
              },
              {
                  "link": 2091,
                  "name": "force_rate",
                  "type": "FLOAT",
                  "widget": {
                      "name": "force_rate"
                  }
              },
              {
                  "link": 2254,
                  "name": "frame_load_cap",
                  "type": "INT",
                  "widget": {
                      "name": "frame_load_cap"
                  }
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      2088
                  ]
              },
              {
                  "name": "frame_count",
                  "type": "INT",
                  "links": null
              },
              {
                  "name": "audio",
                  "type": "AUDIO",
                  "links": null
              },
              {
                  "name": "video_info",
                  "type": "VHS_VIDEOINFO",
                  "links": null
              }
          ],
          "properties": {
              "ver": "f7369389620ff244ddd6086cf0fa792a569086f2",
              "cnr_id": "comfyui-videohelpersuite",
              "Node name for S&R": "VHS_LoadVideo"
          },
          "widgets_values": {
              "video": "depth_map_00003.mp4",
              "format": "None",
              "force_rate": 24,
              "custom_width": 0,
              "videopreview": {
                  "hidden": false,
                  "params": {
                      "type": "input",
                      "format": "video/mp4",
                      "filename": "depth_map_00003.mp4",
                      "force_rate": 24,
                      "custom_width": 0,
                      "custom_height": 0,
                      "frame_load_cap": 121,
                      "select_every_nth": 1,
                      "skip_first_frames": 0
                  },
                  "paused": false
              },
              "custom_height": 0,
              "frame_load_cap": 121,
              "select_every_nth": 1,
              "skip_first_frames": 0,
              "choose video to upload": "image"
          }
      },
      {
          "id": 559,
          "pos": [
              -7796.92041015625,
              1889.60546875
          ],
          "mode": 0,
          "size": [
              252.056640625,
              736.545166015625
          ],
          "type": "VHS_LoadVideo",
          "color": "#223",
          "flags": {},
          "order": 68,
          "inputs": [
              {
                  "link": null,
                  "name": "meta_batch",
                  "type": "VHS_BatchManager",
                  "shape": 7
              },
              {
                  "link": null,
                  "name": "vae",
                  "type": "VAE",
                  "shape": 7
              },
              {
                  "link": 1988,
                  "name": "force_rate",
                  "type": "FLOAT",
                  "widget": {
                      "name": "force_rate"
                  }
              },
              {
                  "link": 2255,
                  "name": "frame_load_cap",
                  "type": "INT",
                  "widget": {
                      "name": "frame_load_cap"
                  }
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      1802,
                      1997
                  ]
              },
              {
                  "name": "frame_count",
                  "type": "INT",
                  "links": null
              },
              {
                  "name": "audio",
                  "type": "AUDIO",
                  "links": null
              },
              {
                  "name": "video_info",
                  "type": "VHS_VIDEOINFO",
                  "links": null
              }
          ],
          "properties": {
              "ver": "f7369389620ff244ddd6086cf0fa792a569086f2",
              "cnr_id": "comfyui-videohelpersuite",
              "Node name for S&R": "VHS_LoadVideo"
          },
          "widgets_values": {
              "video": "anim_couple_select.mp4",
              "format": "None",
              "force_rate": 24,
              "custom_width": 0,
              "videopreview": {
                  "hidden": false,
                  "params": {
                      "type": "input",
                      "format": "video/mp4",
                      "filename": "anim_couple_select.mp4",
                      "force_rate": 24,
                      "custom_width": 0,
                      "custom_height": 0,
                      "frame_load_cap": 121,
                      "select_every_nth": 1,
                      "skip_first_frames": 0
                  },
                  "paused": false
              },
              "custom_height": 0,
              "frame_load_cap": 121,
              "select_every_nth": 1,
              "skip_first_frames": 0,
              "choose video to upload": "image"
          }
      },
      {
          "id": 711,
          "pos": [
              -7170.91162109375,
              1912.99853515625
          ],
          "mode": 0,
          "size": [
              252.056640625,
              736.1005859375
          ],
          "type": "VHS_LoadVideo",
          "color": "#223",
          "flags": {},
          "order": 69,
          "inputs": [
              {
                  "link": null,
                  "name": "meta_batch",
                  "type": "VHS_BatchManager",
                  "shape": 7
              },
              {
                  "link": null,
                  "name": "vae",
                  "type": "VAE",
                  "shape": 7
              },
              {
                  "link": 2084,
                  "name": "force_rate",
                  "type": "FLOAT",
                  "widget": {
                      "name": "force_rate"
                  }
              },
              {
                  "link": 2256,
                  "name": "frame_load_cap",
                  "type": "INT",
                  "widget": {
                      "name": "frame_load_cap"
                  }
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      1779
                  ]
              },
              {
                  "name": "frame_count",
                  "type": "INT",
                  "links": null
              },
              {
                  "name": "audio",
                  "type": "AUDIO",
                  "links": null
              },
              {
                  "name": "video_info",
                  "type": "VHS_VIDEOINFO",
                  "links": null
              }
          ],
          "properties": {
              "ver": "f7369389620ff244ddd6086cf0fa792a569086f2",
              "cnr_id": "comfyui-videohelpersuite",
              "Node name for S&R": "VHS_LoadVideo"
          },
          "widgets_values": {
              "video": "OP_map_00002.mp4",
              "format": "None",
              "force_rate": 24,
              "custom_width": 0,
              "videopreview": {
                  "hidden": false,
                  "params": {
                      "type": "input",
                      "format": "video/mp4",
                      "filename": "OP_map_00002.mp4",
                      "force_rate": 24,
                      "custom_width": 0,
                      "custom_height": 0,
                      "frame_load_cap": 121,
                      "select_every_nth": 1,
                      "skip_first_frames": 0
                  },
                  "paused": false
              },
              "custom_height": 0,
              "frame_load_cap": 121,
              "select_every_nth": 1,
              "skip_first_frames": 0,
              "choose video to upload": "image"
          }
      },
      {
          "id": 677,
          "pos": [
              -6671.087890625,
              675.8032836914062
          ],
          "mode": 0,
          "size": [
              400,
              244
          ],
          "type": "ComfyUIDeployStringCombine",
          "color": "#222",
          "flags": {},
          "order": 10,
          "inputs": [],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "STRING",
                  "type": "STRING",
                  "links": null
              }
          ],
          "properties": {
              "ver": "b889f79baf9e099d5e54bd20bab4aa1e7c3296c0",
              "cnr_id": "comfyui-deploy",
              "Node name for S&R": "ComfyUIDeployStringCombine"
          },
          "widgets_values": [
              "append",
              "yes",
              "Change the characters to the live-action versions while maintaining the original pose and composition from the animated image ",
              "",
              ""
          ]
      },
      {
          "id": 308,
          "pos": [
              -8733.171875,
              1201.6136474609375
          ],
          "mode": 0,
          "size": [
              414.6770324707031,
              502.4700012207031
          ],
          "type": "Image Comparer (rgthree)",
          "color": "#222",
          "flags": {},
          "order": 130,
          "inputs": [
              {
                  "dir": 3,
                  "link": 611,
                  "name": "image_a",
                  "type": "IMAGE"
              },
              {
                  "dir": 3,
                  "link": 621,
                  "name": "image_b",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [],
          "properties": {
              "ver": "5d771b8b56a343c24a26e8cea1f0c87c3d58102f",
              "cnr_id": "rgthree-comfy",
              "comparer_mode": "Slide"
          },
          "widgets_values": [
              [
                  {
                      "url": "/api/view?filename=rgthree.compare._temp_dpozp_00007_.png&type=temp&subfolder=&rand=0.7708395825483642",
                      "name": "A",
                      "selected": true
                  },
                  {
                      "url": "/api/view?filename=rgthree.compare._temp_dpozp_00008_.png&type=temp&subfolder=&rand=0.3152664251784044",
                      "name": "B",
                      "selected": true
                  }
              ]
          ]
      },
      {
          "id": 974,
          "pos": [
              -3831.836669921875,
              3396.1220703125
          ],
          "mode": 0,
          "size": [
              289.5567626953125,
              827.2120361328125
          ],
          "type": "VHS_VideoCombine",
          "color": "#232",
          "flags": {
              "collapsed": false
          },
          "order": 216,
          "inputs": [
              {
                  "link": 2450,
                  "name": "images",
                  "type": "IMAGE"
              },
              {
                  "link": null,
                  "name": "audio",
                  "type": "AUDIO",
                  "shape": 7
              },
              {
                  "link": null,
                  "name": "meta_batch",
                  "type": "VHS_BatchManager",
                  "shape": 7
              },
              {
                  "link": null,
                  "name": "vae",
                  "type": "VAE",
                  "shape": 7
              }
          ],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "Filenames",
                  "type": "VHS_FILENAMES",
                  "links": null
              }
          ],
          "properties": {
              "ver": "c9dcc3a229437df232d61da4f9697c87c1f22428",
              "cnr_id": "comfyui-videohelpersuite",
              "Node name for S&R": "VHS_VideoCombine",
              "widget_ue_connectable": {}
          },
          "widgets_values": {
              "crf": 20,
              "format": "video/h264-mp4",
              "pix_fmt": "yuv420p",
              "pingpong": false,
              "frame_rate": 15,
              "loop_count": 0,
              "save_output": true,
              "videopreview": {
                  "hidden": false,
                  "params": {
                      "url": "https://comfy-deploy-output.s3.us-east-2.amazonaws.com/outputs/runs/d80ebf4e-9d90-4985-94b2-cb8f60007e0d/Any2LiveAction_NATIVE_VACE___00011.mp4",
                      "type": "output",
                      "format": "video/h264-mp4",
                      "filename": "Any2LiveAction_final_face replace_00004.mp4",
                      "fullpath": "/comfyui/output/Any2LiveAction_final_face replace_00004.mp4",
                      "workflow": "Any2LiveAction_final_face replace_00004.png",
                      "is_public": true,
                      "subfolder": "",
                      "frame_rate": 15,
                      "upload_duration": 0.8187798159997328
                  },
                  "paused": false
              },
              "save_metadata": true,
              "trim_to_audio": false,
              "filename_prefix": "Any2LiveAction_final_face replace"
          }
      },
      {
          "id": 973,
          "pos": [
              -3847.469482421875,
              2150.678955078125
          ],
          "mode": 0,
          "size": [
              385.28656005859375,
              997.3983154296875
          ],
          "type": "VHS_VideoCombine",
          "color": "#232",
          "flags": {
              "collapsed": false
          },
          "order": 213,
          "inputs": [
              {
                  "link": 2449,
                  "name": "images",
                  "type": "IMAGE"
              },
              {
                  "link": null,
                  "name": "audio",
                  "type": "AUDIO",
                  "shape": 7
              },
              {
                  "link": null,
                  "name": "meta_batch",
                  "type": "VHS_BatchManager",
                  "shape": 7
              },
              {
                  "link": null,
                  "name": "vae",
                  "type": "VAE",
                  "shape": 7
              }
          ],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "Filenames",
                  "type": "VHS_FILENAMES",
                  "links": null
              }
          ],
          "properties": {
              "ver": "c9dcc3a229437df232d61da4f9697c87c1f22428",
              "cnr_id": "comfyui-videohelpersuite",
              "Node name for S&R": "VHS_VideoCombine",
              "widget_ue_connectable": {}
          },
          "widgets_values": {
              "crf": 20,
              "format": "video/h264-mp4",
              "pix_fmt": "yuv420p",
              "pingpong": false,
              "frame_rate": 15,
              "loop_count": 0,
              "save_output": true,
              "videopreview": {
                  "hidden": false,
                  "params": {
                      "url": "https://comfy-deploy-output.s3.us-east-2.amazonaws.com/outputs/runs/d80ebf4e-9d90-4985-94b2-cb8f60007e0d/Any2LiveAction_NATIVE_VACE___00011.mp4",
                      "type": "output",
                      "format": "video/h264-mp4",
                      "filename": "Any2LiveAction_actress_face replace_00004.mp4",
                      "fullpath": "/comfyui/output/Any2LiveAction_actress_face replace_00004.mp4",
                      "workflow": "Any2LiveAction_actress_face replace_00004.png",
                      "is_public": true,
                      "subfolder": "",
                      "frame_rate": 15,
                      "upload_duration": 0.8187798159997328
                  },
                  "paused": false
              },
              "save_metadata": true,
              "trim_to_audio": false,
              "filename_prefix": "Any2LiveAction_actress_face replace"
          }
      },
      {
          "id": 289,
          "pos": [
              -9958.888671875,
              -327.6114807128906
          ],
          "mode": 0,
          "size": [
              374.6949768066406,
              398.5068054199219
          ],
          "type": "LoadImage",
          "color": "#222",
          "flags": {},
          "order": 11,
          "inputs": [],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      550
                  ]
              },
              {
                  "name": "MASK",
                  "type": "MASK",
                  "links": null
              }
          ],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "LoadImage"
          },
          "widgets_values": [
              "27867cf9-6d0b-4031-ab61-768b6ed2f814.jpeg",
              "image"
          ]
      },
      {
          "id": 313,
          "pos": [
              -9939.0908203125,
              738.5152587890625
          ],
          "mode": 0,
          "size": [
              374.6949768066406,
              398.5068054199219
          ],
          "type": "LoadImage",
          "color": "#222",
          "flags": {},
          "order": 12,
          "inputs": [],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      587,
                      1246
                  ]
              },
              {
                  "name": "MASK",
                  "type": "MASK",
                  "links": null
              }
          ],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "LoadImage"
          },
          "widgets_values": [
              "fa792779-77a8-4b39-86eb-0f18a0930d71.jpeg",
              "image"
          ]
      },
      {
          "id": 169,
          "pos": [
              -9964.125,
              136.21499633789062
          ],
          "mode": 0,
          "size": [
              382.6070251464844,
              394.3348388671875
          ],
          "type": "LoadImage",
          "color": "#222",
          "flags": {},
          "order": 13,
          "title": "Load Image: Reference",
          "inputs": [],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      323,
                      560
                  ]
              },
              {
                  "name": "MASK",
                  "type": "MASK",
                  "links": null
              }
          ],
          "properties": {
              "ver": "0.3.27",
              "cnr_id": "comfy-core",
              "Node name for S&R": "LoadImage"
          },
          "widgets_values": [
              "c439c0a6-95c2-4cd4-a51e-25aa8608cee9.jpeg",
              "image"
          ]
      },
      {
          "id": 319,
          "pos": [
              -9936.7080078125,
              1776.609375
          ],
          "mode": 0,
          "size": [
              382.6070251464844,
              394.3348388671875
          ],
          "type": "LoadImage",
          "color": "#222",
          "flags": {},
          "order": 14,
          "title": "Load Image: Reference",
          "inputs": [],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      598
                  ]
              },
              {
                  "name": "MASK",
                  "type": "MASK",
                  "links": null
              }
          ],
          "properties": {
              "ver": "0.3.27",
              "cnr_id": "comfy-core",
              "Node name for S&R": "LoadImage"
          },
          "widgets_values": [
              "50b3528e-acca-416a-b599-d170e8858aa3.jpeg",
              "image"
          ]
      },
      {
          "id": 560,
          "pos": [
              -8213.794921875,
              1019.3726806640625
          ],
          "mode": 4,
          "size": [
              156.64413452148438,
              46
          ],
          "type": "DepthAnything_V2",
          "color": "#223",
          "flags": {},
          "order": 99,
          "inputs": [
              {
                  "link": 1146,
                  "name": "da_model",
                  "type": "DAMODEL"
              },
              {
                  "link": 1999,
                  "name": "images",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "image",
                  "type": "IMAGE",
                  "links": [
                      1717,
                      1720
                  ]
              }
          ],
          "properties": {
              "ver": "9d7cb8c1e53b01744a75b599d3e91c93464a2d33",
              "cnr_id": "comfyui-depthanythingv2",
              "Node name for S&R": "DepthAnything_V2"
          },
          "widgets_values": []
      },
      {
          "id": 526,
          "pos": [
              -7458.12646484375,
              1272.942626953125
          ],
          "mode": 0,
          "size": [
              274.080078125,
              314.0001220703125
          ],
          "type": "LoadImage",
          "color": "#223",
          "flags": {},
          "order": 15,
          "inputs": [],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      1074
                  ]
              },
              {
                  "name": "MASK",
                  "type": "MASK",
                  "links": null
              }
          ],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "LoadImage"
          },
          "widgets_values": [
              "FEMALE_CHARACTER_FACESWAP_00001_ (1).png",
              "image"
          ]
      },
      {
          "id": 527,
          "pos": [
              -7140.29345703125,
              1272.5506591796875
          ],
          "mode": 0,
          "size": [
              274.080078125,
              314.00006103515625
          ],
          "type": "LoadImage",
          "color": "#223",
          "flags": {},
          "order": 16,
          "inputs": [],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      1075
                  ]
              },
              {
                  "name": "MASK",
                  "type": "MASK",
                  "links": null
              }
          ],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "LoadImage"
          },
          "widgets_values": [
              "MALE_CHARACTER_FACESWAP_00001_.png",
              "image"
          ]
      },
      {
          "id": 317,
          "pos": [
              -9548.41015625,
              1873.935791015625
          ],
          "mode": 0,
          "size": [
              270,
              266
          ],
          "type": "ImageResizeKJv2",
          "color": "#222",
          "flags": {
              "collapsed": false
          },
          "order": 65,
          "inputs": [
              {
                  "link": 598,
                  "name": "image",
                  "type": "IMAGE"
              },
              {
                  "link": 1658,
                  "name": "width",
                  "type": "INT",
                  "widget": {
                      "name": "width"
                  }
              },
              {
                  "link": 1659,
                  "name": "height",
                  "type": "INT",
                  "widget": {
                      "name": "height"
                  }
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      1500,
                      2481
                  ]
              },
              {
                  "name": "width",
                  "type": "INT",
                  "links": []
              },
              {
                  "name": "height",
                  "type": "INT",
                  "links": []
              }
          ],
          "properties": {
              "ver": "5dcda71011870278c35d92ff77a677ed2e538f2d",
              "cnr_id": "comfyui-kjnodes",
              "Node name for S&R": "ImageResizeKJv2"
          },
          "widgets_values": [
              480,
              832,
              "lanczos",
              "crop",
              "172,172,172",
              "center",
              16,
              "cpu"
          ]
      },
      {
          "id": 802,
          "pos": [
              -6236.34033203125,
              3125.263671875
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#222",
          "flags": {},
          "order": 151,
          "inputs": [
              {
                  "link": 2694,
                  "name": "",
                  "type": "*"
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "",
                  "type": "IMAGE",
                  "links": [
                      2037,
                      2043
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 475,
          "pos": [
              -9948.310546875,
              2314.725830078125
          ],
          "mode": 0,
          "size": [
              382.6070251464844,
              394.3348388671875
          ],
          "type": "LoadImage",
          "color": "#222",
          "flags": {},
          "order": 17,
          "title": "Load Image: Reference",
          "inputs": [],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      915
                  ]
              },
              {
                  "name": "MASK",
                  "type": "MASK",
                  "links": null
              }
          ],
          "properties": {
              "ver": "0.3.27",
              "cnr_id": "comfy-core",
              "Node name for S&R": "LoadImage"
          },
          "widgets_values": [
              "4d408847-6a44-4e95-a8cd-7e640522e424.jpeg",
              "image"
          ]
      },
      {
          "id": 421,
          "pos": [
              -6208.1005859375,
              377.47271728515625
          ],
          "mode": 0,
          "size": [
              429.6972961425781,
              254.64039611816406
          ],
          "type": "ComfyUIDeployExternalText",
          "color": "#222",
          "flags": {
              "collapsed": false
          },
          "order": 18,
          "inputs": [],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "text",
                  "type": "STRING",
                  "links": [
                      2491
                  ]
              }
          ],
          "properties": {
              "ver": "b889f79baf9e099d5e54bd20bab4aa1e7c3296c0",
              "cnr_id": "comfyui-deploy",
              "Node name for S&R": "ComfyUIDeployExternalText"
          },
          "widgets_values": [
              "ACTRESS_MANUAL_PROMPT",
              "Restyle the animated woman with long dark blue hair into a live-action tokusatsu Japanese TV show scene. Change the visual style to realistic, capturing facial characteristics like full lips, defined cheekbones, expressive eyes, and thick eyebrows matching the second image. Replace the hair color with a natural brunette shade, maintaining the same long hairstyle and expression. Preserve her original pose, red jacket and beret, and black dress costume exactly. Solid white Background she wears a bold silver cross pendant",
              "",
              ""
          ]
      },
      {
          "id": 422,
          "pos": [
              -6225.2412109375,
              680.61669921875
          ],
          "mode": 0,
          "size": [
              463.7731628417969,
              300.9212951660156
          ],
          "type": "ComfyUIDeployExternalText",
          "color": "#222",
          "flags": {},
          "order": 19,
          "inputs": [],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "text",
                  "type": "STRING",
                  "links": [
                      2492
                  ]
              }
          ],
          "properties": {
              "ver": "b889f79baf9e099d5e54bd20bab4aa1e7c3296c0",
              "cnr_id": "comfyui-deploy",
              "Node name for S&R": "ComfyUIDeployExternalText"
          },
          "widgets_values": [
              "ACTOR_MANUAL_PROMPT",
              "Restyle the character into a realistic live-action tokusatsu Japanese TV show scene, accurately depicting a youthful man with a defined jawline, smooth skin, and expressive dark eyes. Maintain his original hairstyle, with dark, slightly messy hair falling naturally around his face. Change clothing to a real, well-fitted blue shirt and dark pants with a red tie, keeping the same stance, confident posture, and neutral, cool expression unchanged. Solid white Background",
              "",
              ""
          ]
      },
      {
          "id": 443,
          "pos": [
              -6694.15234375,
              408.390869140625
          ],
          "mode": 0,
          "size": [
              455.1605224609375,
              227.731201171875
          ],
          "type": "ComfyUIDeployExternalText",
          "color": "#222",
          "flags": {},
          "order": 20,
          "inputs": [],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "text",
                  "type": "STRING",
                  "links": [
                      2493
                  ]
              }
          ],
          "properties": {
              "ver": "b889f79baf9e099d5e54bd20bab4aa1e7c3296c0",
              "cnr_id": "comfyui-deploy",
              "Node name for S&R": "ComfyUIDeployExternalText"
          },
          "widgets_values": [
              "COUPLE_MANUAL_PROMPT",
              "Change the characters in the first image to match the provided live-action actors, placing the woman in the exact same pose as the original female character, while preserving her facial features and expression. Replace the male character, maintaining his exact hairstyle, facial features, and pose. Change the background, keeping the composition and framing intact.",
              "",
              ""
          ]
      },
      {
          "id": 990,
          "pos": [
              -6218.177734375,
              3753.7626953125
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#222",
          "flags": {},
          "order": 119,
          "inputs": [
              {
                  "link": 2696,
                  "name": "",
                  "type": "*",
                  "widget": {
                      "name": "value"
                  }
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "",
                  "type": "STRING",
                  "links": [
                      2509
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 989,
          "pos": [
              -6334.58154296875,
              3598.249755859375
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#223",
          "flags": {},
          "order": 57,
          "inputs": [
              {
                  "link": 2494,
                  "name": "",
                  "type": "*"
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "",
                  "type": "STRING",
                  "links": []
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 987,
          "pos": [
              -6332.06005859375,
              3561.23046875
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#223",
          "flags": {},
          "order": 52,
          "inputs": [
              {
                  "link": 2492,
                  "name": "",
                  "type": "*"
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "",
                  "type": "STRING",
                  "links": []
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 986,
          "pos": [
              -6335.86279296875,
              3503.92333984375
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#223",
          "flags": {},
          "order": 51,
          "inputs": [
              {
                  "link": 2491,
                  "name": "",
                  "type": "*"
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "",
                  "type": "STRING",
                  "links": []
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 988,
          "pos": [
              -6335.86279296875,
              3453.92333984375
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#223",
          "flags": {},
          "order": 53,
          "inputs": [
              {
                  "link": 2493,
                  "name": "",
                  "type": "*"
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "",
                  "type": "STRING",
                  "links": []
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 495,
          "pos": [
              -9757.833984375,
              4072.50537109375
          ],
          "mode": 0,
          "size": [
              285.287109375,
              358
          ],
          "type": "ReActorFaceSwap",
          "color": "#232",
          "flags": {},
          "order": 172,
          "inputs": [
              {
                  "link": 1399,
                  "name": "input_image",
                  "type": "IMAGE"
              },
              {
                  "link": 2707,
                  "name": "source_image",
                  "type": "IMAGE",
                  "shape": 7
              },
              {
                  "link": null,
                  "name": "face_model",
                  "type": "FACE_MODEL",
                  "shape": 7
              },
              {
                  "link": 956,
                  "name": "face_boost",
                  "type": "FACE_BOOST",
                  "shape": 7
              }
          ],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "SWAPPED_IMAGE",
                  "type": "IMAGE",
                  "links": [
                      982
                  ]
              },
              {
                  "name": "FACE_MODEL",
                  "type": "FACE_MODEL",
                  "links": null
              },
              {
                  "name": "ORIGINAL_IMAGE",
                  "type": "IMAGE",
                  "links": null
              }
          ],
          "properties": {
              "ver": "48a3ad27f99f775dcf63e61276e0110d256597ef",
              "cnr_id": "comfyui-reactor",
              "Node name for S&R": "ReActorFaceSwap"
          },
          "widgets_values": [
              true,
              "inswapper_128.onnx",
              "retinaface_resnet50",
              "codeformer-v0.1.0.pth",
              1,
              0.6000000000000001,
              "no",
              "no",
              "0",
              "0",
              1
          ]
      },
      {
          "id": 693,
          "pos": [
              -4970.8388671875,
              1355.119384765625
          ],
          "mode": 0,
          "size": [
              210,
              88
          ],
          "type": "Note",
          "color": "#222",
          "flags": {},
          "order": 21,
          "inputs": [],
          "bgcolor": "#000",
          "outputs": [],
          "properties": {},
          "widgets_values": [
              "if man on the right    0\notherwise 1"
          ]
      },
      {
          "id": 773,
          "pos": [
              -5750.25146484375,
              1592.2738037109375
          ],
          "mode": 0,
          "size": [
              400,
              200
          ],
          "type": "ComfyUIDeployExternalText",
          "color": "#222",
          "flags": {},
          "order": 22,
          "inputs": [],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "text",
                  "type": "STRING",
                  "links": [
                      1950,
                      2411
                  ]
              }
          ],
          "properties": {
              "ver": "b889f79baf9e099d5e54bd20bab4aa1e7c3296c0",
              "cnr_id": "comfyui-deploy",
              "Node name for S&R": "ComfyUIDeployExternalText"
          },
          "widgets_values": [
              "ACTOR_IS_ON_RIGHT_SIDE?",
              "1\n",
              "",
              "One 1 Means YES\n "
          ]
      },
      {
          "id": 692,
          "pos": [
              -5277.95263671875,
              1653.34716796875
          ],
          "mode": 0,
          "size": [
              270,
              58
          ],
          "type": "PrimitiveString",
          "color": "#222",
          "flags": {},
          "order": 54,
          "inputs": [
              {
                  "link": 1950,
                  "name": "value",
                  "type": "STRING",
                  "widget": {
                      "name": "value"
                  }
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "STRING",
                  "type": "STRING",
                  "links": []
              }
          ],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "PrimitiveString"
          },
          "widgets_values": [
              "1"
          ]
      },
      {
          "id": 506,
          "pos": [
              -7761.8154296875,
              1277.584228515625
          ],
          "mode": 0,
          "size": [
              274.080078125,
              314.00006103515625
          ],
          "type": "LoadImage",
          "color": "#223",
          "flags": {},
          "order": 23,
          "inputs": [],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      1076
                  ]
              },
              {
                  "name": "MASK",
                  "type": "MASK",
                  "links": null
              }
          ],
          "properties": {
              "ver": "0.3.34",
              "cnr_id": "comfy-core",
              "Node name for S&R": "LoadImage",
              "widget_ue_connectable": {}
          },
          "widgets_values": [
              "COUPLE_FINAL_00008_.png",
              "image"
          ]
      },
      {
          "id": 445,
          "pos": [
              -9156.8359375,
              2202.854248046875
          ],
          "mode": 0,
          "size": [
              196.41659545898438,
              26
          ],
          "type": "ImageRemoveAlpha+",
          "color": "#222",
          "flags": {
              "collapsed": false
          },
          "order": 162,
          "inputs": [
              {
                  "link": 1588,
                  "name": "image",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      1589
                  ]
              }
          ],
          "properties": {
              "ver": "33ff89fd354d8ec3ab6affb605a79a931b445d99",
              "cnr_id": "comfyui_essentials",
              "Node name for S&R": "ImageRemoveAlpha+"
          },
          "widgets_values": []
      },
      {
          "id": 652,
          "pos": [
              -9604.2802734375,
              3137.72509765625
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#232",
          "flags": {},
          "order": 166,
          "inputs": [
              {
                  "link": 2533,
                  "name": "",
                  "type": "*"
              }
          ],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "",
                  "type": "IMAGE",
                  "links": [
                      1984,
                      2427
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 491,
          "pos": [
              -10080.2333984375,
              3006.9443359375
          ],
          "mode": 0,
          "size": [
              274.080078125,
              314.000244140625
          ],
          "type": "LoadImage",
          "color": "#232",
          "flags": {},
          "order": 24,
          "inputs": [],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": []
              },
              {
                  "name": "MASK",
                  "type": "MASK",
                  "links": null
              }
          ],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "LoadImage"
          },
          "widgets_values": [
              "SCENE_COUPLE_00001_ (1).png",
              "image"
          ]
      },
      {
          "id": 953,
          "pos": [
              -4776.30859375,
              2927.40625
          ],
          "mode": 0,
          "size": [
              292.73046875,
              178
          ],
          "type": "ReActorFaceBoost",
          "color": "#232",
          "flags": {},
          "order": 46,
          "inputs": [
              {
                  "link": 2420,
                  "name": "boost_model",
                  "type": "COMBO",
                  "widget": {
                      "name": "boost_model"
                  }
              }
          ],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "FACE_BOOST",
                  "type": "FACE_BOOST",
                  "links": [
                      2408
                  ]
              }
          ],
          "properties": {
              "ver": "48a3ad27f99f775dcf63e61276e0110d256597ef",
              "cnr_id": "comfyui-reactor",
              "Node name for S&R": "ReActorFaceBoost"
          },
          "widgets_values": [
              true,
              "GPEN-BFR-512.pth",
              "Bicubic",
              1,
              0.5,
              false
          ]
      },
      {
          "id": 966,
          "pos": [
              -4382.9052734375,
              2609.17724609375
          ],
          "mode": 0,
          "size": [
              210,
              88
          ],
          "type": "Note",
          "color": "#232",
          "flags": {},
          "order": 25,
          "inputs": [],
          "bgcolor": "#353",
          "outputs": [],
          "properties": {},
          "widgets_values": [
              "if man on the right    0\notherwise 1"
          ]
      },
      {
          "id": 960,
          "pos": [
              -4739.33544921875,
              2499.975341796875
          ],
          "mode": 0,
          "size": [
              270,
              58
          ],
          "type": "PrimitiveString",
          "color": "#232",
          "flags": {},
          "order": 60,
          "inputs": [
              {
                  "link": 2410,
                  "name": "value",
                  "type": "STRING",
                  "widget": {
                      "name": "value"
                  }
              }
          ],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "STRING",
                  "type": "STRING",
                  "links": []
              }
          ],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "PrimitiveString"
          },
          "widgets_values": [
              "0"
          ]
      },
      {
          "id": 964,
          "pos": [
              -4457.20654296875,
              2055.63720703125
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#232",
          "flags": {},
          "order": 26,
          "inputs": [
              {
                  "link": null,
                  "name": "",
                  "type": "*"
              }
          ],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "",
                  "type": "*",
                  "links": []
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 999,
          "pos": [
              -4292.7265625,
              2349.674072265625
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#232",
          "flags": {},
          "order": 205,
          "inputs": [
              {
                  "link": 2698,
                  "name": "",
                  "type": "*"
              }
          ],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "",
                  "type": "IMAGE",
                  "links": [
                      2539
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 978,
          "pos": [
              -4767.6142578125,
              2103.829345703125
          ],
          "mode": 0,
          "size": [
              252.056640625,
              455.031982421875
          ],
          "type": "VHS_LoadVideo",
          "color": "#232",
          "flags": {},
          "order": 27,
          "inputs": [
              {
                  "link": null,
                  "name": "meta_batch",
                  "type": "VHS_BatchManager",
                  "shape": 7
              },
              {
                  "link": null,
                  "name": "vae",
                  "type": "VAE",
                  "shape": 7
              }
          ],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": []
              },
              {
                  "name": "frame_count",
                  "type": "INT",
                  "links": null
              },
              {
                  "name": "audio",
                  "type": "AUDIO",
                  "links": null
              },
              {
                  "name": "video_info",
                  "type": "VHS_VIDEOINFO",
                  "links": null
              }
          ],
          "properties": {
              "ver": "f7369389620ff244ddd6086cf0fa792a569086f2",
              "cnr_id": "comfyui-videohelpersuite",
              "Node name for S&R": "VHS_LoadVideo"
          },
          "widgets_values": {
              "video": "5051385-hd_1920_1080_25fps.mp4",
              "format": "AnimateDiff",
              "force_rate": 0,
              "custom_width": 0,
              "videopreview": {
                  "hidden": false,
                  "params": {
                      "type": "input",
                      "format": "video/mp4",
                      "filename": "5051385-hd_1920_1080_25fps.mp4",
                      "force_rate": 0,
                      "custom_width": 0,
                      "custom_height": 0,
                      "frame_load_cap": 0,
                      "select_every_nth": 1,
                      "skip_first_frames": 0
                  },
                  "paused": false
              },
              "custom_height": 0,
              "frame_load_cap": 0,
              "select_every_nth": 1,
              "skip_first_frames": 0,
              "choose video to upload": "image"
          }
      },
      {
          "id": 574,
          "pos": [
              -6349.861328125,
              2792.321044921875
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#223",
          "flags": {},
          "order": 78,
          "inputs": [
              {
                  "link": 1164,
                  "name": "",
                  "type": "*"
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "",
                  "type": "IMAGE",
                  "links": []
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 589,
          "pos": [
              -6355.0380859375,
              2835.5693359375
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#223",
          "flags": {},
          "order": 75,
          "inputs": [
              {
                  "link": 1191,
                  "name": "",
                  "type": "*"
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "",
                  "type": "IMAGE",
                  "links": [
                      2191
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 588,
          "pos": [
              -6350.17041015625,
              2871.994873046875
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#223",
          "flags": {},
          "order": 76,
          "inputs": [
              {
                  "link": 1190,
                  "name": "",
                  "type": "*"
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "",
                  "type": "IMAGE",
                  "links": [
                      2192
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 889,
          "pos": [
              -6779.3330078125,
              3846.10498046875
          ],
          "mode": 0,
          "size": [
              140,
              246
          ],
          "type": "PreviewImage",
          "color": "#222",
          "flags": {},
          "order": 190,
          "inputs": [
              {
                  "link": 2249,
                  "name": "images",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "PreviewImage"
          },
          "widgets_values": []
      },
      {
          "id": 637,
          "pos": [
              -8501.7138671875,
              3891.513916015625
          ],
          "mode": 0,
          "size": [
              270,
              78
          ],
          "type": "AILab_ImageStitch",
          "color": "#222",
          "flags": {},
          "order": 97,
          "inputs": [
              {
                  "link": 2547,
                  "name": "image1",
                  "type": "IMAGE"
              },
              {
                  "link": 2548,
                  "name": "image2",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      1486,
                      1558
                  ]
              }
          ],
          "properties": {
              "ver": "daf0b01deb1c529dfb543093bba2ed586aad7886",
              "cnr_id": "comfyui-rmbg",
              "Node name for S&R": "AILab_ImageStitch"
          },
          "widgets_values": [
              "right"
          ]
      },
      {
          "id": 657,
          "pos": [
              -8547.068359375,
              3601.26220703125
          ],
          "mode": 0,
          "size": [
              210,
              78
          ],
          "type": "AILab_ImageStitch",
          "color": "#222",
          "flags": {
              "collapsed": false
          },
          "order": 145,
          "inputs": [
              {
                  "link": 1368,
                  "name": "image1",
                  "type": "IMAGE"
              },
              {
                  "link": 1409,
                  "name": "image2",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      1370,
                      1411
                  ]
              }
          ],
          "properties": {
              "ver": "daf0b01deb1c529dfb543093bba2ed586aad7886",
              "cnr_id": "comfyui-rmbg",
              "Node name for S&R": "AILab_ImageStitch"
          },
          "widgets_values": [
              "right"
          ]
      },
      {
          "id": 655,
          "pos": [
              -8539.6220703125,
              4551.01123046875
          ],
          "mode": 0,
          "size": [
              210,
              78
          ],
          "type": "AILab_ImageStitch",
          "color": "#222",
          "flags": {
              "collapsed": false
          },
          "order": 141,
          "inputs": [
              {
                  "link": 1365,
                  "name": "image1",
                  "type": "IMAGE"
              },
              {
                  "link": 1408,
                  "name": "image2",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      1367,
                      1412
                  ]
              }
          ],
          "properties": {
              "ver": "daf0b01deb1c529dfb543093bba2ed586aad7886",
              "cnr_id": "comfyui-rmbg",
              "Node name for S&R": "AILab_ImageStitch"
          },
          "widgets_values": [
              "right"
          ]
      },
      {
          "id": 636,
          "pos": [
              -8332.2431640625,
              4332.83154296875
          ],
          "mode": 0,
          "size": [
              270,
              78
          ],
          "type": "AILab_ImageStitch",
          "color": "#222",
          "flags": {},
          "order": 153,
          "inputs": [
              {
                  "link": 1411,
                  "name": "image1",
                  "type": "IMAGE"
              },
              {
                  "link": 1412,
                  "name": "image2",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      1295
                  ]
              }
          ],
          "properties": {
              "ver": "daf0b01deb1c529dfb543093bba2ed586aad7886",
              "cnr_id": "comfyui-rmbg",
              "Node name for S&R": "AILab_ImageStitch"
          },
          "widgets_values": [
              "right"
          ]
      },
      {
          "id": 635,
          "pos": [
              -7843.92431640625,
              4534.27490234375
          ],
          "mode": 0,
          "size": [
              216.3630828857422,
              258
          ],
          "type": "PreviewImage",
          "color": "#222",
          "flags": {},
          "order": 159,
          "inputs": [
              {
                  "link": 1286,
                  "name": "images",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "PreviewImage"
          },
          "widgets_values": []
      },
      {
          "id": 634,
          "pos": [
              -7971.00048828125,
              4196.01416015625
          ],
          "mode": 0,
          "size": [
              270,
              78
          ],
          "type": "AILab_ImageStitch",
          "color": "#222",
          "flags": {},
          "order": 156,
          "inputs": [
              {
                  "link": 1486,
                  "name": "image1",
                  "type": "IMAGE"
              },
              {
                  "link": 1295,
                  "name": "image2",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      1286
                  ]
              }
          ],
          "properties": {
              "ver": "daf0b01deb1c529dfb543093bba2ed586aad7886",
              "cnr_id": "comfyui-rmbg",
              "Node name for S&R": "AILab_ImageStitch"
          },
          "widgets_values": [
              "bottom"
          ]
      },
      {
          "id": 533,
          "pos": [
              -6679.3359375,
              973.9629516601562
          ],
          "mode": 0,
          "size": [
              404.58721923828125,
              321.0223388671875
          ],
          "type": "ComfyUIDeployExternalText",
          "color": "#222",
          "flags": {},
          "order": 28,
          "inputs": [],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "text",
                  "type": "STRING",
                  "links": [
                      2494
                  ]
              }
          ],
          "properties": {
              "ver": "b889f79baf9e099d5e54bd20bab4aa1e7c3296c0",
              "cnr_id": "comfyui-deploy",
              "Node name for S&R": "ComfyUIDeployExternalText"
          },
          "widgets_values": [
              "ACTION_MANUAL_PROMPT",
              "Tactical soldier swiftly raises rifle, red-haired operative  smirks approvingly, shifting stance, sand swirls across barren desert, camera tracks swiftly upward, harsh shadows accentuate tension, warm color palette, deep focus, dynamic composition, shot on Sony FX9 with anamorphic lenses, classic tokusatsu aesthetics.",
              "",
              ""
          ]
      },
      {
          "id": 453,
          "pos": [
              -10432.2666015625,
              1784.8321533203125
          ],
          "mode": 0,
          "size": [
              440.57611083984375,
              240.34864807128906
          ],
          "type": "PromptManager",
          "color": "#222",
          "flags": {},
          "order": 137,
          "inputs": [
              {
                  "link": 858,
                  "name": "context",
                  "type": "*",
                  "shape": 7
              },
              {
                  "link": 2488,
                  "name": "image",
                  "type": "IMAGE",
                  "shape": 7
              },
              {
                  "link": null,
                  "name": "mask",
                  "type": "MASK",
                  "shape": 7
              },
              {
                  "link": null,
                  "name": "video",
                  "type": "IMAGE",
                  "shape": 7
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "context",
                  "type": "*",
                  "links": [
                      855
                  ]
              }
          ],
          "properties": {
              "ver": "3d82dbfe091d84868212e5f275deb5447fa4e659",
              "cnr_id": "llm-toolkit",
              "Node name for S&R": "PromptManager"
          },
          "widgets_values": [
              "You are a master artist crafting precise visual narratives for text-to-image generation. When given an image or visual description, create a flowing 70 word paragraph following this base on the TASK\n\n### 1. Basic Modifications\n- Simple and direct: `\"Change the car color to red\"`\n- Maintain style: `\"Change to daytime while maintaining the same style of the painting\"`\n\n### 2. Style Transfer\n**Principles:**\n- Clearly name style: `\"Transform to Bauhaus art style\"`\n- Describe characteristics: `\"Transform to oil painting with visible brushstrokes, thick paint texture\"`\n- Preserve composition: `\"Change to Bauhaus style while maintaining the original composition\"`\n\n### 3. Character Consistency\n**Framework:**\n- Specific description: `\"The woman with short black hair\"` instead of \"she\"\n- Preserve features: `\"while maintaining the same facial features, hairstyle, and expression\"`\n- Step-by-step modifications: Change background first, then actions\n\n### 4. Text Editing\n- Use quotes: `\"Replace 'joy' with 'BFL'\"`\n- Maintain format: `\"Replace text while maintaining the same font style\"`\n\n## Common Problem Solutions\n\n### Character Changes Too Much\n❌ Wrong: `\"Transform the person into a Viking\"`\n✅ Correct: `\"Change the clothes to be a viking warrior while preserving facial features\"`\n\n### Composition Position Changes\n❌ Wrong: `\"Put him on a beach\"`\n✅ Correct: `\"Change the background to a beach while keeping the person in the exact same position, scale, and pose\"`\n\n### Style Application Inaccuracy\n❌ Wrong: `\"Make it a sketch\"`\n✅ Correct: `\"Convert to pencil sketch with natural graphite lines, cross-hatching, and visible paper texture\"`\n\n## Core Principles\n\n1. **Be Specific and Clear** - Use precise descriptions, avoid vague terms\n2. **Step-by-step Editing** - Break complex modifications into multiple simple steps\n3. **Explicit Preservation** - State what should remain unchanged\n4. **Verb Selection** - Use \"change\", \"replace\" rather than \"transform\"\n\n## Best Practice Templates\n\n**Object Modification:**\n`\"Change [object] to [new state], keep [content to preserve] unchanged\"`\n\n**Style Transfer:**\n`\"Transform to [specific style], while maintaining [composition/character/other] unchanged\"`\n\n**Background Replacement:**\n`\"Change the background to [new background], keep the subject in the exact same position and pose\"`\n\n**Text Editing:**\n`\"Replace '[original text]' with '[new text]', maintain the same font style\"`\n\n> **Remember:** The more specific, the better. Kontext excels at understanding detailed instructions and maintaining consistency. \n\n**TASK:**\nTransform the first image to Transform the characters into a realistic, high-quality live-action cosplay portrayal featuring the provided Couple with SLIGTHLY stylized pushed proportions to improve the charcters likeness. Acurately describe the facial structure features and characteristics, haistyle, costume, accessories and props and poses of each character from the original picture in order to replace it with the matching gender portrait of the actor or actress provided. Keep the composition, poses and costumes of the characters. Transforming the image into the live action lifelike reepresentation of the characters and background environment. ",
              "",
              "",
              ""
          ]
      },
      {
          "id": 455,
          "pos": [
              -10420.9892578125,
              2358.59130859375
          ],
          "mode": 0,
          "size": [
              420.2709655761719,
              201.9195098876953
          ],
          "type": "Display_Text",
          "color": "#222",
          "flags": {
              "collapsed": false
          },
          "order": 149,
          "inputs": [
              {
                  "link": 857,
                  "name": "context",
                  "type": "*"
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "context",
                  "type": "*",
                  "links": []
              },
              {
                  "name": "text_list",
                  "type": "STRING",
                  "links": null,
                  "shape": 6
              },
              {
                  "name": "count",
                  "type": "INT",
                  "links": null
              },
              {
                  "name": "selected",
                  "type": "STRING",
                  "links": []
              },
              {
                  "name": "text_full",
                  "type": "STRING",
                  "links": [
                      2515
                  ]
              }
          ],
          "properties": {
              "ver": "3d82dbfe091d84868212e5f275deb5447fa4e659",
              "cnr_id": "llm-toolkit",
              "Node name for S&R": "Display_Text"
          },
          "widgets_values": [
              "0",
              "Transform the characters into realistic, high-quality live-action cosplays, slightly stylizing their proportions to enhance their likeness. Depict the male character with defined facial features, a strong jawline, rugged stubble, and spiky brown hair secured by a dark bandana. Outfit him in tactical military gear, armored plates, and pouches, maintaining his confident aiming pose with a silenced pistol. For the woman, portray her with delicate facial features, expressive eyes, short vibrant red hair styled in waves, and fitted tank top with tactical gloves. Keep her poised, alert stance with a firearm. Set them against the sandy desert ruin environment, preserving the original dynamic composition."
          ]
      },
      {
          "id": 452,
          "pos": [
              -10425.1630859375,
              2071.380126953125
          ],
          "mode": 0,
          "size": [
              427.4910583496094,
              238.13401794433594
          ],
          "type": "LLMToolkitTextGeneratorStream",
          "color": "#222",
          "flags": {},
          "order": 140,
          "inputs": [
              {
                  "link": 855,
                  "name": "context",
                  "type": "*",
                  "shape": 7
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "context",
                  "type": "*",
                  "links": [
                      857
                  ]
              }
          ],
          "properties": {
              "ver": "3d82dbfe091d84868212e5f275deb5447fa4e659",
              "cnr_id": "llm-toolkit",
              "Node name for S&R": "LLMToolkitTextGeneratorStream"
          },
          "widgets_values": [
              "gpt-4o-mini",
              "Write a detailed description of a futuristic city.",
              "Transform the characters into realistic, high-quality live-action cosplays, slightly stylizing their proportions to enhance their likeness. Depict the male character with defined facial features, a strong jawline, rugged stubble, and spiky brown hair secured by a dark bandana. Outfit him in tactical military gear, armored plates, and pouches, maintaining his confident aiming pose with a silenced pistol. For the woman, portray her with delicate facial features, expressive eyes, short vibrant red hair styled in waves, and fitted tank top with tactical gloves. Keep her poised, alert stance with a firearm. Set them against the sandy desert ruin environment, preserving the original dynamic composition."
          ]
      },
      {
          "id": 292,
          "pos": [
              -8753.25390625,
              1822.7652587890625
          ],
          "mode": 0,
          "size": [
              442.9931945800781,
              319.7298889160156
          ],
          "type": "PromptManager",
          "color": "#222",
          "flags": {},
          "order": 191,
          "inputs": [
              {
                  "link": 638,
                  "name": "context",
                  "type": "*",
                  "shape": 7
              },
              {
                  "link": 2250,
                  "name": "image",
                  "type": "IMAGE",
                  "shape": 7
              },
              {
                  "link": null,
                  "name": "mask",
                  "type": "MASK",
                  "shape": 7
              },
              {
                  "link": 1802,
                  "name": "video",
                  "type": "IMAGE",
                  "shape": 7
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "context",
                  "type": "*",
                  "links": [
                      534
                  ]
              }
          ],
          "properties": {
              "ver": "3d82dbfe091d84868212e5f275deb5447fa4e659",
              "cnr_id": "llm-toolkit",
              "Node name for S&R": "PromptManager"
          },
          "widgets_values": [
              "You're a cinematographer creating 50-word text-to-video prompts. Extract action from video, apply to image characters. Structure: Male character's action (5 words), female's reaction (5 words), environment details, camera movement, lighting, tokusatsu aesthetic. \n\nOpening Action: Begin immediately with the primary movement or camera motion in one direct sentence - no preamble.\nCharacter Dynamics: Detail specific gestures, facial micro-expressions, and body language shifts based on visual cues like hand positioning, gaze direction, and posture tension.\nPhysical Environment: Describe immediate surroundings, textures, lighting quality, and atmospheric elements that frame the action.\nCamera Behavior: Specify lens movement, framing changes, focus pulls, and perspective shifts that enhance the visual narrative.\nVisual Aesthetics: Include details about color temperature, shadow play, depth of field, and compositional elements.\nTechnical Signature: Conclude with the artstyle aesthetics of the shot and some techical information that reference the cinematographic style reference like \"Shot on RED Dragon 6K with vintage Cooke lenses\" or \"Captured in the visual language of contemporary arthouse cinema.\" \n\nBe brief we need to convey as much as possible in an small phrase no word salads please maximun 50 words or less chose a maximun of one word each things per category the only category that needs more is the action and character dynamics. up to 5 words each\n\nYou have been provided with an image and a video extract the action of the video and ignore the all other aspects of the video besides the movement and action of the characters.\n\nUse the characters and background from the image to construct the prompt that contains the transfered action performed in the video into the image characters, make a brief description of the characters outfit make the action take place on the location environment provided on image Alsways start the prompt with the male character first.\n\nExample: \"Silver-armored warrior with glowing chest emblem launches spinning heel kick, long-haired schoolgirl in navy blazer dodges rolling sideways clutching leather briefcase, debris scatters across rain-slicked industrial rooftop, camera dollies circling combatants, neon signage reflects in puddles, sparks fly from impact, Shot on Arri Alexa Mini, gritty tokusatsu cinematography.\"  Focus on movement transfer, ignore other video aspects.",
              "",
              "",
              ""
          ]
      },
      {
          "id": 293,
          "pos": [
              -8752.0673828125,
              2529.862060546875
          ],
          "mode": 0,
          "size": [
              462.1188049316406,
              217.4800262451172
          ],
          "type": "Display_Text",
          "color": "#222",
          "flags": {
              "collapsed": false
          },
          "order": 194,
          "inputs": [
              {
                  "link": 536,
                  "name": "context",
                  "type": "*"
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "context",
                  "type": "*",
                  "links": []
              },
              {
                  "name": "text_list",
                  "type": "STRING",
                  "links": null,
                  "shape": 6
              },
              {
                  "name": "count",
                  "type": "INT",
                  "links": null
              },
              {
                  "name": "selected",
                  "type": "STRING",
                  "links": []
              },
              {
                  "name": "text_full",
                  "type": "STRING",
                  "links": [
                      2518
                  ]
              }
          ],
          "properties": {
              "ver": "3d82dbfe091d84868212e5f275deb5447fa4e659",
              "cnr_id": "llm-toolkit",
              "Node name for S&R": "Display_Text"
          },
          "widgets_values": [
              "0",
              "Armored male operative swiftly raises weapon, red-haired female agent reacts smirking confidently, desert terrain stretches beneath cloudy horizon, camera arcs around duo dynamically, warm-toned lighting, stark shadows accentuate tension, Shot on Blackmagic URSA Mini Pro, vibrant tokusatsu aesthetics."
          ]
      },
      {
          "id": 290,
          "pos": [
              -8756.099609375,
              2195.0654296875
          ],
          "mode": 0,
          "size": [
              458.3065490722656,
              280.1310119628906
          ],
          "type": "LLMToolkitTextGeneratorStream",
          "color": "#222",
          "flags": {},
          "order": 193,
          "inputs": [
              {
                  "link": 534,
                  "name": "context",
                  "type": "*",
                  "shape": 7
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "context",
                  "type": "*",
                  "links": [
                      536
                  ]
              }
          ],
          "properties": {
              "ver": "3d82dbfe091d84868212e5f275deb5447fa4e659",
              "cnr_id": "llm-toolkit",
              "Node name for S&R": "LLMToolkitTextGeneratorStream"
          },
          "widgets_values": [
              "gpt-4o-mini",
              "Write a detailed description of a futuristic city.",
              "Armored male operative swiftly raises weapon, red-haired female agent reacts smirking confidently, desert terrain stretches beneath cloudy horizon, camera arcs around duo dynamically, warm-toned lighting, stark shadows accentuate tension, Shot on Blackmagic URSA Mini Pro, vibrant tokusatsu aesthetics."
          ]
      },
      {
          "id": 1052,
          "pos": [
              -10424.84375,
              234.4246368408203
          ],
          "mode": 0,
          "size": [
              420.2709655761719,
              201.9195098876953
          ],
          "type": "Display_Text",
          "color": "#222",
          "flags": {
              "collapsed": false
          },
          "order": 115,
          "inputs": [
              {
                  "link": 2646,
                  "name": "context",
                  "type": "*"
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "context",
                  "type": "*",
                  "links": []
              },
              {
                  "name": "text_list",
                  "type": "STRING",
                  "links": null,
                  "shape": 6
              },
              {
                  "name": "count",
                  "type": "INT",
                  "links": null
              },
              {
                  "name": "selected",
                  "type": "STRING",
                  "links": []
              },
              {
                  "name": "text_full",
                  "type": "STRING",
                  "links": [
                      2650
                  ]
              }
          ],
          "properties": {
              "ver": "3d82dbfe091d84868212e5f275deb5447fa4e659",
              "cnr_id": "llm-toolkit",
              "Node name for S&R": "Display_Text"
          },
          "widgets_values": [
              "0",
              "Transform the illustrated character into a realistic, high-quality live-action cosplay portrayal featuring the provided actress, accurately capturing her distinct facial structure with defined cheekbones, softly rounded jawline, and expressive almond-shaped eyes. Change the hairstyle to short, vibrant red hair styled in soft waves identical to the character's. Keep the costume precisely unchanged with a fitted dark tank top, green tactical pants, knee pads, fingerless gloves, rugged combat boots, gun, and holstered sword accessory. Preserve the original crouched, alert pose and overall composition."
          ]
      },
      {
          "id": 1053,
          "pos": [
              -10429.017578125,
              -52.78694152832031
          ],
          "mode": 0,
          "size": [
              427.4910583496094,
              238.13401794433594
          ],
          "type": "LLMToolkitTextGeneratorStream",
          "color": "#222",
          "flags": {},
          "order": 108,
          "inputs": [
              {
                  "link": 2647,
                  "name": "context",
                  "type": "*",
                  "shape": 7
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "context",
                  "type": "*",
                  "links": [
                      2646
                  ]
              }
          ],
          "properties": {
              "ver": "3d82dbfe091d84868212e5f275deb5447fa4e659",
              "cnr_id": "llm-toolkit",
              "Node name for S&R": "LLMToolkitTextGeneratorStream"
          },
          "widgets_values": [
              "gpt-4o-mini",
              "Write a detailed description of a futuristic city.",
              "Transform the illustrated character into a realistic, high-quality live-action cosplay portrayal featuring the provided actress, accurately capturing her distinct facial structure with defined cheekbones, softly rounded jawline, and expressive almond-shaped eyes. Change the hairstyle to short, vibrant red hair styled in soft waves identical to the character's. Keep the costume precisely unchanged with a fitted dark tank top, green tactical pants, knee pads, fingerless gloves, rugged combat boots, gun, and holstered sword accessory. Preserve the original crouched, alert pose and overall composition."
          ]
      },
      {
          "id": 1051,
          "pos": [
              -10436.12109375,
              -339.3321533203125
          ],
          "mode": 0,
          "size": [
              440.57611083984375,
              240.34864807128906
          ],
          "type": "PromptManager",
          "color": "#222",
          "flags": {},
          "order": 95,
          "inputs": [
              {
                  "link": 2648,
                  "name": "context",
                  "type": "*",
                  "shape": 7
              },
              {
                  "link": 2649,
                  "name": "image",
                  "type": "IMAGE",
                  "shape": 7
              },
              {
                  "link": null,
                  "name": "mask",
                  "type": "MASK",
                  "shape": 7
              },
              {
                  "link": null,
                  "name": "video",
                  "type": "IMAGE",
                  "shape": 7
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "context",
                  "type": "*",
                  "links": [
                      2647
                  ]
              }
          ],
          "properties": {
              "ver": "3d82dbfe091d84868212e5f275deb5447fa4e659",
              "cnr_id": "llm-toolkit",
              "Node name for S&R": "PromptManager"
          },
          "widgets_values": [
              "You are a master artist crafting precise visual narratives for text-to-image generation. When given an image or visual description, create a flowing 70 word paragraph following this base on the TASK\n\n### 1. Basic Modifications\n- Simple and direct: `\"Change the car color to red\"`\n- Maintain style: `\"Change to daytime while maintaining the same style of the painting\"`\n\n### 2. Style Transfer\n**Principles:**\n- Clearly name style: `\"Transform to Bauhaus art style\"`\n- Describe characteristics: `\"Transform to oil painting with visible brushstrokes, thick paint texture\"`\n- Preserve composition: `\"Change to Bauhaus style while maintaining the original composition\"`\n\n### 3. Character Consistency\n**Framework:**\n- Specific description: `\"The woman with short black hair\"` instead of \"she\"\n- Preserve features: `\"while maintaining the same facial features, hairstyle, and expression\"`\n- Step-by-step modifications: Change background first, then actions\n\n### 4. Text Editing\n- Use quotes: `\"Replace 'joy' with 'BFL'\"`\n- Maintain format: `\"Replace text while maintaining the same font style\"`\n\n## Common Problem Solutions\n\n### Character Changes Too Much\n❌ Wrong: `\"Transform the person into a Viking\"`\n✅ Correct: `\"Change the clothes to be a viking warrior while preserving facial features\"`\n\n### Composition Position Changes\n❌ Wrong: `\"Put him on a beach\"`\n✅ Correct: `\"Change the background to a beach while keeping the person in the exact same position, scale, and pose\"`\n\n### Style Application Inaccuracy\n❌ Wrong: `\"Make it a sketch\"`\n✅ Correct: `\"Convert to pencil sketch with natural graphite lines, cross-hatching, and visible paper texture\"`\n\n## Core Principles\n\n1. **Be Specific and Clear** - Use precise descriptions, avoid vague terms\n2. **Step-by-step Editing** - Break complex modifications into multiple simple steps\n3. **Explicit Preservation** - State what should remain unchanged\n4. **Verb Selection** - Use \"change\", \"replace\" rather than \"transform\"\n\n## Best Practice Templates\n\n**Object Modification:**\n`\"Change [object] to [new state], keep [content to preserve] unchanged\"`\n\n**Style Transfer:**\n`\"Transform to [specific style], while maintaining [composition/character/other] unchanged\"`\n\n**Background Replacement:**\n`\"Change the background to [new background], keep the subject in the exact same position and pose\"`\n\n**Text Editing:**\n`\"Replace '[original text]' with '[new text]', maintain the same font style\"`\n\n> **Remember:** The more specific, the better. Kontext excels at understanding detailed instructions and maintaining consistency. \n\n**TASK:**\nTransform the first image to Transform the character into a realistic, high-quality live-action cosplay portrayal featuring the provided Actress with slithly stylized pushed proportions to improve the charcter likeness Acurately describe the facial structure features and characteristics, haistyle, costume, accessories and props and pose of each character from the original picture in order to replace it with the matching actress provided. Keep the composition, poses and costumes of the characters. Transforming the image into the live action representation of the character. Make sure all the visual characteristic from the character in the original image are an accurately LIFELIKE portrayal of the character by the actress ",
              "",
              "",
              ""
          ]
      },
      {
          "id": 1055,
          "pos": [
              -10420.107421875,
              1285.1754150390625
          ],
          "mode": 0,
          "size": [
              420.2709655761719,
              201.9195098876953
          ],
          "type": "Display_Text",
          "color": "#222",
          "flags": {
              "collapsed": false
          },
          "order": 114,
          "inputs": [
              {
                  "link": 2652,
                  "name": "context",
                  "type": "*"
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "context",
                  "type": "*",
                  "links": []
              },
              {
                  "name": "text_list",
                  "type": "STRING",
                  "links": null,
                  "shape": 6
              },
              {
                  "name": "count",
                  "type": "INT",
                  "links": null
              },
              {
                  "name": "selected",
                  "type": "STRING",
                  "links": []
              },
              {
                  "name": "text_full",
                  "type": "STRING",
                  "links": [
                      2656
                  ]
              }
          ],
          "properties": {
              "ver": "3d82dbfe091d84868212e5f275deb5447fa4e659",
              "cnr_id": "llm-toolkit",
              "Node name for S&R": "Display_Text"
          },
          "widgets_values": [
              "0",
              "Transform the original stylized illustration into a photorealistic, high-quality, top-production cosplay-style live-action portrayal, accurately capturing the actor's facial structure with defined cheekbones, a strong jawline, and expressive blue eyes. Change the hairstyle to short, tousled, spiky blonde hair with natural highlights, complemented by a rugged beard and mustache. Preserve the character's iconic costume, including tactical dark headband flowing dramatically, detailed body harness with multiple utility pouches, muscular physique with pushed proportions, fingerless gloves, and combat boots, while maintaining the exact pose holding a pistol downward."
          ]
      },
      {
          "id": 1056,
          "pos": [
              -10424.28125,
              997.964599609375
          ],
          "mode": 0,
          "size": [
              427.4910583496094,
              238.13401794433594
          ],
          "type": "LLMToolkitTextGeneratorStream",
          "color": "#222",
          "flags": {},
          "order": 105,
          "inputs": [
              {
                  "link": 2653,
                  "name": "context",
                  "type": "*",
                  "shape": 7
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "context",
                  "type": "*",
                  "links": [
                      2652
                  ]
              }
          ],
          "properties": {
              "ver": "3d82dbfe091d84868212e5f275deb5447fa4e659",
              "cnr_id": "llm-toolkit",
              "Node name for S&R": "LLMToolkitTextGeneratorStream"
          },
          "widgets_values": [
              "gpt-4o-mini",
              "Write a detailed description of a futuristic city.",
              "Transform the original stylized illustration into a photorealistic, high-quality, top-production cosplay-style live-action portrayal, accurately capturing the actor's facial structure with defined cheekbones, a strong jawline, and expressive blue eyes. Change the hairstyle to short, tousled, spiky blonde hair with natural highlights, complemented by a rugged beard and mustache. Preserve the character's iconic costume, including tactical dark headband flowing dramatically, detailed body harness with multiple utility pouches, muscular physique with pushed proportions, fingerless gloves, and combat boots, while maintaining the exact pose holding a pistol downward."
          ]
      },
      {
          "id": 1054,
          "pos": [
              -10431.384765625,
              711.4160766601562
          ],
          "mode": 0,
          "size": [
              440.57611083984375,
              240.34864807128906
          ],
          "type": "PromptManager",
          "color": "#222",
          "flags": {},
          "order": 93,
          "inputs": [
              {
                  "link": 2654,
                  "name": "context",
                  "type": "*",
                  "shape": 7
              },
              {
                  "link": 2655,
                  "name": "image",
                  "type": "IMAGE",
                  "shape": 7
              },
              {
                  "link": null,
                  "name": "mask",
                  "type": "MASK",
                  "shape": 7
              },
              {
                  "link": null,
                  "name": "video",
                  "type": "IMAGE",
                  "shape": 7
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "context",
                  "type": "*",
                  "links": [
                      2653
                  ]
              }
          ],
          "properties": {
              "ver": "3d82dbfe091d84868212e5f275deb5447fa4e659",
              "cnr_id": "llm-toolkit",
              "Node name for S&R": "PromptManager"
          },
          "widgets_values": [
              "You are a master artist crafting precise visual narratives for text-to-image generation. When given an image or visual description, create a flowing 70 word paragraph following this base on the TASK\n\n### 1. Basic Modifications\n- Simple and direct: `\"Change the car color to red\"`\n- Maintain style: `\"Change to daytime while maintaining the same style of the painting\"`\n\n### 2. Style Transfer\n**Principles:**\n- Clearly name style: `\"Transform to Bauhaus art style\"`\n- Describe characteristics: `\"Transform to oil painting with visible brushstrokes, thick paint texture\"`\n- Preserve composition: `\"Change to Bauhaus style while maintaining the original composition\"`\n\n### 3. Character Consistency\n**Framework:**\n- Specific description: `\"The woman with short black hair\"` instead of \"she\"\n- Preserve features: `\"while maintaining the same facial features, hairstyle, and expression\"`\n- Step-by-step modifications: Change background first, then actions\n\n### 4. Text Editing\n- Use quotes: `\"Replace 'joy' with 'BFL'\"`\n- Maintain format: `\"Replace text while maintaining the same font style\"`\n\n## Common Problem Solutions\n\n### Character Changes Too Much\n❌ Wrong: `\"Transform the person into a Viking\"`\n✅ Correct: `\"Change the clothes to be a viking warrior while preserving facial features\"`\n\n### Composition Position Changes\n❌ Wrong: `\"Put him on a beach\"`\n✅ Correct: `\"Change the background to a beach while keeping the person in the exact same position, scale, and pose\"`\n\n### Style Application Inaccuracy\n❌ Wrong: `\"Make it a sketch\"`\n✅ Correct: `\"Convert to pencil sketch with natural graphite lines, cross-hatching, and visible paper texture\"`\n\n## Core Principles\n\n1. **Be Specific and Clear** - Use precise descriptions, avoid vague terms\n2. **Step-by-step Editing** - Break complex modifications into multiple simple steps\n3. **Explicit Preservation** - State what should remain unchanged\n4. **Verb Selection** - Use \"change\", \"replace\" rather than \"transform\"\n\n## Best Practice Templates\n\n**Object Modification:**\n`\"Change [object] to [new state], keep [content to preserve] unchanged\"`\n\n**Style Transfer:**\n`\"Transform to [specific style], while maintaining [composition/character/other] unchanged\"`\n\n**Background Replacement:**\n`\"Change the background to [new background], keep the subject in the exact same position and pose\"`\n\n**Text Editing:**\n`\"Replace '[original text]' with '[new text]', maintain the same font style\"`\n\n> **Remember:** The more specific, the better. Kontext excels at understanding detailed instructions and maintaining consistency. \n\n**TASK:**\nTransform the first image to a realistic accurate High quality top production cosplay style live-action stylized pushed proportions photoreal aesthetic, but be sure to push the proportions to improve the charcter likeness keep the composition, poses and costumes of the characters. Acurately describe the facial structure features and characteristics, haistyle, costume, accessories and props and pose of each character from the original picture in order to replace it with the matching gender portrait of the actor or actress provided. Transforming the image into the live action representation of the character. Make sure all the visual characteristic from the character in the original image are an accurately LIFELIKE portrayal of the character by the actor ",
              "",
              "",
              ""
          ]
      },
      {
          "id": 314,
          "pos": [
              -9941.732421875,
              1195.31298828125
          ],
          "mode": 0,
          "size": [
              360.67510986328125,
              391.8146667480469
          ],
          "type": "LoadImage",
          "color": "#222",
          "flags": {},
          "order": 29,
          "title": "Load Image: Reference",
          "inputs": [],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      592,
                      1247
                  ]
              },
              {
                  "name": "MASK",
                  "type": "MASK",
                  "links": null
              }
          ],
          "properties": {
              "ver": "0.3.27",
              "cnr_id": "comfy-core",
              "Node name for S&R": "LoadImage"
          },
          "widgets_values": [
              "415bfd32-0414-4f7c-b261-8b9167f5430f.jpeg",
              "image"
          ]
      },
      {
          "id": 772,
          "pos": [
              -5731.87451171875,
              1308.1505126953125
          ],
          "mode": 0,
          "size": [
              400,
              200
          ],
          "type": "ComfyUIDeployExternalText",
          "color": "#222",
          "flags": {},
          "order": 30,
          "inputs": [],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "text",
                  "type": "STRING",
                  "links": [
                      1949,
                      2410
                  ]
              }
          ],
          "properties": {
              "ver": "b889f79baf9e099d5e54bd20bab4aa1e7c3296c0",
              "cnr_id": "comfyui-deploy",
              "Node name for S&R": "ComfyUIDeployExternalText"
          },
          "widgets_values": [
              "ACTOR_IS_LEFT?",
              "1\n\n",
              "",
              "Cero 0 Means NO\n"
          ]
      },
      {
          "id": 691,
          "pos": [
              -4945.57470703125,
              1666.9183349609375
          ],
          "mode": 4,
          "size": [
              210,
              88
          ],
          "type": "Note",
          "color": "#222",
          "flags": {},
          "order": 31,
          "inputs": [],
          "bgcolor": "#000",
          "outputs": [],
          "properties": {},
          "widgets_values": [
              "if man on the right   1 \notherwise 0"
          ]
      },
      {
          "id": 1057,
          "pos": [
              -11535.4873046875,
              3021.384765625
          ],
          "mode": 0,
          "size": [
              274.080078125,
              314.000244140625
          ],
          "type": "LoadImage",
          "color": "#232",
          "flags": {},
          "order": 32,
          "inputs": [],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": []
              },
              {
                  "name": "MASK",
                  "type": "MASK",
                  "links": null
              }
          ],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "LoadImage"
          },
          "widgets_values": [
              "SCENE_COUPLE_00001_ (1).png",
              "image"
          ]
      },
      {
          "id": 661,
          "pos": [
              -11687.8408203125,
              4645.38671875
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#232",
          "flags": {},
          "order": 45,
          "inputs": [
              {
                  "link": 1373,
                  "name": "",
                  "type": "*",
                  "widget": {
                      "name": "value"
                  }
              }
          ],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "",
                  "type": "*",
                  "links": [
                      1374,
                      1376,
                      1378,
                      1380
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 1058,
          "pos": [
              -11531.767578125,
              3804.327392578125
          ],
          "mode": 0,
          "size": [
              274.080078125,
              314.000244140625
          ],
          "type": "LoadImage",
          "color": "#232",
          "flags": {},
          "order": 33,
          "inputs": [],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": []
              },
              {
                  "name": "MASK",
                  "type": "MASK",
                  "links": null
              }
          ],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "LoadImage"
          },
          "widgets_values": [
              "SCENE_COUPLE_00001_ (1).png",
              "image"
          ]
      },
      {
          "id": 786,
          "pos": [
              -6606.984375,
              1698.735595703125
          ],
          "mode": 0,
          "size": [
              270,
              58
          ],
          "type": "PrimitiveFloat",
          "color": "#222",
          "flags": {},
          "order": 43,
          "inputs": [
              {
                  "link": 1986,
                  "name": "value",
                  "type": "FLOAT",
                  "widget": {
                      "name": "value"
                  }
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "FLOAT",
                  "type": "FLOAT",
                  "links": [
                      2084,
                      2091
                  ]
              }
          ],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "PrimitiveFloat"
          },
          "widgets_values": [
              24
          ]
      },
      {
          "id": 694,
          "pos": [
              -5278.53466796875,
              1366.131103515625
          ],
          "mode": 0,
          "size": [
              270,
              58
          ],
          "type": "PrimitiveString",
          "color": "#222",
          "flags": {},
          "order": 59,
          "inputs": [
              {
                  "link": 1949,
                  "name": "value",
                  "type": "STRING",
                  "widget": {
                      "name": "value"
                  }
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "STRING",
                  "type": "STRING",
                  "links": []
              }
          ],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "PrimitiveString"
          },
          "widgets_values": [
              "0"
          ]
      },
      {
          "id": 446,
          "pos": [
              -9213.76953125,
              2356.06591796875
          ],
          "mode": 0,
          "size": [
              270,
              270
          ],
          "type": "SaveImage",
          "color": "#222",
          "flags": {},
          "order": 164,
          "inputs": [
              {
                  "link": 1590,
                  "name": "images",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "SaveImage"
          },
          "widgets_values": [
              "SCENE_COUPLE"
          ]
      },
      {
          "id": 447,
          "pos": [
              -9176.3251953125,
              2288.77685546875
          ],
          "mode": 0,
          "size": [
              270,
              266
          ],
          "type": "ImageResizeKJv2",
          "color": "#222",
          "flags": {
              "collapsed": true
          },
          "order": 163,
          "inputs": [
              {
                  "link": 1589,
                  "name": "image",
                  "type": "IMAGE"
              },
              {
                  "link": 1662,
                  "name": "width",
                  "type": "INT",
                  "widget": {
                      "name": "width"
                  }
              },
              {
                  "link": 1663,
                  "name": "height",
                  "type": "INT",
                  "widget": {
                      "name": "height"
                  }
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      1590,
                      2532
                  ]
              },
              {
                  "name": "width",
                  "type": "INT",
                  "links": []
              },
              {
                  "name": "height",
                  "type": "INT",
                  "links": []
              }
          ],
          "properties": {
              "ver": "5dcda71011870278c35d92ff77a677ed2e538f2d",
              "cnr_id": "comfyui-kjnodes",
              "Node name for S&R": "ImageResizeKJv2"
          },
          "widgets_values": [
              512,
              512,
              "lanczos",
              "pad",
              "255,255,255",
              "center",
              16,
              "cpu"
          ]
      },
      {
          "id": 575,
          "pos": [
              -6355.8857421875,
              2506.951904296875
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#223",
          "flags": {},
          "order": 61,
          "inputs": [
              {
                  "link": 2672,
                  "name": "",
                  "type": "*",
                  "widget": {
                      "name": "value"
                  }
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "",
                  "type": "INT",
                  "links": [
                      2667,
                      2669,
                      2670
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 1061,
          "pos": [
              -8249.8359375,
              -94.92755126953125
          ],
          "mode": 0,
          "size": [
              1849.1015625,
              120
          ],
          "type": "Label (rgthree)",
          "color": "#fff0",
          "flags": {
              "allow_interaction": true
          },
          "order": 34,
          "title": "www.youtube.com/@impactframes",
          "inputs": [],
          "bgcolor": "#fff0",
          "outputs": [],
          "properties": {
              "padding": 0,
              "fontSize": 120,
              "fontColor": "#999999",
              "textAlign": "left",
              "fontFamily": "Arial",
              "borderRadius": 0,
              "backgroundColor": "\n\n\n\n\n\n\n\n#e6ccff"
          }
      },
      {
          "id": 1059,
          "pos": [
              -5729.59912109375,
              760.2094116210938
          ],
          "mode": 0,
          "size": [
              400,
              208
          ],
          "type": "ComfyUIDeployExternalSeed",
          "color": "#222",
          "flags": {},
          "order": 35,
          "inputs": [],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "seed",
                  "type": "INT",
                  "links": [
                      2672
                  ]
              }
          ],
          "properties": {
              "ver": "ceb53bcb228176b854c7d72140a0dbedaa212eea",
              "cnr_id": "comfyui-deploy",
              "Node name for S&R": "ComfyUIDeployExternalSeed"
          },
          "widgets_values": [
              "input_seed",
              -1,
              1,
              4294967295,
              "",
              "For default value:\n\"-1\" (i.e. not in range): Randomize within the min and max value range. \nin range: Fixed, always the same value\n"
          ]
      },
      {
          "id": 1064,
          "pos": [
              -5604.23828125,
              2845.32861328125
          ],
          "mode": 4,
          "size": [
              269.1610107421875,
              263.4264831542969
          ],
          "type": "ShowText|pysssss",
          "color": "#432",
          "flags": {},
          "order": 204,
          "inputs": [
              {
                  "link": 2674,
                  "name": "text",
                  "type": "STRING"
              }
          ],
          "bgcolor": "#653",
          "outputs": [
              {
                  "name": "STRING",
                  "type": "STRING",
                  "links": null,
                  "shape": 6
              }
          ],
          "properties": {
              "ver": "1.2.5",
              "cnr_id": "comfyui-custom-scripts",
              "Node name for S&R": "ShowText|pysssss"
          },
          "widgets_values": []
      },
      {
          "id": 1065,
          "pos": [
              -5342.44775390625,
              1965.4169921875
          ],
          "mode": 0,
          "size": [
              270,
              78
          ],
          "type": "CreateVideo",
          "color": "#233",
          "flags": {},
          "order": 208,
          "inputs": [
              {
                  "link": 2680,
                  "name": "images",
                  "type": "IMAGE"
              },
              {
                  "link": null,
                  "name": "audio",
                  "type": "AUDIO",
                  "shape": 7
              },
              {
                  "link": 2679,
                  "name": "fps",
                  "type": "FLOAT",
                  "widget": {
                      "name": "fps"
                  }
              }
          ],
          "bgcolor": "#355",
          "outputs": [
              {
                  "name": "VIDEO",
                  "type": "VIDEO",
                  "links": [
                      2676
                  ]
              }
          ],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "CreateVideo"
          },
          "widgets_values": [
              30
          ]
      },
      {
          "id": 1068,
          "pos": [
              -5314.3525390625,
              2266.99658203125
          ],
          "mode": 0,
          "size": [
              224.12109375,
              206
          ],
          "type": "VHS_VideoInfo",
          "color": "#233",
          "flags": {
              "collapsed": true
          },
          "order": 206,
          "inputs": [
              {
                  "link": 2681,
                  "name": "video_info",
                  "type": "VHS_VIDEOINFO"
              }
          ],
          "bgcolor": "#355",
          "outputs": [
              {
                  "name": "source_fps🟨",
                  "type": "FLOAT",
                  "links": [
                      2679
                  ]
              },
              {
                  "name": "source_frame_count🟨",
                  "type": "INT",
                  "links": null
              },
              {
                  "name": "source_duration🟨",
                  "type": "FLOAT",
                  "links": null
              },
              {
                  "name": "source_width🟨",
                  "type": "INT",
                  "links": null
              },
              {
                  "name": "source_height🟨",
                  "type": "INT",
                  "links": null
              },
              {
                  "name": "loaded_fps🟦",
                  "type": "FLOAT",
                  "links": null
              },
              {
                  "name": "loaded_frame_count🟦",
                  "type": "INT",
                  "links": null
              },
              {
                  "name": "loaded_duration🟦",
                  "type": "FLOAT",
                  "links": null
              },
              {
                  "name": "loaded_width🟦",
                  "type": "INT",
                  "links": null
              },
              {
                  "name": "loaded_height🟦",
                  "type": "INT",
                  "links": null
              }
          ],
          "properties": {
              "ver": "f7369389620ff244ddd6086cf0fa792a569086f2",
              "cnr_id": "comfyui-videohelpersuite",
              "Node name for S&R": "VHS_VideoInfo"
          },
          "widgets_values": {}
      },
      {
          "id": 888,
          "pos": [
              -7113.50390625,
              3881.8427734375
          ],
          "mode": 0,
          "size": [
              270,
              146
          ],
          "type": "ImageCompositeMasked",
          "color": "#222",
          "flags": {},
          "order": 186,
          "inputs": [
              {
                  "link": 2246,
                  "name": "destination",
                  "type": "IMAGE"
              },
              {
                  "link": 2247,
                  "name": "source",
                  "type": "IMAGE"
              },
              {
                  "link": 2248,
                  "name": "mask",
                  "type": "MASK",
                  "shape": 7
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      2249,
                      2250,
                      2550,
                      2684
                  ]
              }
          ],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "ImageCompositeMasked"
          },
          "widgets_values": [
              0,
              0,
              false
          ]
      },
      {
          "id": 1063,
          "pos": [
              -6047.15478515625,
              2681.442138671875
          ],
          "mode": 4,
          "size": [
              400,
              302
          ],
          "type": "KlingImage2VideoNode",
          "color": "#432",
          "flags": {},
          "order": 198,
          "inputs": [
              {
                  "link": 2684,
                  "name": "start_frame",
                  "type": "IMAGE"
              },
              {
                  "link": 2685,
                  "name": "prompt",
                  "type": "STRING",
                  "widget": {
                      "name": "prompt"
                  }
              },
              {
                  "link": 2686,
                  "name": "aspect_ratio",
                  "type": "COMBO",
                  "widget": {
                      "name": "aspect_ratio"
                  }
              }
          ],
          "bgcolor": "#653",
          "outputs": [
              {
                  "name": "VIDEO",
                  "type": "VIDEO",
                  "links": [
                      2673
                  ]
              },
              {
                  "name": "video_id",
                  "type": "STRING",
                  "links": [
                      2674
                  ]
              },
              {
                  "name": "duration",
                  "type": "STRING",
                  "links": null
              }
          ],
          "properties": {
              "Node name for S&R": "KlingImage2VideoNode"
          },
          "widgets_values": [
              "",
              "blur, distort, and low quality",
              "kling-v2-master",
              0.8,
              "pro",
              "9:16",
              "5"
          ]
      },
      {
          "id": 570,
          "pos": [
              -6043.888671875,
              1977.876708984375
          ],
          "mode": 0,
          "size": [
              400,
              200
          ],
          "type": "KlingMaster_fal",
          "color": "#233",
          "flags": {},
          "order": 197,
          "inputs": [
              {
                  "link": 2550,
                  "name": "image",
                  "type": "IMAGE",
                  "shape": 7
              },
              {
                  "link": 2529,
                  "name": "prompt",
                  "type": "STRING",
                  "widget": {
                      "name": "prompt"
                  }
              },
              {
                  "link": 2687,
                  "name": "aspect_ratio",
                  "type": "COMBO",
                  "widget": {
                      "name": "aspect_ratio"
                  }
              }
          ],
          "bgcolor": "#355",
          "outputs": [
              {
                  "name": "STRING",
                  "type": "STRING",
                  "links": [
                      1159,
                      1160,
                      1228,
                      2001
                  ]
              }
          ],
          "properties": {
              "ver": "63cb3fcf0d56cc5292bd165ab021c6319e35c052",
              "aux_id": "if-ai/ComfyUI-fal-API",
              "Node name for S&R": "KlingMaster_fal"
          },
          "widgets_values": [
              "",
              "5",
              "9:16"
          ]
      },
      {
          "id": 448,
          "pos": [
              -9232.4169921875,
              1769.7574462890625
          ],
          "mode": 0,
          "size": [
              400,
              364
          ],
          "type": "FluxProKontextMulti_fal",
          "color": "#222",
          "flags": {},
          "order": 161,
          "inputs": [
              {
                  "link": 1500,
                  "name": "image_1",
                  "type": "IMAGE"
              },
              {
                  "link": 2040,
                  "name": "image_2",
                  "type": "IMAGE"
              },
              {
                  "link": 2043,
                  "name": "image_3",
                  "type": "IMAGE",
                  "shape": 7
              },
              {
                  "link": 1533,
                  "name": "image_4",
                  "type": "IMAGE",
                  "shape": 7
              },
              {
                  "link": 2507,
                  "name": "prompt",
                  "type": "STRING",
                  "widget": {
                      "name": "prompt"
                  }
              },
              {
                  "link": 2688,
                  "name": "aspect_ratio",
                  "type": "COMBO",
                  "shape": 7,
                  "widget": {
                      "name": "aspect_ratio"
                  }
              },
              {
                  "link": 2667,
                  "name": "seed",
                  "type": "INT",
                  "shape": 7,
                  "widget": {
                      "name": "seed"
                  }
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      1588
                  ]
              }
          ],
          "properties": {
              "ver": "63cb3fcf0d56cc5292bd165ab021c6319e35c052",
              "aux_id": "if-ai/ComfyUI-fal-API",
              "Node name for S&R": "FluxProKontextMulti_fal"
          },
          "widgets_values": [
              "",
              "9:16",
              true,
              3.2,
              1,
              "5",
              "png",
              false,
              1779730910,
              "randomize"
          ]
      },
      {
          "id": 436,
          "pos": [
              -9237.7666015625,
              716.4047241210938
          ],
          "mode": 0,
          "size": [
              400,
              364
          ],
          "type": "FluxProKontextMulti_fal",
          "color": "#222",
          "flags": {},
          "order": 120,
          "inputs": [
              {
                  "link": 830,
                  "name": "image_1",
                  "type": "IMAGE"
              },
              {
                  "link": 831,
                  "name": "image_2",
                  "type": "IMAGE"
              },
              {
                  "link": null,
                  "name": "image_3",
                  "type": "IMAGE",
                  "shape": 7
              },
              {
                  "link": null,
                  "name": "image_4",
                  "type": "IMAGE",
                  "shape": 7
              },
              {
                  "link": 2511,
                  "name": "prompt",
                  "type": "STRING",
                  "widget": {
                      "name": "prompt"
                  }
              },
              {
                  "link": 2689,
                  "name": "aspect_ratio",
                  "type": "COMBO",
                  "shape": 7,
                  "widget": {
                      "name": "aspect_ratio"
                  }
              },
              {
                  "link": 2670,
                  "name": "seed",
                  "type": "INT",
                  "shape": 7,
                  "widget": {
                      "name": "seed"
                  }
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      829
                  ]
              }
          ],
          "properties": {
              "ver": "63cb3fcf0d56cc5292bd165ab021c6319e35c052",
              "aux_id": "if-ai/ComfyUI-fal-API",
              "Node name for S&R": "FluxProKontextMulti_fal"
          },
          "widgets_values": [
              "",
              "9:16",
              true,
              3.5,
              1,
              "6",
              "png",
              false,
              1231823336,
              "randomize"
          ]
      },
      {
          "id": 1072,
          "pos": [
              -6688.83544921875,
              1391.46240234375
          ],
          "mode": 0,
          "size": [
              400,
              214
          ],
          "type": "ComfyUIDeployExternalEnum",
          "color": "#222",
          "flags": {},
          "order": 36,
          "inputs": [],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "text",
                  "type": "*",
                  "links": [
                      2686,
                      2687,
                      2688,
                      2689,
                      2690
                  ]
              }
          ],
          "properties": {
              "ver": "ceb53bcb228176b854c7d72140a0dbedaa212eea",
              "cnr_id": "comfyui-deploy",
              "Node name for S&R": "ComfyUIDeployExternalEnum"
          },
          "widgets_values": [
              "aspect_ratio",
              "9:16",
              "[\"16:9\",\"9:16\",\"1:1\"]",
              "",
              ""
          ]
      },
      {
          "id": 1060,
          "pos": [
              -8394.029296875,
              -273.2849426269531
          ],
          "mode": 0,
          "size": [
              2025.17578125,
              120
          ],
          "type": "Label (rgthree)",
          "color": "#fff0",
          "flags": {
              "allow_interaction": true
          },
          "order": 37,
          "title": "Sponsored by COMFYDEPLOY.COM ",
          "inputs": [],
          "bgcolor": "#fff0",
          "outputs": [],
          "properties": {
              "padding": 0,
              "fontSize": 120,
              "fontColor": "#999999",
              "textAlign": "left",
              "fontFamily": "Arial",
              "borderRadius": 0,
              "backgroundColor": "\n\n\n\n\n\n\n\n#e6ccff"
          }
      },
      {
          "id": 992,
          "pos": [
              -6219.939453125,
              3707.392822265625
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#222",
          "flags": {},
          "order": 158,
          "inputs": [
              {
                  "link": 2697,
                  "name": "",
                  "type": "*",
                  "widget": {
                      "name": "value"
                  }
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "",
                  "type": "STRING",
                  "links": [
                      2507
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 998,
          "pos": [
              -9736.568359375,
              3006.946533203125
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#232",
          "flags": {},
          "order": 165,
          "inputs": [
              {
                  "link": 2532,
                  "name": "",
                  "type": "*"
              }
          ],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "",
                  "type": "IMAGE",
                  "links": [
                      2533
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 793,
          "pos": [
              -5615.5009765625,
              1975.078857421875
          ],
          "mode": 0,
          "size": [
              236.4912109375,
              286
          ],
          "type": "VHS_LoadVideoPath",
          "color": "#233",
          "flags": {},
          "order": 202,
          "inputs": [
              {
                  "link": null,
                  "name": "meta_batch",
                  "type": "VHS_BatchManager",
                  "shape": 7
              },
              {
                  "link": null,
                  "name": "vae",
                  "type": "VAE",
                  "shape": 7
              },
              {
                  "link": 2001,
                  "name": "video",
                  "type": "STRING",
                  "widget": {
                      "name": "video"
                  }
              }
          ],
          "bgcolor": "#355",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      2680,
                      2698
                  ]
              },
              {
                  "name": "frame_count",
                  "type": "INT",
                  "links": null
              },
              {
                  "name": "audio",
                  "type": "AUDIO",
                  "links": null
              },
              {
                  "name": "video_info",
                  "type": "VHS_VIDEOINFO",
                  "links": [
                      2681
                  ]
              }
          ],
          "properties": {
              "ver": "f7369389620ff244ddd6086cf0fa792a569086f2",
              "cnr_id": "comfyui-videohelpersuite",
              "Node name for S&R": "VHS_LoadVideoPath"
          },
          "widgets_values": {
              "video": "",
              "format": "Wan",
              "force_rate": 0,
              "custom_width": 0,
              "videopreview": {
                  "hidden": false,
                  "params": {
                      "type": "path",
                      "format": "video/",
                      "filename": "",
                      "force_rate": 0,
                      "custom_width": 0,
                      "custom_height": 0,
                      "frame_load_cap": 0,
                      "select_every_nth": 1,
                      "skip_first_frames": 0
                  },
                  "paused": false
              },
              "custom_height": 0,
              "frame_load_cap": 0,
              "select_every_nth": 1,
              "skip_first_frames": 0
          }
      },
      {
          "id": 334,
          "pos": [
              -9208.0625,
              1133.864013671875
          ],
          "mode": 0,
          "size": [
              196.41659545898438,
              26
          ],
          "type": "ImageRemoveAlpha+",
          "color": "#222",
          "flags": {},
          "order": 122,
          "inputs": [
              {
                  "link": 829,
                  "name": "image",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      615
                  ]
              }
          ],
          "properties": {
              "ver": "33ff89fd354d8ec3ab6affb605a79a931b445d99",
              "cnr_id": "comfyui_essentials",
              "Node name for S&R": "ImageRemoveAlpha+"
          },
          "widgets_values": []
      },
      {
          "id": 288,
          "pos": [
              -9490,
              167.5557098388672
          ],
          "mode": 0,
          "size": [
              140,
              46
          ],
          "type": "ImageBatch",
          "color": "#222",
          "flags": {},
          "order": 82,
          "inputs": [
              {
                  "link": 683,
                  "name": "image1",
                  "type": "IMAGE"
              },
              {
                  "link": 684,
                  "name": "image2",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      2649
                  ]
              }
          ],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "ImageBatch"
          },
          "widgets_values": []
      },
      {
          "id": 437,
          "pos": [
              -9229.4140625,
              -342.2063903808594
          ],
          "mode": 0,
          "size": [
              400,
              364
          ],
          "type": "FluxProKontextMulti_fal",
          "color": "#222",
          "flags": {},
          "order": 121,
          "inputs": [
              {
                  "link": 832,
                  "name": "image_1",
                  "type": "IMAGE"
              },
              {
                  "link": 833,
                  "name": "image_2",
                  "type": "IMAGE"
              },
              {
                  "link": null,
                  "name": "image_3",
                  "type": "IMAGE",
                  "shape": 7
              },
              {
                  "link": null,
                  "name": "image_4",
                  "type": "IMAGE",
                  "shape": 7
              },
              {
                  "link": 2509,
                  "name": "prompt",
                  "type": "STRING",
                  "widget": {
                      "name": "prompt"
                  }
              },
              {
                  "link": 2690,
                  "name": "aspect_ratio",
                  "type": "COMBO",
                  "shape": 7,
                  "widget": {
                      "name": "aspect_ratio"
                  }
              },
              {
                  "link": 2669,
                  "name": "seed",
                  "type": "INT",
                  "shape": 7,
                  "widget": {
                      "name": "seed"
                  }
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      828
                  ]
              }
          ],
          "properties": {
              "ver": "63cb3fcf0d56cc5292bd165ab021c6319e35c052",
              "aux_id": "if-ai/ComfyUI-fal-API",
              "Node name for S&R": "FluxProKontextMulti_fal"
          },
          "widgets_values": [
              "",
              "9:16",
              true,
              3.5,
              1,
              "6",
              "png",
              false,
              678571029,
              "randomize"
          ]
      },
      {
          "id": 997,
          "pos": [
              -6350.1943359375,
              3946.616943359375
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#322",
          "flags": {},
          "order": 155,
          "inputs": [
              {
                  "link": 2515,
                  "name": "",
                  "type": "*",
                  "widget": {
                      "name": "value"
                  }
              }
          ],
          "bgcolor": "#533",
          "outputs": [
              {
                  "name": "",
                  "type": "STRING",
                  "links": [
                      2697
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 994,
          "pos": [
              -6356.146484375,
              4000.52490234375
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#322",
          "flags": {},
          "order": 117,
          "inputs": [
              {
                  "link": 2650,
                  "name": "",
                  "type": "*",
                  "widget": {
                      "name": "value"
                  }
              }
          ],
          "bgcolor": "#533",
          "outputs": [
              {
                  "name": "",
                  "type": "STRING",
                  "links": [
                      2696
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 995,
          "pos": [
              -6347.31396484375,
              4046.080078125
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#322",
          "flags": {},
          "order": 116,
          "inputs": [
              {
                  "link": 2656,
                  "name": "",
                  "type": "*",
                  "widget": {
                      "name": "value"
                  }
              }
          ],
          "bgcolor": "#533",
          "outputs": [
              {
                  "name": "",
                  "type": "STRING",
                  "links": [
                      2695
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 996,
          "pos": [
              -6347.041015625,
              4095.601806640625
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#322",
          "flags": {},
          "order": 195,
          "inputs": [
              {
                  "link": 2518,
                  "name": "",
                  "type": "*",
                  "widget": {
                      "name": "value"
                  }
              }
          ],
          "bgcolor": "#533",
          "outputs": [
              {
                  "name": "",
                  "type": "STRING",
                  "links": [
                      2549
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 993,
          "pos": [
              -6218.017578125,
              3856.6923828125
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#222",
          "flags": {},
          "order": 196,
          "inputs": [
              {
                  "link": 2549,
                  "name": "",
                  "type": "*",
                  "widget": {
                      "name": "value"
                  }
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "",
                  "type": "STRING",
                  "links": [
                      2529,
                      2685
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 991,
          "pos": [
              -6216.3046875,
              3805.011962890625
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#222",
          "flags": {},
          "order": 118,
          "inputs": [
              {
                  "link": 2695,
                  "name": "",
                  "type": "*",
                  "widget": {
                      "name": "value"
                  }
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "",
                  "type": "STRING",
                  "links": [
                      2511
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 1062,
          "pos": [
              -5570.6875,
              2718.505615234375
          ],
          "mode": 4,
          "size": [
              864.35009765625,
              1428.48486328125
          ],
          "type": "SaveVideo",
          "color": "#432",
          "flags": {
              "collapsed": true
          },
          "order": 203,
          "inputs": [
              {
                  "link": 2673,
                  "name": "video",
                  "type": "VIDEO"
              }
          ],
          "bgcolor": "#653",
          "outputs": [],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "SaveVideo"
          },
          "widgets_values": [
              "video/ComfyORG_Kling",
              "mp4",
              "h264"
          ]
      },
      {
          "id": 1066,
          "pos": [
              -4688.23779296875,
              427.6860656738281
          ],
          "mode": 0,
          "size": [
              880.4251708984375,
              1444.8924560546875
          ],
          "type": "SaveVideo",
          "color": "#233",
          "flags": {},
          "order": 210,
          "inputs": [
              {
                  "link": 2676,
                  "name": "video",
                  "type": "VIDEO"
              }
          ],
          "bgcolor": "#355",
          "outputs": [],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "SaveVideo"
          },
          "widgets_values": [
              "video/Kling_fal_",
              "auto",
              "auto"
          ]
      },
      {
          "id": 985,
          "pos": [
              -6216.60986328125,
              2529.898193359375
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#223",
          "flags": {},
          "order": 85,
          "inputs": [
              {
                  "link": 2486,
                  "name": "",
                  "type": "*"
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "",
                  "type": "IMAGE",
                  "links": [
                      2487,
                      2548
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 864,
          "pos": [
              -6743.36669921875,
              2837.520263671875
          ],
          "mode": 0,
          "size": [
              240.97996520996094,
              273.6185302734375
          ],
          "type": "PreviewImage",
          "color": "#222",
          "flags": {},
          "order": 106,
          "inputs": [
              {
                  "link": 2176,
                  "name": "images",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "PreviewImage"
          },
          "widgets_values": []
      },
      {
          "id": 867,
          "pos": [
              -7067.39794921875,
              3144.67333984375
          ],
          "mode": 0,
          "size": [
              320,
              254
          ],
          "type": "BiRefNetRMBG",
          "color": "#222",
          "flags": {
              "collapsed": true
          },
          "order": 90,
          "inputs": [
              {
                  "link": 2191,
                  "name": "image",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      2190,
                      2229
                  ]
              },
              {
                  "name": "MASK",
                  "type": "MASK",
                  "links": null
              },
              {
                  "name": "MASK_IMAGE",
                  "type": "IMAGE",
                  "links": []
              }
          ],
          "properties": {
              "ver": "daf0b01deb1c529dfb543093bba2ed586aad7886",
              "cnr_id": "comfyui-rmbg",
              "Node name for S&R": "BiRefNetRMBG"
          },
          "widgets_values": [
              "BiRefNet-general",
              1,
              0,
              false,
              false,
              "Color",
              "#ffffff"
          ]
      },
      {
          "id": 868,
          "pos": [
              -6757.673828125,
              3154.389404296875
          ],
          "mode": 0,
          "size": [
              320,
              254
          ],
          "type": "BiRefNetRMBG",
          "color": "#222",
          "flags": {
              "collapsed": true
          },
          "order": 91,
          "inputs": [
              {
                  "link": 2192,
                  "name": "image",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      2189,
                      2230
                  ]
              },
              {
                  "name": "MASK",
                  "type": "MASK",
                  "links": null
              },
              {
                  "name": "MASK_IMAGE",
                  "type": "IMAGE",
                  "links": []
              }
          ],
          "properties": {
              "ver": "daf0b01deb1c529dfb543093bba2ed586aad7886",
              "cnr_id": "comfyui-rmbg",
              "Node name for S&R": "BiRefNetRMBG"
          },
          "widgets_values": [
              "BiRefNet-general",
              1,
              0,
              false,
              false,
              "Color",
              "#ffffff"
          ]
      },
      {
          "id": 873,
          "pos": [
              -7103.919921875,
              3506.58251953125
          ],
          "mode": 0,
          "size": [
              320,
              254
          ],
          "type": "BiRefNetRMBG",
          "color": "#222",
          "flags": {
              "collapsed": false
          },
          "order": 181,
          "inputs": [
              {
                  "link": 2196,
                  "name": "image",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      2214,
                      2228,
                      2247
                  ]
              },
              {
                  "name": "MASK",
                  "type": "MASK",
                  "links": [
                      2248
                  ]
              },
              {
                  "name": "MASK_IMAGE",
                  "type": "IMAGE",
                  "links": [
                      2200
                  ]
              }
          ],
          "properties": {
              "ver": "daf0b01deb1c529dfb543093bba2ed586aad7886",
              "cnr_id": "comfyui-rmbg",
              "Node name for S&R": "BiRefNetRMBG"
          },
          "widgets_values": [
              "BiRefNet-general",
              1,
              0,
              false,
              false,
              "Color",
              "#ffffff"
          ]
      },
      {
          "id": 878,
          "pos": [
              -6766.19482421875,
              3500.32666015625
          ],
          "mode": 0,
          "size": [
              140,
              246
          ],
          "type": "PreviewImage",
          "color": "#222",
          "flags": {},
          "order": 184,
          "inputs": [
              {
                  "link": 2214,
                  "name": "images",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "PreviewImage"
          },
          "widgets_values": []
      },
      {
          "id": 875,
          "pos": [
              -6620.0439453125,
              3502.5244140625
          ],
          "mode": 0,
          "size": [
              140,
              246
          ],
          "type": "PreviewImage",
          "color": "#222",
          "flags": {},
          "order": 187,
          "inputs": [
              {
                  "link": 2200,
                  "name": "images",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "PreviewImage"
          },
          "widgets_values": []
      },
      {
          "id": 1001,
          "pos": [
              -6349.77978515625,
              3237.788330078125
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#322",
          "flags": {},
          "order": 177,
          "inputs": [
              {
                  "link": 2662,
                  "name": "",
                  "type": "*"
              }
          ],
          "bgcolor": "#533",
          "outputs": [
              {
                  "name": "",
                  "type": "IMAGE",
                  "links": [
                      2692
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 801,
          "pos": [
              -6239.33349609375,
              3087.708740234375
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#222",
          "flags": {},
          "order": 154,
          "inputs": [
              {
                  "link": 2693,
                  "name": "",
                  "type": "*"
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "",
                  "type": "IMAGE",
                  "links": [
                      2033,
                      2040
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 681,
          "pos": [
              -6215.96923828125,
              2454.763916015625
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#223",
          "flags": {},
          "order": 74,
          "inputs": [
              {
                  "link": 1510,
                  "name": "",
                  "type": "*"
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "",
                  "type": "IMAGE",
                  "links": [
                      2701
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 682,
          "pos": [
              -6214.5361328125,
              2488.789306640625
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#223",
          "flags": {},
          "order": 81,
          "inputs": [
              {
                  "link": 1511,
                  "name": "",
                  "type": "*"
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "",
                  "type": "IMAGE",
                  "links": [
                      2478
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 863,
          "pos": [
              -6764.59423828125,
              2797.040283203125
          ],
          "mode": 0,
          "size": [
              320,
              254
          ],
          "type": "BiRefNetRMBG",
          "color": "#222e40",
          "flags": {
              "collapsed": true
          },
          "order": 94,
          "inputs": [
              {
                  "link": 2478,
                  "name": "image",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#364254",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      2176,
                      2703
                  ]
              },
              {
                  "name": "MASK",
                  "type": "MASK",
                  "links": []
              },
              {
                  "name": "MASK_IMAGE",
                  "type": "IMAGE",
                  "links": []
              }
          ],
          "properties": {
              "ver": "daf0b01deb1c529dfb543093bba2ed586aad7886",
              "cnr_id": "comfyui-rmbg",
              "Node name for S&R": "BiRefNetRMBG"
          },
          "widgets_values": [
              "BiRefNet-general",
              1,
              0,
              false,
              false,
              "Color",
              "#ffffff"
          ]
      },
      {
          "id": 983,
          "pos": [
              -6214.99365234375,
              2417.36083984375
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#223",
          "flags": {},
          "order": 84,
          "inputs": [
              {
                  "link": 2481,
                  "name": "",
                  "type": "*"
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "",
                  "type": "IMAGE",
                  "links": [
                      2482,
                      2547
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 229,
          "pos": [
              -9546.048828125,
              270.4660339355469
          ],
          "mode": 0,
          "size": [
              270,
              266
          ],
          "type": "ImageResizeKJv2",
          "color": "#222",
          "flags": {
              "collapsed": false
          },
          "order": 48,
          "inputs": [
              {
                  "link": 560,
                  "name": "image",
                  "type": "IMAGE"
              },
              {
                  "link": 671,
                  "name": "width",
                  "type": "INT",
                  "widget": {
                      "name": "width"
                  }
              },
              {
                  "link": 672,
                  "name": "height",
                  "type": "INT",
                  "widget": {
                      "name": "height"
                  }
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      684,
                      833,
                      1245,
                      1510
                  ]
              },
              {
                  "name": "width",
                  "type": "INT",
                  "links": []
              },
              {
                  "name": "height",
                  "type": "INT",
                  "links": []
              }
          ],
          "properties": {
              "ver": "5dcda71011870278c35d92ff77a677ed2e538f2d",
              "cnr_id": "comfyui-kjnodes",
              "Node name for S&R": "ImageResizeKJv2"
          },
          "widgets_values": [
              480,
              832,
              "lanczos",
              "crop",
              "172,172,172",
              "center",
              16,
              "cpu"
          ]
      },
      {
          "id": 279,
          "pos": [
              -9243.857421875,
              207.4203643798828
          ],
          "mode": 0,
          "size": [
              270,
              270.0001220703125
          ],
          "type": "SaveImage",
          "color": "#222",
          "flags": {},
          "order": 129,
          "inputs": [
              {
                  "link": 617,
                  "name": "images",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [],
          "properties": {
              "ver": "0.3.38",
              "cnr_id": "comfy-core",
              "Node name for S&R": "SaveImage"
          },
          "widgets_values": [
              "FEMALE_CHARACTER"
          ]
      },
      {
          "id": 1073,
          "pos": [
              -6226.62158203125,
              2923.782958984375
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#223",
          "flags": {},
          "order": 107,
          "inputs": [
              {
                  "link": 2703,
                  "name": "",
                  "type": "*"
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "",
                  "type": "IMAGE",
                  "links": [
                      2707,
                      2708,
                      2709
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 955,
          "pos": [
              -3848.7978515625,
              3265.421630859375
          ],
          "mode": 0,
          "size": [
              270,
              82
          ],
          "type": "LTXVFilmGrain",
          "color": "#232",
          "flags": {},
          "order": 215,
          "inputs": [
              {
                  "link": 2398,
                  "name": "images",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      2450
                  ]
              }
          ],
          "properties": {
              "ver": "6e9e6de05624b0aab09b81a2f4a5f473fa97988a",
              "cnr_id": "ComfyUI-LTXVideo",
              "Node name for S&R": "LTXVFilmGrain"
          },
          "widgets_values": [
              0.020000000000000004,
              0.5
          ]
      },
      {
          "id": 956,
          "pos": [
              -3854.158447265625,
              2017.25146484375
          ],
          "mode": 0,
          "size": [
              270,
              82
          ],
          "type": "LTXVFilmGrain",
          "color": "#232",
          "flags": {},
          "order": 211,
          "inputs": [
              {
                  "link": 2399,
                  "name": "images",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      2400,
                      2449
                  ]
              }
          ],
          "properties": {
              "ver": "6e9e6de05624b0aab09b81a2f4a5f473fa97988a",
              "cnr_id": "ComfyUI-LTXVideo",
              "Node name for S&R": "LTXVFilmGrain"
          },
          "widgets_values": [
              0.020000000000000004,
              0.5
          ]
      },
      {
          "id": 345,
          "pos": [
              -11225.40625,
              3170.02978515625
          ],
          "mode": 0,
          "size": [
              285.287109375,
              358
          ],
          "type": "ReActorFaceSwap",
          "color": "#232",
          "flags": {},
          "order": 133,
          "inputs": [
              {
                  "link": 2716,
                  "name": "input_image",
                  "type": "IMAGE"
              },
              {
                  "link": 2710,
                  "name": "source_image",
                  "type": "IMAGE",
                  "shape": 7
              },
              {
                  "link": null,
                  "name": "face_model",
                  "type": "FACE_MODEL",
                  "shape": 7
              },
              {
                  "link": 643,
                  "name": "face_boost",
                  "type": "FACE_BOOST",
                  "shape": 7
              }
          ],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "SWAPPED_IMAGE",
                  "type": "IMAGE",
                  "links": [
                      1509
                  ]
              },
              {
                  "name": "FACE_MODEL",
                  "type": "FACE_MODEL",
                  "links": null
              },
              {
                  "name": "ORIGINAL_IMAGE",
                  "type": "IMAGE",
                  "links": null
              }
          ],
          "properties": {
              "ver": "48a3ad27f99f775dcf63e61276e0110d256597ef",
              "cnr_id": "comfyui-reactor",
              "Node name for S&R": "ReActorFaceSwap"
          },
          "widgets_values": [
              true,
              "inswapper_128.onnx",
              "retinaface_resnet50",
              "codeformer-v0.1.0.pth",
              1,
              0.6000000000000001,
              "no",
              "no",
              "0",
              "0",
              1
          ]
      },
      {
          "id": 490,
          "pos": [
              -9767.9736328125,
              3271.856689453125
          ],
          "mode": 0,
          "size": [
              285.287109375,
              358
          ],
          "type": "ReActorFaceSwap",
          "color": "#232",
          "flags": {},
          "order": 167,
          "inputs": [
              {
                  "link": 1984,
                  "name": "input_image",
                  "type": "IMAGE"
              },
              {
                  "link": 2712,
                  "name": "source_image",
                  "type": "IMAGE",
                  "shape": 7
              },
              {
                  "link": null,
                  "name": "face_model",
                  "type": "FACE_MODEL",
                  "shape": 7
              },
              {
                  "link": 951,
                  "name": "face_boost",
                  "type": "FACE_BOOST",
                  "shape": 7
              }
          ],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "SWAPPED_IMAGE",
                  "type": "IMAGE",
                  "links": [
                      952
                  ]
              },
              {
                  "name": "FACE_MODEL",
                  "type": "FACE_MODEL",
                  "links": null
              },
              {
                  "name": "ORIGINAL_IMAGE",
                  "type": "IMAGE",
                  "links": null
              }
          ],
          "properties": {
              "ver": "48a3ad27f99f775dcf63e61276e0110d256597ef",
              "cnr_id": "comfyui-reactor",
              "Node name for S&R": "ReActorFaceSwap"
          },
          "widgets_values": [
              true,
              "inswapper_128.onnx",
              "YOLOv5l",
              "codeformer-v0.1.0.pth",
              1,
              0.6000000000000001,
              "no",
              "no",
              "1",
              "0",
              1
          ]
      },
      {
          "id": 865,
          "pos": [
              -7097.67138671875,
              2808.045166015625
          ],
          "mode": 0,
          "size": [
              320,
              254
          ],
          "type": "BiRefNetRMBG",
          "color": "#222e40",
          "flags": {
              "collapsed": true
          },
          "order": 89,
          "inputs": [
              {
                  "link": 2701,
                  "name": "image",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#364254",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      2178,
                      2704
                  ]
              },
              {
                  "name": "MASK",
                  "type": "MASK",
                  "links": null
              },
              {
                  "name": "MASK_IMAGE",
                  "type": "IMAGE",
                  "links": []
              }
          ],
          "properties": {
              "ver": "daf0b01deb1c529dfb543093bba2ed586aad7886",
              "cnr_id": "comfyui-rmbg",
              "Node name for S&R": "BiRefNetRMBG"
          },
          "widgets_values": [
              "BiRefNet-general",
              1,
              0,
              false,
              false,
              "Color",
              "#ffffff"
          ]
      },
      {
          "id": 1074,
          "pos": [
              -6226.00634765625,
              2885.75
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#223",
          "flags": {},
          "order": 102,
          "inputs": [
              {
                  "link": 2704,
                  "name": "",
                  "type": "*"
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "",
                  "type": "IMAGE",
                  "links": [
                      2705,
                      2710,
                      2712
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 230,
          "pos": [
              -9222.8056640625,
              147.99981689453125
          ],
          "mode": 0,
          "size": [
              270,
              266
          ],
          "type": "ImageResizeKJv2",
          "color": "#222",
          "flags": {
              "collapsed": true
          },
          "order": 125,
          "inputs": [
              {
                  "link": 559,
                  "name": "image",
                  "type": "IMAGE"
              },
              {
                  "link": 1668,
                  "name": "width",
                  "type": "INT",
                  "widget": {
                      "name": "width"
                  }
              },
              {
                  "link": 1669,
                  "name": "height",
                  "type": "INT",
                  "widget": {
                      "name": "height"
                  }
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      617,
                      621,
                      2713
                  ]
              },
              {
                  "name": "width",
                  "type": "INT",
                  "links": []
              },
              {
                  "name": "height",
                  "type": "INT",
                  "links": []
              }
          ],
          "properties": {
              "ver": "5dcda71011870278c35d92ff77a677ed2e538f2d",
              "cnr_id": "comfyui-kjnodes",
              "Node name for S&R": "ImageResizeKJv2"
          },
          "widgets_values": [
              512,
              512,
              "lanczos",
              "pad",
              "255,255,255",
              "center",
              16,
              "cpu"
          ]
      },
      {
          "id": 963,
          "pos": [
              -4153.1181640625,
              2436.905517578125
          ],
          "mode": 0,
          "size": [
              285.287109375,
              358
          ],
          "type": "ReActorFaceSwap",
          "color": "#232",
          "flags": {},
          "order": 207,
          "inputs": [
              {
                  "link": 2539,
                  "name": "input_image",
                  "type": "IMAGE"
              },
              {
                  "link": 2705,
                  "name": "source_image",
                  "type": "IMAGE",
                  "shape": 7
              },
              {
                  "link": null,
                  "name": "face_model",
                  "type": "FACE_MODEL",
                  "shape": 7
              },
              {
                  "link": 2408,
                  "name": "face_boost",
                  "type": "FACE_BOOST",
                  "shape": 7
              }
          ],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "SWAPPED_IMAGE",
                  "type": "IMAGE",
                  "links": [
                      2395
                  ]
              },
              {
                  "name": "FACE_MODEL",
                  "type": "FACE_MODEL",
                  "links": null
              },
              {
                  "name": "ORIGINAL_IMAGE",
                  "type": "IMAGE",
                  "links": null
              }
          ],
          "properties": {
              "ver": "48a3ad27f99f775dcf63e61276e0110d256597ef",
              "cnr_id": "comfyui-reactor",
              "Node name for S&R": "ReActorFaceSwap"
          },
          "widgets_values": [
              true,
              "inswapper_128.onnx",
              "retinaface_resnet50",
              "codeformer-v0.1.0.pth",
              1,
              0.6000000000000001,
              "no",
              "no",
              "1",
              "0",
              1
          ]
      },
      {
          "id": 663,
          "pos": [
              -6349.91064453125,
              3281.140625
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#322",
          "flags": {},
          "order": 146,
          "inputs": [
              {
                  "link": 1502,
                  "name": "",
                  "type": "*"
              }
          ],
          "bgcolor": "#533",
          "outputs": [
              {
                  "name": "",
                  "type": "IMAGE",
                  "links": [
                      2693
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 664,
          "pos": [
              -6349.22119140625,
              3323.6923828125
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#322",
          "flags": {},
          "order": 142,
          "inputs": [
              {
                  "link": 1503,
                  "name": "",
                  "type": "*"
              }
          ],
          "bgcolor": "#533",
          "outputs": [
              {
                  "name": "",
                  "type": "IMAGE",
                  "links": [
                      2694
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 336,
          "pos": [
              -9162.634765625,
              1225.6405029296875
          ],
          "mode": 0,
          "size": [
              270,
              266
          ],
          "type": "ImageResizeKJv2",
          "color": "#222",
          "flags": {
              "collapsed": true
          },
          "order": 124,
          "inputs": [
              {
                  "link": 615,
                  "name": "image",
                  "type": "IMAGE"
              },
              {
                  "link": 1670,
                  "name": "width",
                  "type": "INT",
                  "widget": {
                      "name": "width"
                  }
              },
              {
                  "link": 1671,
                  "name": "height",
                  "type": "INT",
                  "widget": {
                      "name": "height"
                  }
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "IMAGE",
                  "type": "IMAGE",
                  "links": [
                      618,
                      622,
                      2714
                  ]
              },
              {
                  "name": "width",
                  "type": "INT",
                  "links": []
              },
              {
                  "name": "height",
                  "type": "INT",
                  "links": []
              }
          ],
          "properties": {
              "ver": "5dcda71011870278c35d92ff77a677ed2e538f2d",
              "cnr_id": "comfyui-kjnodes",
              "Node name for S&R": "ImageResizeKJv2"
          },
          "widgets_values": [
              512,
              512,
              "lanczos",
              "pad",
              "255,255,255",
              "center",
              16,
              "cpu"
          ]
      },
      {
          "id": 683,
          "pos": [
              -6213.77392578125,
              2142.906494140625
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#223",
          "flags": {},
          "order": 131,
          "inputs": [
              {
                  "link": 2713,
                  "name": "",
                  "type": "*"
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "",
                  "type": "IMAGE",
                  "links": [
                      1518,
                      2716,
                      2717
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 684,
          "pos": [
              -6209.87109375,
              2187.679443359375
          ],
          "mode": 0,
          "size": [
              75,
              26
          ],
          "type": "Reroute",
          "color": "#223",
          "flags": {},
          "order": 128,
          "inputs": [
              {
                  "link": 2714,
                  "name": "",
                  "type": "*"
              }
          ],
          "bgcolor": "#335",
          "outputs": [
              {
                  "name": "",
                  "type": "IMAGE",
                  "links": [
                      1519,
                      2715,
                      2718
                  ]
              }
          ],
          "properties": {
              "horizontal": false,
              "showOutputText": false
          }
      },
      {
          "id": 982,
          "pos": [
              -10399.4189453125,
              2622.401611328125
          ],
          "mode": 0,
          "size": [
              270,
              142
          ],
          "type": "ImageBatchMulti",
          "color": "#222",
          "flags": {
              "collapsed": false
          },
          "order": 134,
          "inputs": [
              {
                  "link": 2482,
                  "name": "image_1",
                  "type": "IMAGE"
              },
              {
                  "link": 2717,
                  "name": "image_2",
                  "type": "IMAGE"
              },
              {
                  "link": 2718,
                  "name": "image_3",
                  "type": "IMAGE"
              },
              {
                  "link": 2487,
                  "name": "image_4",
                  "type": "IMAGE"
              }
          ],
          "bgcolor": "#000",
          "outputs": [
              {
                  "name": "images",
                  "type": "IMAGE",
                  "links": [
                      2488
                  ]
              }
          ],
          "properties": {
              "ver": "44565e9bffc89de454d06b4abe08137d1247652a",
              "cnr_id": "comfyui-kjnodes"
          },
          "widgets_values": [
              4,
              null
          ]
      },
      {
          "id": 572,
          "pos": [
              -5632.50390625,
              2305.695068359375
          ],
          "mode": 0,
          "size": [
              269.1610107421875,
              263.4264831542969
          ],
          "type": "ShowText|pysssss",
          "color": "#233",
          "flags": {},
          "order": 200,
          "inputs": [
              {
                  "link": 1160,
                  "name": "text",
                  "type": "STRING"
              }
          ],
          "bgcolor": "#355",
          "outputs": [
              {
                  "name": "STRING",
                  "type": "STRING",
                  "links": null,
                  "shape": 6
              }
          ],
          "properties": {
              "ver": "1.2.5",
              "cnr_id": "comfyui-custom-scripts",
              "Node name for S&R": "ShowText|pysssss"
          },
          "widgets_values": [
              "https://v3.fal.media/files/tiger/GKBvARLgcQXE8NbsvCO2w_output.mp4"
          ]
      },
      {
          "id": 957,
          "pos": [
              -4464.35205078125,
              3568.72265625
          ],
          "mode": 0,
          "size": [
              285.287109375,
              358
          ],
          "type": "ReActorFaceSwap",
          "color": "#232",
          "flags": {},
          "order": 212,
          "inputs": [
              {
                  "link": 2400,
                  "name": "input_image",
                  "type": "IMAGE"
              },
              {
                  "link": 2709,
                  "name": "source_image",
                  "type": "IMAGE",
                  "shape": 7
              },
              {
                  "link": null,
                  "name": "face_model",
                  "type": "FACE_MODEL",
                  "shape": 7
              },
              {
                  "link": 2401,
                  "name": "face_boost",
                  "type": "FACE_BOOST",
                  "shape": 7
              }
          ],
          "bgcolor": "#353",
          "outputs": [
              {
                  "name": "SWAPPED_IMAGE",
                  "type": "IMAGE",
                  "links": [
                      2394
                  ]
              },
              {
                  "name": "FACE_MODEL",
                  "type": "FACE_MODEL",
                  "links": null
              },
              {
                  "name": "ORIGINAL_IMAGE",
                  "type": "IMAGE",
                  "links": null
              }
          ],
          "properties": {
              "ver": "48a3ad27f99f775dcf63e61276e0110d256597ef",
              "cnr_id": "comfyui-reactor",
              "Node name for S&R": "ReActorFaceSwap"
          },
          "widgets_values": [
              true,
              "inswapper_128.onnx",
              "retinaface_resnet50",
              "codeformer-v0.1.0.pth",
              1,
              0.6000000000000001,
              "no",
              "no",
              "0",
              "0",
              1
          ]
      }
  ],
  "config": {},
  "groups": [
      {
          "id": 6,
          "color": "#444",
          "flags": {},
          "title": "REFERENCE_IMAGE_ACTRESS",
          "bounding": [
              -9972.9716796875,
              -425.2791748046875,
              705.7135620117188,
              986.3313598632812
          ],
          "font_size": 24
      },
      {
          "id": 13,
          "color": "#444",
          "flags": {},
          "title": "ACTION_PROMPT",
          "bounding": [
              -8766.099609375,
              1749.165283203125,
              489.6957702636719,
              1025.4183349609375
          ],
          "font_size": 24
      },
      {
          "id": 15,
          "color": "#444",
          "flags": {},
          "title": "FAL_CAST_ACTRESS_KONTEXT",
          "bounding": [
              -9253.369140625,
              -423.04632568359375,
              442.0330810546875,
              911.4879150390625
          ],
          "font_size": 24
      },
      {
          "id": 17,
          "color": "#444",
          "flags": {},
          "title": "REFERENCE_IMAGE_ACTOR",
          "bounding": [
              -9968.41796875,
              642.7122802734375,
              705.7135620117188,
              986.3313598632812
          ],
          "font_size": 24
      },
      {
          "id": 18,
          "color": "#444",
          "flags": {},
          "title": "RESTYLE_PROMPT_ACTRESS",
          "bounding": [
              -10446.12109375,
              -412.9288024902344,
              460.576171875,
              859.2774658203125
          ],
          "font_size": 24
      },
      {
          "id": 19,
          "color": "#444",
          "flags": {},
          "title": "REFERENCE_IMAGE_COUPLE_ACTION_PROMPT",
          "bounding": [
              -9959.4521484375,
              1700.97265625,
              699.03271484375,
              523.0416870117188
          ],
          "font_size": 24
      },
      {
          "id": 20,
          "color": "#444",
          "flags": {},
          "title": "RESTYLE_PROMPT_ACTOR",
          "bounding": [
              -10441.384765625,
              637.8160400390625,
              460.576171875,
              859.2777099609375
          ],
          "font_size": 24
      },
      {
          "id": 21,
          "color": "#444",
          "flags": {},
          "title": "FAL_CAST_ACTOR_KONTEXT",
          "bounding": [
              -9252.67578125,
              646.2335815429688,
              443.9440612792969,
              914.297607421875
          ],
          "font_size": 24
      },
      {
          "id": 22,
          "color": "#8A8",
          "flags": {},
          "title": "FEMALE_CHARACTER_FACESWAP",
          "bounding": [
              -11567.888671875,
              2879.7734375,
              1446.446044921875,
              792.5084228515625
          ],
          "font_size": 24
      },
      {
          "id": 23,
          "color": "#8A8",
          "flags": {},
          "title": "MALE_CHARACTER_FACESWAP",
          "bounding": [
              -11566.404296875,
              3684.182373046875,
              1446.446044921875,
              792.5084228515625
          ],
          "font_size": 24
      },
      {
          "id": 29,
          "color": "#444",
          "flags": {},
          "title": "FAL_SCENE_KONTEXT",
          "bounding": [
              -9248.44140625,
              1703.5062255859375,
              420,
              953.5753173828125
          ],
          "font_size": 24
      },
      {
          "id": 30,
          "color": "#444",
          "flags": {},
          "title": "RESTYLE_COUPLE_PROMPT",
          "bounding": [
              -10442.2666015625,
              1711.232177734375,
              460.576171875,
              859.276611328125
          ],
          "font_size": 24
      },
      {
          "id": 31,
          "color": "#444",
          "flags": {},
          "title": "BG_IMAGE_ACTION_PROMPT",
          "bounding": [
              -9961.5224609375,
              2233.978271484375,
              699.03271484375,
              523.0416870117188
          ],
          "font_size": 24
      },
      {
          "id": 32,
          "color": "#8A8",
          "flags": {},
          "title": "COUPLE_FEMALE_CHARACTER_FACESWAP",
          "bounding": [
              -10101.419921875,
              2876.14794921875,
              1446.446044921875,
              792.5084228515625
          ],
          "font_size": 24
      },
      {
          "id": 33,
          "color": "#8A8",
          "flags": {},
          "title": "COUPLE_MALE_CHARACTER_FACESWAP",
          "bounding": [
              -10103.0712890625,
              3685.992919921875,
              1446.446044921875,
              792.5084228515625
          ],
          "font_size": 24
      },
      {
          "id": 41,
          "color": "#88A",
          "flags": {},
          "title": "PRELOAD_RESULT_FOR_STEP_RUNS",
          "bounding": [
              -7782.3837890625,
              810.6787719726562,
              934.8012084960938,
              817.842529296875
          ],
          "font_size": 24
      },
      {
          "id": 42,
          "color": "#8AA",
          "flags": {},
          "title": "FAL_KLING",
          "bounding": [
              -6051.4765625,
              1898.8577880859375,
              1191.5712890625,
              672.9617919921875
          ],
          "font_size": 24
      },
      {
          "id": 43,
          "color": "#88A",
          "flags": {},
          "title": "CONTROL",
          "bounding": [
              -8237.8017578125,
              814.172119140625,
              384.0500793457031,
              1443.59423828125
          ],
          "font_size": 24
      },
      {
          "id": 44,
          "color": "#88A",
          "flags": {},
          "title": "IMG",
          "bounding": [
              -6367.69287109375,
              2747.823486328125,
              106.06591796875,
              162.61587524414062
          ],
          "font_size": 24
      },
      {
          "id": 45,
          "color": "#88A",
          "flags": {},
          "title": "FRAMES",
          "bounding": [
              -6212.08154296875,
              2249.11962890625,
              95,
              79.5999984741211
          ],
          "font_size": 24
      },
      {
          "id": 46,
          "color": "#88A",
          "flags": {},
          "title": "SIZE",
          "bounding": [
              -6366.67529296875,
              2587.111572265625,
              99.70211791992188,
              125.5982894897461
          ],
          "font_size": 24
      },
      {
          "id": 47,
          "color": "#88A",
          "flags": {},
          "title": "SEED",
          "bounding": [
              -6369.21044921875,
              2462.6826171875,
              95,
              79.5999984741211
          ],
          "font_size": 24
      },
      {
          "id": 49,
          "color": "#444",
          "flags": {},
          "title": "SIZE_CONTR~OL",
          "bounding": [
              -6697.63134765625,
              1914.779296875,
              239.81097412109375,
              531.699951171875
          ],
          "font_size": 24
      },
      {
          "id": 54,
          "color": "#88A",
          "flags": {},
          "title": "CN",
          "bounding": [
              -6371.22900390625,
              2235.69580078125,
              95,
              79.5999984741211
          ],
          "font_size": 24
      },
      {
          "id": 56,
          "color": "#A88",
          "flags": {},
          "title": "IMG_RUN",
          "bounding": [
              -6358.74658203125,
              3188.80126953125,
              96.7291259765625,
              170.65237426757812
          ],
          "font_size": 24
      },
      {
          "id": 58,
          "color": "#88A",
          "flags": {},
          "title": "Source",
          "bounding": [
              -6261.81298828125,
              2378.001953125,
              140,
              184.06802368164062
          ],
          "font_size": 24
      },
      {
          "id": 59,
          "color": "#88A",
          "flags": {},
          "title": "INPUT",
          "bounding": [
              -6215.67333984375,
              2107.281982421875,
              96.379638671875,
              116.6786117553711
          ],
          "font_size": 24
      },
      {
          "id": 62,
          "color": "#88A",
          "flags": {},
          "title": "LOAD_VIDEO",
          "bounding": [
              -7806.92041015625,
              1816.0048828125,
              272.056640625,
              820.1451416015625
          ],
          "font_size": 24
      },
      {
          "id": 63,
          "color": "#88A",
          "flags": {},
          "title": "LOAD_DEPTH",
          "bounding": [
              -7490.439453125,
              1841.0308837890625,
              272.056640625,
              820.1451416015625
          ],
          "font_size": 24
      },
      {
          "id": 64,
          "color": "#88A",
          "flags": {},
          "title": "LOAD_OPEN_POSE",
          "bounding": [
              -7180.91162109375,
              1839.3988037109375,
              272.056640625,
              820.1451416015625
          ],
          "font_size": 24
      },
      {
          "id": 65,
          "color": "#88A",
          "flags": {},
          "title": "SIZE",
          "bounding": [
              -6361.46630859375,
              2083.742919921875,
              99.70211791992188,
              125.5982894897461
          ],
          "font_size": 24
      },
      {
          "id": 66,
          "color": "#444",
          "flags": {},
          "title": "EXTERNAL_NODES",
          "bounding": [
              -6712.625,
              298.50201416015625,
              1398.8707275390625,
              1507.7548828125
          ],
          "font_size": 24
      },
      {
          "id": 67,
          "color": "#444",
          "flags": {},
          "title": "BATCH_IMAGES_REFs",
          "bounding": [
              -7485.2001953125,
              3345.858642578125,
              314.30035400390625,
              443.7935485839844
          ],
          "font_size": 24
      },
      {
          "id": 68,
          "color": "#444",
          "flags": {},
          "title": "STITCH_IMAGES_REF",
          "bounding": [
              -7795.08837890625,
              2718.9326171875,
              644.8408203125,
              580.6689453125
          ],
          "font_size": 24
      },
      {
          "id": 69,
          "color": "#444",
          "flags": {},
          "title": "STITCH_IMAGES_FOR_SHOWCASE",
          "bounding": [
              -8578.3203125,
              3338.04736328125,
              1046.298095703125,
              1552.3109130859375
          ],
          "font_size": 24
      },
      {
          "id": 71,
          "color": "#88A",
          "flags": {},
          "title": "REF_STITCH",
          "bounding": [
              -6368.7490234375,
              2349.308349609375,
              95,
              79.5999984741211
          ],
          "font_size": 24
      },
      {
          "id": 83,
          "color": "#444",
          "flags": {},
          "title": "COMPARE",
          "bounding": [
              -8747.546875,
              585.857421875,
              453.48175048828125,
              1140.9388427734375
          ],
          "font_size": 24
      },
      {
          "id": 84,
          "color": "#88A",
          "flags": {},
          "title": "COUPLE_RESULT",
          "bounding": [
              -7775.6279296875,
              844.4591674804688,
              297.892578125,
              757.12548828125
          ],
          "font_size": 24
      },
      {
          "id": 85,
          "color": "#88A",
          "flags": {},
          "title": "PRELOAD_CONTROL_VIDEOS",
          "bounding": [
              -7500.439453125,
              1795.798828125,
              601.58447265625,
              875.3772583007812
          ],
          "font_size": 24
      },
      {
          "id": 86,
          "color": "#88A",
          "flags": {},
          "title": "ACTRESS_IN_ROLE_RES",
          "bounding": [
              -7460.67236328125,
              847.3718872070312,
              294.080078125,
              759.50634765625
          ],
          "font_size": 24
      },
      {
          "id": 87,
          "color": "#88A",
          "flags": {},
          "title": "ACTOR_IN_ROLE_RES",
          "bounding": [
              -7147.76904296875,
              850.33154296875,
              296.8621826171875,
              755.508056640625
          ],
          "font_size": 24
      },
      {
          "id": 88,
          "color": "#88A",
          "flags": {},
          "title": "COUPLE",
          "bounding": [
              -6218.66015625,
              2586.435546875,
              95,
              79.5999984741211
          ],
          "font_size": 24
      },
      {
          "id": 89,
          "color": "#88A",
          "flags": {},
          "title": "CN_dp",
          "bounding": [
              -6213.76318359375,
              2710.88623046875,
              95,
              79.5999984741211
          ],
          "font_size": 24
      },
      {
          "id": 93,
          "color": "#88A",
          "flags": {},
          "title": "ROUTING",
          "bounding": [
              -6391.06591796875,
              2040.1429443359375,
              304.60699462890625,
              2125.29736328125
          ],
          "font_size": 24
      },
      {
          "id": 94,
          "color": "#8A8",
          "flags": {},
          "title": "FACESWAP",
          "bounding": [
              -11577.888671875,
              2832.5478515625,
              2932.914306640625,
              1664.573974609375
          ],
          "font_size": 24
      },
      {
          "id": 95,
          "color": "#444",
          "flags": {},
          "title": "REMOVE_BG",
          "bounding": [
              -7118.12744140625,
              2724.8798828125,
              640.4229125976562,
              1382.80419921875
          ],
          "font_size": 24
      },
      {
          "id": 96,
          "color": "#444",
          "flags": {},
          "title": "ACTRESS",
          "bounding": [
              -10446.12109375,
              -468.8792724609375,
              1644.78515625,
              1039.9312744140625
          ],
          "font_size": 24
      },
      {
          "id": 97,
          "color": "#444",
          "flags": {},
          "title": "ACTOR",
          "bounding": [
              -10451.384765625,
              594.216064453125,
              1652.6533203125,
              1044.82763671875
          ],
          "font_size": 24
      },
      {
          "id": 98,
          "flags": {},
          "title": "Group",
          "bounding": [
              -8247.8017578125,
              767.0787963867188,
              1443.22265625,
              1914.09765625
          ],
          "font_size": 24
      },
      {
          "id": 104,
          "color": "#444",
          "flags": {},
          "title": "IMG_)Bridge",
          "bounding": [
              -6253.86181640625,
              3001.09228515625,
              106.06591796875,
              162.61587524414062
          ],
          "font_size": 24
      },
      {
          "id": 116,
          "color": "#8A8",
          "flags": {},
          "title": "COUPLE_FEMALE_CHARACTER_FACESWAP",
          "bounding": [
              -4811.37451171875,
              1943.6531982421875,
              1359.193603515625,
              1214.4267578125
          ],
          "font_size": 24
      },
      {
          "id": 117,
          "color": "#8A8",
          "flags": {},
          "title": "COUPLE_MALE_CHARACTER_FACESWAP",
          "bounding": [
              -4787.896484375,
              3174.07763671875,
              1255.6182861328125,
              1059.2557373046875
          ],
          "font_size": 24
      },
      {
          "id": 120,
          "color": "#8A8",
          "flags": {},
          "title": "Wrapper",
          "bounding": [
              -4467.20654296875,
              2012.037109375,
              95,
              79.5999984741211
          ],
          "font_size": 24
      },
      {
          "id": 121,
          "color": "#88A",
          "flags": {},
          "title": "c-w-m-v",
          "bounding": [
              -6345.86279296875,
              3413.92333984375,
              99.62890625,
              232.028076171875
          ],
          "font_size": 24
      },
      {
          "id": 122,
          "color": "#444",
          "flags": {},
          "title": "Prompt_bridge",
          "bounding": [
              -6230.93359375,
              3663.792236328125,
              99.62890625,
              232.02804565429688
          ],
          "font_size": 24
      },
      {
          "id": 123,
          "color": "#A88",
          "flags": {},
          "title": "Prompt_RUN",
          "bounding": [
              -6362.6962890625,
              3903.016845703125,
              99.62890625,
              232.02804565429688
          ],
          "font_size": 24
      },
      {
          "id": 124,
          "color": "#8A8",
          "flags": {},
          "title": "couple_stage1_run",
          "bounding": [
              -9742.2001953125,
              2968.4931640625,
              95,
              79.5999984741211
          ],
          "font_size": 24
      },
      {
          "id": 125,
          "color": "#8A8",
          "flags": {},
          "title": "Bridge",
          "bounding": [
              -9614.28125,
              3094.124755859375,
              95,
              79.5999984741211
          ],
          "font_size": 24
      },
      {
          "id": 126,
          "color": "#8A8",
          "flags": {},
          "title": "LOAD_SAVED_ST1",
          "bounding": [
              -10090.2333984375,
              2933.344970703125,
              294.080078125,
              397.6002502441406
          ],
          "font_size": 24
      },
      {
          "id": 130,
          "color": "#8A8",
          "flags": {},
          "title": "FACE_SWAP",
          "bounding": [
              -4821.37451171875,
              1900.0531005859375,
              1379.193603515625,
              2343.280029296875
          ],
          "font_size": 24
      },
      {
          "id": 127,
          "color": "#8A8",
          "flags": {},
          "title": "Bridge",
          "bounding": [
              -4302.7265625,
              2306.074462890625,
              95,
              79.5999984741211
          ],
          "font_size": 24
      },
      {
          "id": 129,
          "color": "#8A8",
          "flags": {},
          "title": "LOAD_VIDEO_FACESWAP",
          "bounding": [
              -4783.18359375,
              2035.478515625,
              272.056640625,
              538.6319580078125
          ],
          "font_size": 24
      },
      {
          "id": 137,
          "color": "#444",
          "flags": {},
          "title": "COUPLE",
          "bounding": [
              -10452.2666015625,
              1657.3726806640625,
              1633.8251953125,
              1128.8408203125
          ],
          "font_size": 24
      },
      {
          "id": 138,
          "color": "#8A8",
          "flags": {},
          "title": "LOAD_SAVED_ST1",
          "bounding": [
              -11545.4873046875,
              2947.785400390625,
              294.080078125,
              397.6002502441406
          ],
          "font_size": 24
      },
      {
          "id": 139,
          "color": "#8A8",
          "flags": {},
          "title": "LOAD_SAVED_ST1",
          "bounding": [
              -11541.767578125,
              3730.72802734375,
              294.080078125,
              397.6002502441406
          ],
          "font_size": 24
      },
      {
          "id": 140,
          "color": "#b58b2a",
          "flags": {},
          "title": "COMFY_KLING",
          "bounding": [
              -6057.15478515625,
              2599.42236328125,
              1200.732666015625,
              550.0988159179688
          ],
          "font_size": 24
      },
      {
          "id": 141,
          "color": "#88A",
          "flags": {},
          "title": "Source",
          "bounding": [
              -6231.49755859375,
              2841.660400390625,
              96.379638671875,
              116.6786117553711
          ],
          "font_size": 24
      }
  ],
  "version": 0.4,
  "revision": 0,
  "last_link_id": 2718,
  "last_node_id": 1074,
  "workflow_api": {
      "169": {
          "_meta": {
              "title": "Load Image: Reference"
          },
          "inputs": {
              "image": "c439c0a6-95c2-4cd4-a51e-25aa8608cee9.jpeg"
          },
          "class_type": "LoadImage"
      },
      "229": {
          "_meta": {
              "title": "Resize Image v2"
          },
          "inputs": {
              "image": [
                  "169",
                  0
              ],
              "width": [
                  "361",
                  0
              ],
              "device": "cpu",
              "height": [
                  "360",
                  0
              ],
              "pad_color": "172,172,172",
              "divisible_by": 16,
              "crop_position": "center",
              "upscale_method": "lanczos",
              "keep_proportion": "crop"
          },
          "class_type": "ImageResizeKJv2"
      },
      "230": {
          "_meta": {
              "title": "Resize Image v2"
          },
          "inputs": {
              "image": [
                  "299",
                  0
              ],
              "width": [
                  "361",
                  0
              ],
              "device": "cpu",
              "height": [
                  "360",
                  0
              ],
              "pad_color": "255,255,255",
              "divisible_by": 16,
              "crop_position": "center",
              "upscale_method": "lanczos",
              "keep_proportion": "pad"
          },
          "class_type": "ImageResizeKJv2"
      },
      "279": {
          "_meta": {
              "title": "Save Image"
          },
          "inputs": {
              "images": [
                  "230",
                  0
              ],
              "filename_prefix": "FEMALE_CHARACTER"
          },
          "class_type": "SaveImage"
      },
      "288": {
          "_meta": {
              "title": "Batch Images"
          },
          "inputs": {
              "image1": [
                  "297",
                  0
              ],
              "image2": [
                  "229",
                  0
              ]
          },
          "class_type": "ImageBatch"
      },
      "289": {
          "_meta": {
              "title": "Load Image"
          },
          "inputs": {
              "image": "27867cf9-6d0b-4031-ab61-768b6ed2f814.jpeg"
          },
          "class_type": "LoadImage"
      },
      "290": {
          "_meta": {
              "title": "Generate Text Stream (LLMToolkit)"
          },
          "inputs": {
              "prompt": "Write a detailed description of a futuristic city.",
              "context": [
                  "292",
                  0
              ],
              "llm_model": "gpt-4o-mini",
              "LLMToolkitTextGeneratorStream_response": "Armored male operative swiftly raises weapon, red-haired female agent reacts smirking confidently, desert terrain stretches beneath cloudy horizon, camera arcs around duo dynamically, warm-toned lighting, stark shadows accentuate tension, Shot on Blackmagic URSA Mini Pro, vibrant tokusatsu aesthetics."
          },
          "class_type": "LLMToolkitTextGeneratorStream"
      },
      "292": {
          "_meta": {
              "title": "Prompt Manager (LLMToolkit)"
          },
          "inputs": {
              "url": "",
              "image": [
                  "888",
                  0
              ],
              "video": [
                  "559",
                  0
              ],
              "context": [
                  "309",
                  0
              ],
              "file_path": "",
              "audio_path": "",
              "text_prompt": "You're a cinematographer creating 50-word text-to-video prompts. Extract action from video, apply to image characters. Structure: Male character's action (5 words), female's reaction (5 words), environment details, camera movement, lighting, tokusatsu aesthetic. \n\nOpening Action: Begin immediately with the primary movement or camera motion in one direct sentence - no preamble.\nCharacter Dynamics: Detail specific gestures, facial micro-expressions, and body language shifts based on visual cues like hand positioning, gaze direction, and posture tension.\nPhysical Environment: Describe immediate surroundings, textures, lighting quality, and atmospheric elements that frame the action.\nCamera Behavior: Specify lens movement, framing changes, focus pulls, and perspective shifts that enhance the visual narrative.\nVisual Aesthetics: Include details about color temperature, shadow play, depth of field, and compositional elements.\nTechnical Signature: Conclude with the artstyle aesthetics of the shot and some techical information that reference the cinematographic style reference like \"Shot on RED Dragon 6K with vintage Cooke lenses\" or \"Captured in the visual language of contemporary arthouse cinema.\" \n\nBe brief we need to convey as much as possible in an small phrase no word salads please maximun 50 words or less chose a maximun of one word each things per category the only category that needs more is the action and character dynamics. up to 5 words each\n\nYou have been provided with an image and a video extract the action of the video and ignore the all other aspects of the video besides the movement and action of the characters.\n\nUse the characters and background from the image to construct the prompt that contains the transfered action performed in the video into the image characters, make a brief description of the characters outfit make the action take place on the location environment provided on image Alsways start the prompt with the male character first.\n\nExample: \"Silver-armored warrior with glowing chest emblem launches spinning heel kick, long-haired schoolgirl in navy blazer dodges rolling sideways clutching leather briefcase, debris scatters across rain-slicked industrial rooftop, camera dollies circling combatants, neon signage reflects in puddles, sparks fly from impact, Shot on Arri Alexa Mini, gritty tokusatsu cinematography.\"  Focus on movement transfer, ignore other video aspects."
          },
          "class_type": "PromptManager"
      },
      "293": {
          "_meta": {
              "title": "Display Text (LLMToolkit)"
          },
          "inputs": {
              "select": "0",
              "context": [
                  "290",
                  0
              ],
              "Display_Text_1": "Armored male operative swiftly raises weapon, red-haired female agent reacts smirking confidently, desert terrain stretches beneath cloudy horizon, camera arcs around duo dynamically, warm-toned lighting, stark shadows accentuate tension, Shot on Blackmagic URSA Mini Pro, vibrant tokusatsu aesthetics."
          },
          "class_type": "Display_Text"
      },
      "297": {
          "_meta": {
              "title": "Resize Image v2"
          },
          "inputs": {
              "image": [
                  "289",
                  0
              ],
              "width": [
                  "361",
                  0
              ],
              "device": "cpu",
              "height": [
                  "360",
                  0
              ],
              "pad_color": "255,255,255",
              "divisible_by": 16,
              "crop_position": "center",
              "upscale_method": "lanczos",
              "keep_proportion": "pad"
          },
          "class_type": "ImageResizeKJv2"
      },
      "299": {
          "_meta": {
              "title": "🔧 Image Remove Alpha"
          },
          "inputs": {
              "image": [
                  "437",
                  0
              ]
          },
          "class_type": "ImageRemoveAlpha+"
      },
      "302": {
          "_meta": {
              "title": "External Text (ComfyUI Deploy)"
          },
          "inputs": {
              "input_id": "llm_model",
              "description": "03-mini, \ngpt-4.5-preview-2025-02-27,",
              "display_name": "",
              "default_value": "gpt-4.5-preview-2025-02-27"
          },
          "class_type": "ComfyUIDeployExternalText"
      },
      "308": {
          "_meta": {
              "title": "Image Comparer (rgthree)"
          },
          "inputs": {
              "image_a": [
                  "297",
                  0
              ],
              "image_b": [
                  "230",
                  0
              ],
              "rgthree_comparer": {
                  "images": [
                      {
                          "url": "/api/view?filename=rgthree.compare._temp_dpozp_00007_.png&type=temp&subfolder=&rand=0.7708395825483642",
                          "name": "A",
                          "selected": true
                      },
                      {
                          "url": "/api/view?filename=rgthree.compare._temp_dpozp_00008_.png&type=temp&subfolder=&rand=0.3152664251784044",
                          "name": "B",
                          "selected": true
                      }
                  ]
              }
          },
          "class_type": "Image Comparer (rgthree)"
      },
      "309": {
          "_meta": {
              "title": "OpenAI Provider (LLMToolkit)"
          },
          "inputs": {
              "llm_model": [
                  "302",
                  0
              ]
          },
          "class_type": "OpenAIProviderNode"
      },
      "310": {
          "_meta": {
              "title": "Resize Image v2"
          },
          "inputs": {
              "image": [
                  "313",
                  0
              ],
              "width": [
                  "361",
                  0
              ],
              "device": "cpu",
              "height": [
                  "360",
                  0
              ],
              "pad_color": "255,255,255",
              "divisible_by": 16,
              "crop_position": "center",
              "upscale_method": "lanczos",
              "keep_proportion": "pad"
          },
          "class_type": "ImageResizeKJv2"
      },
      "311": {
          "_meta": {
              "title": "Batch Images"
          },
          "inputs": {
              "image1": [
                  "310",
                  0
              ],
              "image2": [
                  "312",
                  0
              ]
          },
          "class_type": "ImageBatch"
      },
      "312": {
          "_meta": {
              "title": "Resize Image v2"
          },
          "inputs": {
              "image": [
                  "314",
                  0
              ],
              "width": [
                  "361",
                  0
              ],
              "device": "cpu",
              "height": [
                  "360",
                  0
              ],
              "pad_color": "172,172,172",
              "divisible_by": 16,
              "crop_position": "center",
              "upscale_method": "lanczos",
              "keep_proportion": "crop"
          },
          "class_type": "ImageResizeKJv2"
      },
      "313": {
          "_meta": {
              "title": "Load Image"
          },
          "inputs": {
              "image": "fa792779-77a8-4b39-86eb-0f18a0930d71.jpeg"
          },
          "class_type": "LoadImage"
      },
      "314": {
          "_meta": {
              "title": "Load Image: Reference"
          },
          "inputs": {
              "image": "415bfd32-0414-4f7c-b261-8b9167f5430f.jpeg"
          },
          "class_type": "LoadImage"
      },
      "317": {
          "_meta": {
              "title": "Resize Image v2"
          },
          "inputs": {
              "image": [
                  "319",
                  0
              ],
              "width": [
                  "361",
                  0
              ],
              "device": "cpu",
              "height": [
                  "360",
                  0
              ],
              "pad_color": "172,172,172",
              "divisible_by": 16,
              "crop_position": "center",
              "upscale_method": "lanczos",
              "keep_proportion": "crop"
          },
          "class_type": "ImageResizeKJv2"
      },
      "319": {
          "_meta": {
              "title": "Load Image: Reference"
          },
          "inputs": {
              "image": "50b3528e-acca-416a-b599-d170e8858aa3.jpeg"
          },
          "class_type": "LoadImage"
      },
      "327": {
          "_meta": {
              "title": "Image Comparer (rgthree)"
          },
          "inputs": {
              "image_a": [
                  "310",
                  0
              ],
              "image_b": [
                  "336",
                  0
              ],
              "rgthree_comparer": {
                  "images": [
                      {
                          "url": "/api/view?filename=rgthree.compare._temp_oacct_00007_.png&type=temp&subfolder=&rand=0.9711930179294311",
                          "name": "A",
                          "selected": true
                      },
                      {
                          "url": "/api/view?filename=rgthree.compare._temp_oacct_00008_.png&type=temp&subfolder=&rand=0.7209030323496606",
                          "name": "B",
                          "selected": true
                      }
                  ]
              }
          },
          "class_type": "Image Comparer (rgthree)"
      },
      "334": {
          "_meta": {
              "title": "🔧 Image Remove Alpha"
          },
          "inputs": {
              "image": [
                  "436",
                  0
              ]
          },
          "class_type": "ImageRemoveAlpha+"
      },
      "335": {
          "_meta": {
              "title": "Save Image"
          },
          "inputs": {
              "images": [
                  "336",
                  0
              ],
              "filename_prefix": "MALE_CHARACTER"
          },
          "class_type": "SaveImage"
      },
      "336": {
          "_meta": {
              "title": "Resize Image v2"
          },
          "inputs": {
              "image": [
                  "334",
                  0
              ],
              "width": [
                  "361",
                  0
              ],
              "device": "cpu",
              "height": [
                  "360",
                  0
              ],
              "pad_color": "255,255,255",
              "divisible_by": 16,
              "crop_position": "center",
              "upscale_method": "lanczos",
              "keep_proportion": "pad"
          },
          "class_type": "ImageResizeKJv2"
      },
      "341": {
          "_meta": {
              "title": "External Number Int (ComfyUI Deploy)"
          },
          "inputs": {
              "input_id": "FRAMES",
              "description": "",
              "display_name": "",
              "default_value": 81
          },
          "class_type": "ComfyUIDeployExternalNumberInt"
      },
      "345": {
          "_meta": {
              "title": "ReActor 🌌 Fast Face Swap"
          },
          "inputs": {
              "enabled": true,
              "face_boost": [
                  "347",
                  0
              ],
              "swap_model": "inswapper_128.onnx",
              "input_image": [
                  "230",
                  0
              ],
              "source_image": [
                  "865",
                  0
              ],
              "facedetection": "retinaface_resnet50",
              "codeformer_weight": 0.6000000000000001,
              "console_log_level": 1,
              "input_faces_index": "0",
              "face_restore_model": "codeformer-v0.1.0.pth",
              "source_faces_index": "0",
              "detect_gender_input": "no",
              "detect_gender_source": "no",
              "face_restore_visibility": 1
          },
          "class_type": "ReActorFaceSwap"
      },
      "347": {
          "_meta": {
              "title": "ReActor 🌌 Face Booster"
          },
          "inputs": {
              "enabled": true,
              "visibility": 1,
              "boost_model": [
                  "660",
                  0
              ],
              "interpolation": "Bicubic",
              "codeformer_weight": 0.5,
              "restore_with_main_after": false
          },
          "class_type": "ReActorFaceBoost"
      },
      "349": {
          "_meta": {
              "title": "Save Image"
          },
          "inputs": {
              "images": [
                  "468",
                  0
              ],
              "filename_prefix": "FEMALE_CHARACTER_FACESWAP"
          },
          "class_type": "SaveImage"
      },
      "350": {
          "_meta": {
              "title": "Image Comparer (rgthree)"
          },
          "inputs": {
              "image_a": [
                  "230",
                  0
              ],
              "image_b": [
                  "468",
                  0
              ],
              "rgthree_comparer": {
                  "images": [
                      {
                          "url": "/api/view?filename=rgthree.compare._temp_ymbcd_00007_.png&type=temp&subfolder=&rand=0.6793163083622482",
                          "name": "A",
                          "selected": true
                      },
                      {
                          "url": "/api/view?filename=rgthree.compare._temp_ymbcd_00008_.png&type=temp&subfolder=&rand=0.6523167321804854",
                          "name": "B",
                          "selected": true
                      }
                  ]
              }
          },
          "class_type": "Image Comparer (rgthree)"
      },
      "352": {
          "_meta": {
              "title": "ReActor 🌌 Face Booster"
          },
          "inputs": {
              "enabled": true,
              "visibility": 1,
              "boost_model": [
                  "660",
                  0
              ],
              "interpolation": "Bicubic",
              "codeformer_weight": 0.5,
              "restore_with_main_after": false
          },
          "class_type": "ReActorFaceBoost"
      },
      "354": {
          "_meta": {
              "title": "ReActor 🌌 Fast Face Swap"
          },
          "inputs": {
              "enabled": true,
              "face_boost": [
                  "352",
                  0
              ],
              "swap_model": "inswapper_128.onnx",
              "input_image": [
                  "336",
                  0
              ],
              "source_image": [
                  "863",
                  0
              ],
              "facedetection": "retinaface_resnet50",
              "codeformer_weight": 0.6000000000000001,
              "console_log_level": 1,
              "input_faces_index": "0",
              "face_restore_model": "codeformer-v0.1.0.pth",
              "source_faces_index": "0",
              "detect_gender_input": "no",
              "detect_gender_source": "no",
              "face_restore_visibility": 1
          },
          "class_type": "ReActorFaceSwap"
      },
      "358": {
          "_meta": {
              "title": "Height"
          },
          "inputs": {
              "value": 768
          },
          "class_type": "INTConstant"
      },
      "359": {
          "_meta": {
              "title": "Width"
          },
          "inputs": {
              "value": 1280
          },
          "class_type": "INTConstant"
      },
      "360": {
          "_meta": {
              "title": "Height"
          },
          "inputs": {
              "value": 1280
          },
          "class_type": "INTConstant"
      },
      "361": {
          "_meta": {
              "title": "Width"
          },
          "inputs": {
              "value": 720
          },
          "class_type": "INTConstant"
      },
      "421": {
          "_meta": {
              "title": "External Text (ComfyUI Deploy)"
          },
          "inputs": {
              "input_id": "ACTRESS_MANUAL_PROMPT",
              "description": "",
              "display_name": "",
              "default_value": "Restyle the animated woman with long dark blue hair into a live-action tokusatsu Japanese TV show scene. Change the visual style to realistic, capturing facial characteristics like full lips, defined cheekbones, expressive eyes, and thick eyebrows matching the second image. Replace the hair color with a natural brunette shade, maintaining the same long hairstyle and expression. Preserve her original pose, red jacket and beret, and black dress costume exactly. Solid white Background she wears a bold silver cross pendant"
          },
          "class_type": "ComfyUIDeployExternalText"
      },
      "422": {
          "_meta": {
              "title": "External Text (ComfyUI Deploy)"
          },
          "inputs": {
              "input_id": "ACTOR_MANUAL_PROMPT",
              "description": "",
              "display_name": "",
              "default_value": "Restyle the character into a realistic live-action tokusatsu Japanese TV show scene, accurately depicting a youthful man with a defined jawline, smooth skin, and expressive dark eyes. Maintain his original hairstyle, with dark, slightly messy hair falling naturally around his face. Change clothing to a real, well-fitted blue shirt and dark pants with a red tie, keeping the same stance, confident posture, and neutral, cool expression unchanged. Solid white Background"
          },
          "class_type": "ComfyUIDeployExternalText"
      },
      "436": {
          "_meta": {
              "title": "Flux Pro Kontext Multi (fal)"
          },
          "inputs": {
              "seed": [
                  "1059",
                  0
              ],
              "prompt": [
                  "1055",
                  4
              ],
              "image_1": [
                  "310",
                  0
              ],
              "image_2": [
                  "312",
                  0
              ],
              "sync_mode": false,
              "num_images": 1,
              "max_quality": true,
              "aspect_ratio": [
                  "1072",
                  0
              ],
              "output_format": "png",
              "guidance_scale": 3.5,
              "safety_tolerance": "6"
          },
          "class_type": "FluxProKontextMulti_fal"
      },
      "437": {
          "_meta": {
              "title": "Flux Pro Kontext Multi (fal)"
          },
          "inputs": {
              "seed": [
                  "1059",
                  0
              ],
              "prompt": [
                  "1052",
                  4
              ],
              "image_1": [
                  "297",
                  0
              ],
              "image_2": [
                  "229",
                  0
              ],
              "sync_mode": false,
              "num_images": 1,
              "max_quality": true,
              "aspect_ratio": [
                  "1072",
                  0
              ],
              "output_format": "png",
              "guidance_scale": 3.5,
              "safety_tolerance": "6"
          },
          "class_type": "FluxProKontextMulti_fal"
      },
      "443": {
          "_meta": {
              "title": "External Text (ComfyUI Deploy)"
          },
          "inputs": {
              "input_id": "COUPLE_MANUAL_PROMPT",
              "description": "",
              "display_name": "",
              "default_value": "Change the characters in the first image to match the provided live-action actors, placing the woman in the exact same pose as the original female character, while preserving her facial features and expression. Replace the male character, maintaining his exact hairstyle, facial features, and pose. Change the background, keeping the composition and framing intact."
          },
          "class_type": "ComfyUIDeployExternalText"
      },
      "445": {
          "_meta": {
              "title": "🔧 Image Remove Alpha"
          },
          "inputs": {
              "image": [
                  "448",
                  0
              ]
          },
          "class_type": "ImageRemoveAlpha+"
      },
      "446": {
          "_meta": {
              "title": "Save Image"
          },
          "inputs": {
              "images": [
                  "447",
                  0
              ],
              "filename_prefix": "SCENE_COUPLE"
          },
          "class_type": "SaveImage"
      },
      "447": {
          "_meta": {
              "title": "Resize Image v2"
          },
          "inputs": {
              "image": [
                  "445",
                  0
              ],
              "width": [
                  "361",
                  0
              ],
              "device": "cpu",
              "height": [
                  "360",
                  0
              ],
              "pad_color": "255,255,255",
              "divisible_by": 16,
              "crop_position": "center",
              "upscale_method": "lanczos",
              "keep_proportion": "pad"
          },
          "class_type": "ImageResizeKJv2"
      },
      "448": {
          "_meta": {
              "title": "Flux Pro Kontext Multi (fal)"
          },
          "inputs": {
              "seed": [
                  "1059",
                  0
              ],
              "prompt": [
                  "455",
                  4
              ],
              "image_1": [
                  "317",
                  0
              ],
              "image_2": [
                  "468",
                  0
              ],
              "image_3": [
                  "469",
                  0
              ],
              "image_4": [
                  "474",
                  0
              ],
              "sync_mode": false,
              "num_images": 1,
              "max_quality": true,
              "aspect_ratio": [
                  "1072",
                  0
              ],
              "output_format": "png",
              "guidance_scale": 3.2,
              "safety_tolerance": "5"
          },
          "class_type": "FluxProKontextMulti_fal"
      },
      "452": {
          "_meta": {
              "title": "Generate Text Stream (LLMToolkit)"
          },
          "inputs": {
              "prompt": "Write a detailed description of a futuristic city.",
              "context": [
                  "453",
                  0
              ],
              "llm_model": "gpt-4o-mini",
              "LLMToolkitTextGeneratorStream_response": "Transform the characters into realistic, high-quality live-action cosplays, slightly stylizing their proportions to enhance their likeness. Depict the male character with defined facial features, a strong jawline, rugged stubble, and spiky brown hair secured by a dark bandana. Outfit him in tactical military gear, armored plates, and pouches, maintaining his confident aiming pose with a silenced pistol. For the woman, portray her with delicate facial features, expressive eyes, short vibrant red hair styled in waves, and fitted tank top with tactical gloves. Keep her poised, alert stance with a firearm. Set them against the sandy desert ruin environment, preserving the original dynamic composition."
          },
          "class_type": "LLMToolkitTextGeneratorStream"
      },
      "453": {
          "_meta": {
              "title": "Prompt Manager (LLMToolkit)"
          },
          "inputs": {
              "url": "",
              "image": [
                  "982",
                  0
              ],
              "context": [
                  "309",
                  0
              ],
              "file_path": "",
              "audio_path": "",
              "text_prompt": "You are a master artist crafting precise visual narratives for text-to-image generation. When given an image or visual description, create a flowing 70 word paragraph following this base on the TASK\n\n### 1. Basic Modifications\n- Simple and direct: `\"Change the car color to red\"`\n- Maintain style: `\"Change to daytime while maintaining the same style of the painting\"`\n\n### 2. Style Transfer\n**Principles:**\n- Clearly name style: `\"Transform to Bauhaus art style\"`\n- Describe characteristics: `\"Transform to oil painting with visible brushstrokes, thick paint texture\"`\n- Preserve composition: `\"Change to Bauhaus style while maintaining the original composition\"`\n\n### 3. Character Consistency\n**Framework:**\n- Specific description: `\"The woman with short black hair\"` instead of \"she\"\n- Preserve features: `\"while maintaining the same facial features, hairstyle, and expression\"`\n- Step-by-step modifications: Change background first, then actions\n\n### 4. Text Editing\n- Use quotes: `\"Replace 'joy' with 'BFL'\"`\n- Maintain format: `\"Replace text while maintaining the same font style\"`\n\n## Common Problem Solutions\n\n### Character Changes Too Much\n❌ Wrong: `\"Transform the person into a Viking\"`\n✅ Correct: `\"Change the clothes to be a viking warrior while preserving facial features\"`\n\n### Composition Position Changes\n❌ Wrong: `\"Put him on a beach\"`\n✅ Correct: `\"Change the background to a beach while keeping the person in the exact same position, scale, and pose\"`\n\n### Style Application Inaccuracy\n❌ Wrong: `\"Make it a sketch\"`\n✅ Correct: `\"Convert to pencil sketch with natural graphite lines, cross-hatching, and visible paper texture\"`\n\n## Core Principles\n\n1. **Be Specific and Clear** - Use precise descriptions, avoid vague terms\n2. **Step-by-step Editing** - Break complex modifications into multiple simple steps\n3. **Explicit Preservation** - State what should remain unchanged\n4. **Verb Selection** - Use \"change\", \"replace\" rather than \"transform\"\n\n## Best Practice Templates\n\n**Object Modification:**\n`\"Change [object] to [new state], keep [content to preserve] unchanged\"`\n\n**Style Transfer:**\n`\"Transform to [specific style], while maintaining [composition/character/other] unchanged\"`\n\n**Background Replacement:**\n`\"Change the background to [new background], keep the subject in the exact same position and pose\"`\n\n**Text Editing:**\n`\"Replace '[original text]' with '[new text]', maintain the same font style\"`\n\n> **Remember:** The more specific, the better. Kontext excels at understanding detailed instructions and maintaining consistency. \n\n**TASK:**\nTransform the first image to Transform the characters into a realistic, high-quality live-action cosplay portrayal featuring the provided Couple with SLIGTHLY stylized pushed proportions to improve the charcters likeness. Acurately describe the facial structure features and characteristics, haistyle, costume, accessories and props and poses of each character from the original picture in order to replace it with the matching gender portrait of the actor or actress provided. Keep the composition, poses and costumes of the characters. Transforming the image into the live action lifelike reepresentation of the characters and background environment. "
          },
          "class_type": "PromptManager"
      },
      "455": {
          "_meta": {
              "title": "Display Text (LLMToolkit)"
          },
          "inputs": {
              "select": "0",
              "context": [
                  "452",
                  0
              ],
              "Display_Text_0": "Transform the characters into realistic, high-quality live-action cosplays, slightly stylizing their proportions to enhance their likeness. Depict the male character with defined facial features, a strong jawline, rugged stubble, and spiky brown hair secured by a dark bandana. Outfit him in tactical military gear, armored plates, and pouches, maintaining his confident aiming pose with a silenced pistol. For the woman, portray her with delicate facial features, expressive eyes, short vibrant red hair styled in waves, and fitted tank top with tactical gloves. Keep her poised, alert stance with a firearm. Set them against the sandy desert ruin environment, preserving the original dynamic composition."
          },
          "class_type": "Display_Text"
      },
      "458": {
          "_meta": {
              "title": "颜色调整"
          },
          "inputs": {
              "image": [
                  "345",
                  0
              ],
              "preview": "",
              "contrast": 0.8817826157532459,
              "brightness": 1.139396845233569,
              "saturation": 0.9157544104446935
          },
          "class_type": "ColorAdjustment"
      },
      "468": {
          "_meta": {
              "title": "🅛🅣🅧 LTXV Film Grain"
          },
          "inputs": {
              "images": [
                  "458",
                  0
              ],
              "saturation": 0.5,
              "grain_intensity": 0.020000000000000004
          },
          "class_type": "LTXVFilmGrain"
      },
      "469": {
          "_meta": {
              "title": "🅛🅣🅧 LTXV Film Grain"
          },
          "inputs": {
              "images": [
                  "470",
                  0
              ],
              "saturation": 0.5,
              "grain_intensity": 0.020000000000000004
          },
          "class_type": "LTXVFilmGrain"
      },
      "470": {
          "_meta": {
              "title": "颜色调整"
          },
          "inputs": {
              "image": [
                  "354",
                  0
              ],
              "preview": "",
              "contrast": 0.8817826157532459,
              "brightness": 1.139396845233569,
              "saturation": 0.9157544104446935
          },
          "class_type": "ColorAdjustment"
      },
      "471": {
          "_meta": {
              "title": "Save Image"
          },
          "inputs": {
              "images": [
                  "469",
                  0
              ],
              "filename_prefix": "MALE_CHARACTER_FACESWAP"
          },
          "class_type": "SaveImage"
      },
      "472": {
          "_meta": {
              "title": "Image Comparer (rgthree)"
          },
          "inputs": {
              "image_a": [
                  "336",
                  0
              ],
              "image_b": [
                  "469",
                  0
              ],
              "rgthree_comparer": {
                  "images": [
                      {
                          "url": "/api/view?filename=rgthree.compare._temp_ndtvv_00007_.png&type=temp&subfolder=&rand=0.5166150054096998",
                          "name": "A",
                          "selected": true
                      },
                      {
                          "url": "/api/view?filename=rgthree.compare._temp_ndtvv_00008_.png&type=temp&subfolder=&rand=0.5344775561796046",
                          "name": "B",
                          "selected": true
                      }
                  ]
              }
          },
          "class_type": "Image Comparer (rgthree)"
      },
      "474": {
          "_meta": {
              "title": "Resize Image v2"
          },
          "inputs": {
              "image": [
                  "475",
                  0
              ],
              "width": [
                  "361",
                  0
              ],
              "device": "cpu",
              "height": [
                  "360",
                  0
              ],
              "pad_color": "172,172,172",
              "divisible_by": 16,
              "crop_position": "center",
              "upscale_method": "lanczos",
              "keep_proportion": "crop"
          },
          "class_type": "ImageResizeKJv2"
      },
      "475": {
          "_meta": {
              "title": "Load Image: Reference"
          },
          "inputs": {
              "image": "4d408847-6a44-4e95-a8cd-7e640522e424.jpeg"
          },
          "class_type": "LoadImage"
      },
      "488": {
          "_meta": {
              "title": "ReActor 🌌 Face Booster"
          },
          "inputs": {
              "enabled": true,
              "visibility": 1,
              "boost_model": [
                  "660",
                  0
              ],
              "interpolation": "Bicubic",
              "codeformer_weight": 0.5,
              "restore_with_main_after": false
          },
          "class_type": "ReActorFaceBoost"
      },
      "489": {
          "_meta": {
              "title": "ReActor 🌌 Face Booster"
          },
          "inputs": {
              "enabled": true,
              "visibility": 1,
              "boost_model": [
                  "660",
                  0
              ],
              "interpolation": "Bicubic",
              "codeformer_weight": 0.5,
              "restore_with_main_after": false
          },
          "class_type": "ReActorFaceBoost"
      },
      "490": {
          "_meta": {
              "title": "ReActor 🌌 Fast Face Swap"
          },
          "inputs": {
              "enabled": true,
              "face_boost": [
                  "488",
                  0
              ],
              "swap_model": "inswapper_128.onnx",
              "input_image": [
                  "447",
                  0
              ],
              "source_image": [
                  "865",
                  0
              ],
              "facedetection": "YOLOv5l",
              "codeformer_weight": 0.6000000000000001,
              "console_log_level": 1,
              "input_faces_index": "1",
              "face_restore_model": "codeformer-v0.1.0.pth",
              "source_faces_index": "0",
              "detect_gender_input": "no",
              "detect_gender_source": "no",
              "face_restore_visibility": 1
          },
          "class_type": "ReActorFaceSwap"
      },
      "491": {
          "_meta": {
              "title": "Load Image"
          },
          "inputs": {
              "image": "SCENE_COUPLE_00001_ (1).png"
          },
          "class_type": "LoadImage"
      },
      "492": {
          "_meta": {
              "title": "颜色调整"
          },
          "inputs": {
              "image": [
                  "490",
                  0
              ],
              "preview": "",
              "contrast": 0.8817826157532459,
              "brightness": 1.139396845233569,
              "saturation": 0.9157544104446935
          },
          "class_type": "ColorAdjustment"
      },
      "493": {
          "_meta": {
              "title": "Save Image"
          },
          "inputs": {
              "images": [
                  "500",
                  0
              ],
              "filename_prefix": "COUPLE_FACESWAP"
          },
          "class_type": "SaveImage"
      },
      "494": {
          "_meta": {
              "title": "Save Image"
          },
          "inputs": {
              "images": [
                  "501",
                  0
              ],
              "filename_prefix": "COUPLE_FINAL"
          },
          "class_type": "SaveImage"
      },
      "495": {
          "_meta": {
              "title": "ReActor 🌌 Fast Face Swap"
          },
          "inputs": {
              "enabled": true,
              "face_boost": [
                  "489",
                  0
              ],
              "swap_model": "inswapper_128.onnx",
              "input_image": [
                  "500",
                  0
              ],
              "source_image": [
                  "863",
                  0
              ],
              "facedetection": "retinaface_resnet50",
              "codeformer_weight": 0.6000000000000001,
              "console_log_level": 1,
              "input_faces_index": "0",
              "face_restore_model": "codeformer-v0.1.0.pth",
              "source_faces_index": "0",
              "detect_gender_input": "no",
              "detect_gender_source": "no",
              "face_restore_visibility": 1
          },
          "class_type": "ReActorFaceSwap"
      },
      "496": {
          "_meta": {
              "title": "Image Comparer (rgthree)"
          },
          "inputs": {
              "image_a": [
                  "500",
                  0
              ],
              "image_b": [
                  "501",
                  0
              ],
              "rgthree_comparer": {
                  "images": [
                      {
                          "url": "/api/view?filename=rgthree.compare._temp_alrjk_00007_.png&type=temp&subfolder=&rand=0.14750866024254183",
                          "name": "A",
                          "selected": true
                      },
                      {
                          "url": "/api/view?filename=rgthree.compare._temp_alrjk_00008_.png&type=temp&subfolder=&rand=0.34541111146402703",
                          "name": "B",
                          "selected": true
                      }
                  ]
              }
          },
          "class_type": "Image Comparer (rgthree)"
      },
      "497": {
          "_meta": {
              "title": "颜色调整"
          },
          "inputs": {
              "image": [
                  "495",
                  0
              ],
              "preview": "",
              "contrast": 0.8817826157532459,
              "brightness": 1.139396845233569,
              "saturation": 0.9157544104446935
          },
          "class_type": "ColorAdjustment"
      },
      "499": {
          "_meta": {
              "title": "Image Comparer (rgthree)"
          },
          "inputs": {
              "image_a": [
                  "447",
                  0
              ],
              "image_b": [
                  "500",
                  0
              ],
              "rgthree_comparer": {
                  "images": [
                      {
                          "url": "/api/view?filename=rgthree.compare._temp_dtobq_00007_.png&type=temp&subfolder=&rand=0.8266045350180395",
                          "name": "A",
                          "selected": true
                      },
                      {
                          "url": "/api/view?filename=rgthree.compare._temp_dtobq_00008_.png&type=temp&subfolder=&rand=0.5426516809222217",
                          "name": "B",
                          "selected": true
                      }
                  ]
              }
          },
          "class_type": "Image Comparer (rgthree)"
      },
      "500": {
          "_meta": {
              "title": "🅛🅣🅧 LTXV Film Grain"
          },
          "inputs": {
              "images": [
                  "492",
                  0
              ],
              "saturation": 0.5,
              "grain_intensity": 0.020000000000000004
          },
          "class_type": "LTXVFilmGrain"
      },
      "501": {
          "_meta": {
              "title": "🅛🅣🅧 LTXV Film Grain"
          },
          "inputs": {
              "images": [
                  "497",
                  0
              ],
              "saturation": 0.5,
              "grain_intensity": 0.020000000000000004
          },
          "class_type": "LTXVFilmGrain"
      },
      "506": {
          "_meta": {
              "title": "Load Image"
          },
          "inputs": {
              "image": "COUPLE_FINAL_00008_.png"
          },
          "class_type": "LoadImage"
      },
      "518": {
          "_meta": {
              "title": "Batch Images"
          },
          "inputs": {
              "image1": [
                  "537",
                  0
              ],
              "image2": [
                  "538",
                  0
              ]
          },
          "class_type": "ImageBatch"
      },
      "525": {
          "_meta": {
              "title": "Batch Images"
          },
          "inputs": {
              "image1": [
                  "518",
                  0
              ],
              "image2": [
                  "539",
                  0
              ]
          },
          "class_type": "ImageBatch"
      },
      "526": {
          "_meta": {
              "title": "Load Image"
          },
          "inputs": {
              "image": "FEMALE_CHARACTER_FACESWAP_00001_ (1).png"
          },
          "class_type": "LoadImage"
      },
      "527": {
          "_meta": {
              "title": "Load Image"
          },
          "inputs": {
              "image": "MALE_CHARACTER_FACESWAP_00001_.png"
          },
          "class_type": "LoadImage"
      },
      "533": {
          "_meta": {
              "title": "External Text (ComfyUI Deploy)"
          },
          "inputs": {
              "input_id": "ACTION_MANUAL_PROMPT",
              "description": "",
              "display_name": "",
              "default_value": "Tactical soldier swiftly raises rifle, red-haired operative  smirks approvingly, shifting stance, sand swirls across barren desert, camera tracks swiftly upward, harsh shadows accentuate tension, warm color palette, deep focus, dynamic composition, shot on Sony FX9 with anamorphic lenses, classic tokusatsu aesthetics."
          },
          "class_type": "ComfyUIDeployExternalText"
      },
      "537": {
          "_meta": {
              "title": "Resize Image v2"
          },
          "inputs": {
              "image": [
                  "506",
                  0
              ],
              "width": [
                  "361",
                  0
              ],
              "device": "cpu",
              "height": [
                  "360",
                  0
              ],
              "pad_color": "255,255,255",
              "divisible_by": 16,
              "crop_position": "center",
              "upscale_method": "lanczos",
              "keep_proportion": "pad"
          },
          "class_type": "ImageResizeKJv2"
      },
      "538": {
          "_meta": {
              "title": "Resize Image v2"
          },
          "inputs": {
              "image": [
                  "526",
                  0
              ],
              "width": [
                  "361",
                  0
              ],
              "device": "cpu",
              "height": [
                  "360",
                  0
              ],
              "pad_color": "255,255,255",
              "divisible_by": 16,
              "crop_position": "center",
              "upscale_method": "lanczos",
              "keep_proportion": "pad"
          },
          "class_type": "ImageResizeKJv2"
      },
      "539": {
          "_meta": {
              "title": "Resize Image v2"
          },
          "inputs": {
              "image": [
                  "527",
                  0
              ],
              "width": [
                  "361",
                  0
              ],
              "device": "cpu",
              "height": [
                  "360",
                  0
              ],
              "pad_color": "255,255,255",
              "divisible_by": 16,
              "crop_position": "center",
              "upscale_method": "lanczos",
              "keep_proportion": "pad"
          },
          "class_type": "ImageResizeKJv2"
      },
      "559": {
          "_meta": {
              "title": "Load Video (Upload) 🎥🅥🅗🅢"
          },
          "inputs": {
              "video": "anim_couple_select.mp4",
              "format": "None",
              "force_rate": [
                  "787",
                  0
              ],
              "custom_width": 0,
              "custom_height": 0,
              "frame_load_cap": [
                  "341",
                  0
              ],
              "select_every_nth": 1,
              "skip_first_frames": 0
          },
          "class_type": "VHS_LoadVideo"
      },
      "570": {
          "_meta": {
              "title": "Kling Master v2.0 Video Generation (fal)"
          },
          "inputs": {
              "image": [
                  "888",
                  0
              ],
              "prompt": [
                  "293",
                  4
              ],
              "duration": "5",
              "aspect_ratio": [
                  "1072",
                  0
              ]
          },
          "class_type": "KlingMaster_fal"
      },
      "571": {
          "_meta": {
              "title": "Save Text 🐍"
          },
          "inputs": {
              "file": "file.txt",
              "text": [
                  "570",
                  0
              ],
              "append": "append",
              "insert": true,
              "root_dir": "input"
          },
          "class_type": "SaveText|pysssss"
      },
      "572": {
          "_meta": {
              "title": "Show Text 🐍"
          },
          "inputs": {
              "text": [
                  "570",
                  0
              ],
              "text_0": "https://v3.fal.media/files/tiger/GKBvARLgcQXE8NbsvCO2w_output.mp4"
          },
          "class_type": "ShowText|pysssss"
      },
      "604": {
          "_meta": {
              "title": "Text Output (ComfyDeploy)"
          },
          "inputs": {
              "text": [
                  "570",
                  0
              ],
              "file_type": "txt",
              "output_id": "output_text",
              "filename_prefix": "FAL_KLING_VIDEO"
          },
          "class_type": "ComfyDeployOutputText"
      },
      "608": {
          "_meta": {
              "title": "Image Stitch (RMBG) 🖼️"
          },
          "inputs": {
              "image1": [
                  "640",
                  0
              ],
              "image2": [
                  "501",
                  0
              ],
              "concat_direction": "right"
          },
          "class_type": "AILab_ImageStitch"
      },
      "612": {
          "_meta": {
              "title": "Image Stitch (RMBG) 🖼️"
          },
          "inputs": {
              "image1": [
                  "297",
                  0
              ],
              "image2": [
                  "229",
                  0
              ],
              "concat_direction": "bottom"
          },
          "class_type": "AILab_ImageStitch"
      },
      "613": {
          "_meta": {
              "title": "Image Stitch (RMBG) 🖼️"
          },
          "inputs": {
              "image1": [
                  "313",
                  0
              ],
              "image2": [
                  "314",
                  0
              ],
              "concat_direction": "bottom"
          },
          "class_type": "AILab_ImageStitch"
      },
      "634": {
          "_meta": {
              "title": "Image Stitch (RMBG) 🖼️"
          },
          "inputs": {
              "image1": [
                  "637",
                  0
              ],
              "image2": [
                  "636",
                  0
              ],
              "concat_direction": "bottom"
          },
          "class_type": "AILab_ImageStitch"
      },
      "635": {
          "_meta": {
              "title": "Preview Image"
          },
          "inputs": {
              "images": [
                  "634",
                  0
              ]
          },
          "class_type": "PreviewImage"
      },
      "636": {
          "_meta": {
              "title": "Image Stitch (RMBG) 🖼️"
          },
          "inputs": {
              "image1": [
                  "657",
                  0
              ],
              "image2": [
                  "655",
                  0
              ],
              "concat_direction": "right"
          },
          "class_type": "AILab_ImageStitch"
      },
      "637": {
          "_meta": {
              "title": "Image Stitch (RMBG) 🖼️"
          },
          "inputs": {
              "image1": [
                  "317",
                  0
              ],
              "image2": [
                  "474",
                  0
              ],
              "concat_direction": "right"
          },
          "class_type": "AILab_ImageStitch"
      },
      "638": {
          "_meta": {
              "title": "Preview Image"
          },
          "inputs": {
              "images": [
                  "612",
                  0
              ]
          },
          "class_type": "PreviewImage"
      },
      "639": {
          "_meta": {
              "title": "Preview Image"
          },
          "inputs": {
              "images": [
                  "613",
                  0
              ]
          },
          "class_type": "PreviewImage"
      },
      "640": {
          "_meta": {
              "title": "Image Stitch (RMBG) 🖼️"
          },
          "inputs": {
              "image1": [
                  "468",
                  0
              ],
              "image2": [
                  "469",
                  0
              ],
              "concat_direction": "bottom"
          },
          "class_type": "AILab_ImageStitch"
      },
      "641": {
          "_meta": {
              "title": "Preview Image"
          },
          "inputs": {
              "images": [
                  "640",
                  0
              ]
          },
          "class_type": "PreviewImage"
      },
      "655": {
          "_meta": {
              "title": "Image Stitch (RMBG) 🖼️"
          },
          "inputs": {
              "image1": [
                  "613",
                  0
              ],
              "image2": [
                  "469",
                  0
              ],
              "concat_direction": "right"
          },
          "class_type": "AILab_ImageStitch"
      },
      "656": {
          "_meta": {
              "title": "Save Image"
          },
          "inputs": {
              "images": [
                  "655",
                  0
              ],
              "filename_prefix": "CAST_ACTOR_IN_ROLE"
          },
          "class_type": "SaveImage"
      },
      "657": {
          "_meta": {
              "title": "Image Stitch (RMBG) 🖼️"
          },
          "inputs": {
              "image1": [
                  "612",
                  0
              ],
              "image2": [
                  "468",
                  0
              ],
              "concat_direction": "right"
          },
          "class_type": "AILab_ImageStitch"
      },
      "658": {
          "_meta": {
              "title": "Save Image"
          },
          "inputs": {
              "images": [
                  "657",
                  0
              ],
              "filename_prefix": "CAST_ACTRESS_IN_ROLE"
          },
          "class_type": "SaveImage"
      },
      "660": {
          "_meta": {
              "title": "External Enum"
          },
          "inputs": {
              "options": "[\"none\",\"codeformer-v0.1.0.pth\",\"codeformer.pth\",\"GFPGANv1.3.pth\",\"GFPGANv1.4.pth\",\"GPEN-BFR-512.pth\"]",
              "input_id": "boost_model",
              "description": "",
              "display_name": "",
              "default_value": "GPEN-BFR-512.pth"
          },
          "class_type": "ComfyUIDeployExternalEnum"
      },
      "668": {
          "_meta": {
              "title": "Preview Image"
          },
          "inputs": {
              "images": [
                  "608",
                  0
              ]
          },
          "class_type": "PreviewImage"
      },
      "677": {
          "_meta": {
              "title": "String Combine (ComfyUI Deploy)"
          },
          "inputs": {
              "action": "append",
              "text_a": "Change the characters to the live-action versions while maintaining the original pose and composition from the animated image ",
              "text_b": "",
              "text_c": "",
              "tidy_tags": "yes"
          },
          "class_type": "ComfyUIDeployStringCombine"
      },
      "692": {
          "_meta": {
              "title": "String"
          },
          "inputs": {
              "value": [
                  "773",
                  0
              ]
          },
          "class_type": "PrimitiveString"
      },
      "694": {
          "_meta": {
              "title": "String"
          },
          "inputs": {
              "value": [
                  "772",
                  0
              ]
          },
          "class_type": "PrimitiveString"
      },
      "695": {
          "_meta": {
              "title": "Preview Image"
          },
          "inputs": {
              "images": [
                  "637",
                  0
              ]
          },
          "class_type": "PreviewImage"
      },
      "710": {
          "_meta": {
              "title": "Load Video (Upload) 🎥🅥🅗🅢"
          },
          "inputs": {
              "video": "depth_map_00003.mp4",
              "format": "None",
              "force_rate": [
                  "786",
                  0
              ],
              "custom_width": 0,
              "custom_height": 0,
              "frame_load_cap": [
                  "341",
                  0
              ],
              "select_every_nth": 1,
              "skip_first_frames": 0
          },
          "class_type": "VHS_LoadVideo"
      },
      "711": {
          "_meta": {
              "title": "Load Video (Upload) 🎥🅥🅗🅢"
          },
          "inputs": {
              "video": "OP_map_00002.mp4",
              "format": "None",
              "force_rate": [
                  "786",
                  0
              ],
              "custom_width": 0,
              "custom_height": 0,
              "frame_load_cap": [
                  "341",
                  0
              ],
              "select_every_nth": 1,
              "skip_first_frames": 0
          },
          "class_type": "VHS_LoadVideo"
      },
      "740": {
          "_meta": {
              "title": "Resize Image v2"
          },
          "inputs": {
              "image": [
                  "608",
                  0
              ],
              "width": [
                  "361",
                  0
              ],
              "device": "cpu",
              "height": [
                  "360",
                  0
              ],
              "pad_color": "172,172,172",
              "divisible_by": 16,
              "crop_position": "center",
              "upscale_method": "lanczos",
              "keep_proportion": "pad_edge"
          },
          "class_type": "ImageResizeKJv2"
      },
      "770": {
          "_meta": {
              "title": "Save Image"
          },
          "inputs": {
              "images": [
                  "740",
                  0
              ],
              "filename_prefix": "REF_STITCH"
          },
          "class_type": "SaveImage"
      },
      "772": {
          "_meta": {
              "title": "External Text (ComfyUI Deploy)"
          },
          "inputs": {
              "input_id": "ACTOR_IS_LEFT?",
              "description": "Cero 0 Means NO\n",
              "display_name": "",
              "default_value": "1\n\n"
          },
          "class_type": "ComfyUIDeployExternalText"
      },
      "773": {
          "_meta": {
              "title": "External Text (ComfyUI Deploy)"
          },
          "inputs": {
              "input_id": "ACTOR_IS_ON_RIGHT_SIDE?",
              "description": "One 1 Means YES\n ",
              "display_name": "",
              "default_value": "1\n"
          },
          "class_type": "ComfyUIDeployExternalText"
      },
      "786": {
          "_meta": {
              "title": "Float"
          },
          "inputs": {
              "value": [
                  "787",
                  0
              ]
          },
          "class_type": "PrimitiveFloat"
      },
      "787": {
          "_meta": {
              "title": "External Number Slider (ComfyUI Deploy)"
          },
          "inputs": {
              "input_id": "FPS",
              "max_value": 1,
              "min_value": 0,
              "description": "15 if using WAN VACE 24 if Phantom\n",
              "display_name": "",
              "default_value": 24.000000000000004
          },
          "class_type": "ComfyUIDeployExternalNumberSlider"
      },
      "793": {
          "_meta": {
              "title": "Load Video (Path) 🎥🅥🅗🅢"
          },
          "inputs": {
              "video": [
                  "570",
                  0
              ],
              "format": "Wan",
              "force_rate": 0,
              "custom_width": 0,
              "custom_height": 0,
              "frame_load_cap": 0,
              "select_every_nth": 1,
              "skip_first_frames": 0
          },
          "class_type": "VHS_LoadVideoPath"
      },
      "863": {
          "_meta": {
              "title": "BiRefNet Remove Background (RMBG)"
          },
          "inputs": {
              "image": [
                  "312",
                  0
              ],
              "model": "BiRefNet-general",
              "mask_blur": 1,
              "background": "Color",
              "mask_offset": 0,
              "invert_output": false,
              "background_color": "#ffffff",
              "refine_foreground": false
          },
          "class_type": "BiRefNetRMBG"
      },
      "864": {
          "_meta": {
              "title": "Preview Image"
          },
          "inputs": {
              "images": [
                  "863",
                  0
              ]
          },
          "class_type": "PreviewImage"
      },
      "865": {
          "_meta": {
              "title": "BiRefNet Remove Background (RMBG)"
          },
          "inputs": {
              "image": [
                  "229",
                  0
              ],
              "model": "BiRefNet-general",
              "mask_blur": 1,
              "background": "Color",
              "mask_offset": 0,
              "invert_output": false,
              "background_color": "#ffffff",
              "refine_foreground": false
          },
          "class_type": "BiRefNetRMBG"
      },
      "866": {
          "_meta": {
              "title": "Preview Image"
          },
          "inputs": {
              "images": [
                  "865",
                  0
              ]
          },
          "class_type": "PreviewImage"
      },
      "867": {
          "_meta": {
              "title": "BiRefNet Remove Background (RMBG)"
          },
          "inputs": {
              "image": [
                  "538",
                  0
              ],
              "model": "BiRefNet-general",
              "mask_blur": 1,
              "background": "Color",
              "mask_offset": 0,
              "invert_output": false,
              "background_color": "#ffffff",
              "refine_foreground": false
          },
          "class_type": "BiRefNetRMBG"
      },
      "868": {
          "_meta": {
              "title": "BiRefNet Remove Background (RMBG)"
          },
          "inputs": {
              "image": [
                  "539",
                  0
              ],
              "model": "BiRefNet-general",
              "mask_blur": 1,
              "background": "Color",
              "mask_offset": 0,
              "invert_output": false,
              "background_color": "#ffffff",
              "refine_foreground": false
          },
          "class_type": "BiRefNetRMBG"
      },
      "869": {
          "_meta": {
              "title": "Preview Image"
          },
          "inputs": {
              "images": [
                  "868",
                  0
              ]
          },
          "class_type": "PreviewImage"
      },
      "870": {
          "_meta": {
              "title": "Preview Image"
          },
          "inputs": {
              "images": [
                  "867",
                  0
              ]
          },
          "class_type": "PreviewImage"
      },
      "873": {
          "_meta": {
              "title": "BiRefNet Remove Background (RMBG)"
          },
          "inputs": {
              "image": [
                  "501",
                  0
              ],
              "model": "BiRefNet-general",
              "mask_blur": 1,
              "background": "Color",
              "mask_offset": 0,
              "invert_output": false,
              "background_color": "#ffffff",
              "refine_foreground": false
          },
          "class_type": "BiRefNetRMBG"
      },
      "875": {
          "_meta": {
              "title": "Preview Image"
          },
          "inputs": {
              "images": [
                  "873",
                  2
              ]
          },
          "class_type": "PreviewImage"
      },
      "878": {
          "_meta": {
              "title": "Preview Image"
          },
          "inputs": {
              "images": [
                  "873",
                  0
              ]
          },
          "class_type": "PreviewImage"
      },
      "882": {
          "_meta": {
              "title": "Image Batch Multi"
          },
          "inputs": {
              "image_1": [
                  "873",
                  0
              ],
              "image_2": [
                  "867",
                  0
              ],
              "image_3": [
                  "868",
                  0
              ],
              "inputcount": 3,
              "Update inputs": null
          },
          "class_type": "ImageBatchMulti"
      },
      "883": {
          "_meta": {
              "title": "Preview Image"
          },
          "inputs": {
              "images": [
                  "882",
                  0
              ]
          },
          "class_type": "PreviewImage"
      },
      "888": {
          "_meta": {
              "title": "ImageCompositeMasked"
          },
          "inputs": {
              "x": 0,
              "y": 0,
              "mask": [
                  "873",
                  1
              ],
              "source": [
                  "873",
                  0
              ],
              "destination": [
                  "474",
                  0
              ],
              "resize_source": false
          },
          "class_type": "ImageCompositeMasked"
      },
      "889": {
          "_meta": {
              "title": "Preview Image"
          },
          "inputs": {
              "images": [
                  "888",
                  0
              ]
          },
          "class_type": "PreviewImage"
      },
      "949": {
          "_meta": {
              "title": "ReActor 🌌 Face Booster"
          },
          "inputs": {
              "enabled": true,
              "visibility": 1,
              "boost_model": [
                  "660",
                  0
              ],
              "interpolation": "Bicubic",
              "codeformer_weight": 0.5,
              "restore_with_main_after": false
          },
          "class_type": "ReActorFaceBoost"
      },
      "950": {
          "_meta": {
              "title": "颜色调整"
          },
          "inputs": {
              "image": [
                  "957",
                  0
              ],
              "preview": "",
              "contrast": 0.8817826157532459,
              "brightness": 1.139396845233569,
              "saturation": 0.9157544104446935
          },
          "class_type": "ColorAdjustment"
      },
      "951": {
          "_meta": {
              "title": "颜色调整"
          },
          "inputs": {
              "image": [
                  "963",
                  0
              ],
              "preview": "",
              "contrast": 0.8817826157532459,
              "brightness": 1.139396845233569,
              "saturation": 0.9157544104446935
          },
          "class_type": "ColorAdjustment"
      },
      "953": {
          "_meta": {
              "title": "ReActor 🌌 Face Booster"
          },
          "inputs": {
              "enabled": true,
              "visibility": 1,
              "boost_model": [
                  "660",
                  0
              ],
              "interpolation": "Bicubic",
              "codeformer_weight": 0.5,
              "restore_with_main_after": false
          },
          "class_type": "ReActorFaceBoost"
      },
      "955": {
          "_meta": {
              "title": "🅛🅣🅧 LTXV Film Grain"
          },
          "inputs": {
              "images": [
                  "950",
                  0
              ],
              "saturation": 0.5,
              "grain_intensity": 0.020000000000000004
          },
          "class_type": "LTXVFilmGrain"
      },
      "956": {
          "_meta": {
              "title": "🅛🅣🅧 LTXV Film Grain"
          },
          "inputs": {
              "images": [
                  "951",
                  0
              ],
              "saturation": 0.5,
              "grain_intensity": 0.020000000000000004
          },
          "class_type": "LTXVFilmGrain"
      },
      "957": {
          "_meta": {
              "title": "ReActor 🌌 Fast Face Swap"
          },
          "inputs": {
              "enabled": true,
              "face_boost": [
                  "949",
                  0
              ],
              "swap_model": "inswapper_128.onnx",
              "input_image": [
                  "956",
                  0
              ],
              "source_image": [
                  "863",
                  0
              ],
              "facedetection": "retinaface_resnet50",
              "codeformer_weight": 0.6000000000000001,
              "console_log_level": 1,
              "input_faces_index": "0",
              "face_restore_model": "codeformer-v0.1.0.pth",
              "source_faces_index": "0",
              "detect_gender_input": "no",
              "detect_gender_source": "no",
              "face_restore_visibility": 1
          },
          "class_type": "ReActorFaceSwap"
      },
      "960": {
          "_meta": {
              "title": "String"
          },
          "inputs": {
              "value": [
                  "772",
                  0
              ]
          },
          "class_type": "PrimitiveString"
      },
      "963": {
          "_meta": {
              "title": "ReActor 🌌 Fast Face Swap"
          },
          "inputs": {
              "enabled": true,
              "face_boost": [
                  "953",
                  0
              ],
              "swap_model": "inswapper_128.onnx",
              "input_image": [
                  "793",
                  0
              ],
              "source_image": [
                  "865",
                  0
              ],
              "facedetection": "retinaface_resnet50",
              "codeformer_weight": 0.6000000000000001,
              "console_log_level": 1,
              "input_faces_index": "1",
              "face_restore_model": "codeformer-v0.1.0.pth",
              "source_faces_index": "0",
              "detect_gender_input": "no",
              "detect_gender_source": "no",
              "face_restore_visibility": 1
          },
          "class_type": "ReActorFaceSwap"
      },
      "965": {
          "_meta": {
              "title": "String"
          },
          "inputs": {
              "value": [
                  "773",
                  0
              ]
          },
          "class_type": "PrimitiveString"
      },
      "973": {
          "_meta": {
              "title": "Video Combine 🎥🅥🅗🅢"
          },
          "inputs": {
              "crf": 20,
              "format": "video/h264-mp4",
              "images": [
                  "956",
                  0
              ],
              "pix_fmt": "yuv420p",
              "pingpong": false,
              "frame_rate": 15,
              "loop_count": 0,
              "save_output": true,
              "save_metadata": true,
              "trim_to_audio": false,
              "filename_prefix": "Any2LiveAction_actress_face replace"
          },
          "class_type": "VHS_VideoCombine"
      },
      "974": {
          "_meta": {
              "title": "Video Combine 🎥🅥🅗🅢"
          },
          "inputs": {
              "crf": 20,
              "format": "video/h264-mp4",
              "images": [
                  "955",
                  0
              ],
              "pix_fmt": "yuv420p",
              "pingpong": false,
              "frame_rate": 15,
              "loop_count": 0,
              "save_output": true,
              "save_metadata": true,
              "trim_to_audio": false,
              "filename_prefix": "Any2LiveAction_final_face replace"
          },
          "class_type": "VHS_VideoCombine"
      },
      "978": {
          "_meta": {
              "title": "Load Video (Upload) 🎥🅥🅗🅢"
          },
          "inputs": {
              "video": "5051385-hd_1920_1080_25fps.mp4",
              "format": "AnimateDiff",
              "force_rate": 0,
              "custom_width": 0,
              "custom_height": 0,
              "frame_load_cap": 0,
              "select_every_nth": 1,
              "skip_first_frames": 0
          },
          "class_type": "VHS_LoadVideo"
      },
      "982": {
          "_meta": {
              "title": "Image Batch Multi"
          },
          "inputs": {
              "image_1": [
                  "317",
                  0
              ],
              "image_2": [
                  "230",
                  0
              ],
              "image_3": [
                  "336",
                  0
              ],
              "image_4": [
                  "474",
                  0
              ],
              "inputcount": 4,
              "Update inputs": null
          },
          "class_type": "ImageBatchMulti"
      },
      "1051": {
          "_meta": {
              "title": "Prompt Manager (LLMToolkit)"
          },
          "inputs": {
              "url": "",
              "image": [
                  "288",
                  0
              ],
              "context": [
                  "309",
                  0
              ],
              "file_path": "",
              "audio_path": "",
              "text_prompt": "You are a master artist crafting precise visual narratives for text-to-image generation. When given an image or visual description, create a flowing 70 word paragraph following this base on the TASK\n\n### 1. Basic Modifications\n- Simple and direct: `\"Change the car color to red\"`\n- Maintain style: `\"Change to daytime while maintaining the same style of the painting\"`\n\n### 2. Style Transfer\n**Principles:**\n- Clearly name style: `\"Transform to Bauhaus art style\"`\n- Describe characteristics: `\"Transform to oil painting with visible brushstrokes, thick paint texture\"`\n- Preserve composition: `\"Change to Bauhaus style while maintaining the original composition\"`\n\n### 3. Character Consistency\n**Framework:**\n- Specific description: `\"The woman with short black hair\"` instead of \"she\"\n- Preserve features: `\"while maintaining the same facial features, hairstyle, and expression\"`\n- Step-by-step modifications: Change background first, then actions\n\n### 4. Text Editing\n- Use quotes: `\"Replace 'joy' with 'BFL'\"`\n- Maintain format: `\"Replace text while maintaining the same font style\"`\n\n## Common Problem Solutions\n\n### Character Changes Too Much\n❌ Wrong: `\"Transform the person into a Viking\"`\n✅ Correct: `\"Change the clothes to be a viking warrior while preserving facial features\"`\n\n### Composition Position Changes\n❌ Wrong: `\"Put him on a beach\"`\n✅ Correct: `\"Change the background to a beach while keeping the person in the exact same position, scale, and pose\"`\n\n### Style Application Inaccuracy\n❌ Wrong: `\"Make it a sketch\"`\n✅ Correct: `\"Convert to pencil sketch with natural graphite lines, cross-hatching, and visible paper texture\"`\n\n## Core Principles\n\n1. **Be Specific and Clear** - Use precise descriptions, avoid vague terms\n2. **Step-by-step Editing** - Break complex modifications into multiple simple steps\n3. **Explicit Preservation** - State what should remain unchanged\n4. **Verb Selection** - Use \"change\", \"replace\" rather than \"transform\"\n\n## Best Practice Templates\n\n**Object Modification:**\n`\"Change [object] to [new state], keep [content to preserve] unchanged\"`\n\n**Style Transfer:**\n`\"Transform to [specific style], while maintaining [composition/character/other] unchanged\"`\n\n**Background Replacement:**\n`\"Change the background to [new background], keep the subject in the exact same position and pose\"`\n\n**Text Editing:**\n`\"Replace '[original text]' with '[new text]', maintain the same font style\"`\n\n> **Remember:** The more specific, the better. Kontext excels at understanding detailed instructions and maintaining consistency. \n\n**TASK:**\nTransform the first image to Transform the character into a realistic, high-quality live-action cosplay portrayal featuring the provided Actress with slithly stylized pushed proportions to improve the charcter likeness Acurately describe the facial structure features and characteristics, haistyle, costume, accessories and props and pose of each character from the original picture in order to replace it with the matching actress provided. Keep the composition, poses and costumes of the characters. Transforming the image into the live action representation of the character. Make sure all the visual characteristic from the character in the original image are an accurately LIFELIKE portrayal of the character by the actress "
          },
          "class_type": "PromptManager"
      },
      "1052": {
          "_meta": {
              "title": "Display Text (LLMToolkit)"
          },
          "inputs": {
              "select": "0",
              "context": [
                  "1053",
                  0
              ],
              "Display_Text_2": "Transform the illustrated character into a realistic, high-quality live-action cosplay portrayal featuring the provided actress, accurately capturing her distinct facial structure with defined cheekbones, softly rounded jawline, and expressive almond-shaped eyes. Change the hairstyle to short, vibrant red hair styled in soft waves identical to the character's. Keep the costume precisely unchanged with a fitted dark tank top, green tactical pants, knee pads, fingerless gloves, rugged combat boots, gun, and holstered sword accessory. Preserve the original crouched, alert pose and overall composition."
          },
          "class_type": "Display_Text"
      },
      "1053": {
          "_meta": {
              "title": "Generate Text Stream (LLMToolkit)"
          },
          "inputs": {
              "prompt": "Write a detailed description of a futuristic city.",
              "context": [
                  "1051",
                  0
              ],
              "llm_model": "gpt-4o-mini",
              "LLMToolkitTextGeneratorStream_response": "Transform the illustrated character into a realistic, high-quality live-action cosplay portrayal featuring the provided actress, accurately capturing her distinct facial structure with defined cheekbones, softly rounded jawline, and expressive almond-shaped eyes. Change the hairstyle to short, vibrant red hair styled in soft waves identical to the character's. Keep the costume precisely unchanged with a fitted dark tank top, green tactical pants, knee pads, fingerless gloves, rugged combat boots, gun, and holstered sword accessory. Preserve the original crouched, alert pose and overall composition."
          },
          "class_type": "LLMToolkitTextGeneratorStream"
      },
      "1054": {
          "_meta": {
              "title": "Prompt Manager (LLMToolkit)"
          },
          "inputs": {
              "url": "",
              "image": [
                  "311",
                  0
              ],
              "context": [
                  "309",
                  0
              ],
              "file_path": "",
              "audio_path": "",
              "text_prompt": "You are a master artist crafting precise visual narratives for text-to-image generation. When given an image or visual description, create a flowing 70 word paragraph following this base on the TASK\n\n### 1. Basic Modifications\n- Simple and direct: `\"Change the car color to red\"`\n- Maintain style: `\"Change to daytime while maintaining the same style of the painting\"`\n\n### 2. Style Transfer\n**Principles:**\n- Clearly name style: `\"Transform to Bauhaus art style\"`\n- Describe characteristics: `\"Transform to oil painting with visible brushstrokes, thick paint texture\"`\n- Preserve composition: `\"Change to Bauhaus style while maintaining the original composition\"`\n\n### 3. Character Consistency\n**Framework:**\n- Specific description: `\"The woman with short black hair\"` instead of \"she\"\n- Preserve features: `\"while maintaining the same facial features, hairstyle, and expression\"`\n- Step-by-step modifications: Change background first, then actions\n\n### 4. Text Editing\n- Use quotes: `\"Replace 'joy' with 'BFL'\"`\n- Maintain format: `\"Replace text while maintaining the same font style\"`\n\n## Common Problem Solutions\n\n### Character Changes Too Much\n❌ Wrong: `\"Transform the person into a Viking\"`\n✅ Correct: `\"Change the clothes to be a viking warrior while preserving facial features\"`\n\n### Composition Position Changes\n❌ Wrong: `\"Put him on a beach\"`\n✅ Correct: `\"Change the background to a beach while keeping the person in the exact same position, scale, and pose\"`\n\n### Style Application Inaccuracy\n❌ Wrong: `\"Make it a sketch\"`\n✅ Correct: `\"Convert to pencil sketch with natural graphite lines, cross-hatching, and visible paper texture\"`\n\n## Core Principles\n\n1. **Be Specific and Clear** - Use precise descriptions, avoid vague terms\n2. **Step-by-step Editing** - Break complex modifications into multiple simple steps\n3. **Explicit Preservation** - State what should remain unchanged\n4. **Verb Selection** - Use \"change\", \"replace\" rather than \"transform\"\n\n## Best Practice Templates\n\n**Object Modification:**\n`\"Change [object] to [new state], keep [content to preserve] unchanged\"`\n\n**Style Transfer:**\n`\"Transform to [specific style], while maintaining [composition/character/other] unchanged\"`\n\n**Background Replacement:**\n`\"Change the background to [new background], keep the subject in the exact same position and pose\"`\n\n**Text Editing:**\n`\"Replace '[original text]' with '[new text]', maintain the same font style\"`\n\n> **Remember:** The more specific, the better. Kontext excels at understanding detailed instructions and maintaining consistency. \n\n**TASK:**\nTransform the first image to a realistic accurate High quality top production cosplay style live-action stylized pushed proportions photoreal aesthetic, but be sure to push the proportions to improve the charcter likeness keep the composition, poses and costumes of the characters. Acurately describe the facial structure features and characteristics, haistyle, costume, accessories and props and pose of each character from the original picture in order to replace it with the matching gender portrait of the actor or actress provided. Transforming the image into the live action representation of the character. Make sure all the visual characteristic from the character in the original image are an accurately LIFELIKE portrayal of the character by the actor "
          },
          "class_type": "PromptManager"
      },
      "1055": {
          "_meta": {
              "title": "Display Text (LLMToolkit)"
          },
          "inputs": {
              "select": "0",
              "context": [
                  "1056",
                  0
              ],
              "Display_Text_3": "Transform the original stylized illustration into a photorealistic, high-quality, top-production cosplay-style live-action portrayal, accurately capturing the actor's facial structure with defined cheekbones, a strong jawline, and expressive blue eyes. Change the hairstyle to short, tousled, spiky blonde hair with natural highlights, complemented by a rugged beard and mustache. Preserve the character's iconic costume, including tactical dark headband flowing dramatically, detailed body harness with multiple utility pouches, muscular physique with pushed proportions, fingerless gloves, and combat boots, while maintaining the exact pose holding a pistol downward."
          },
          "class_type": "Display_Text"
      },
      "1056": {
          "_meta": {
              "title": "Generate Text Stream (LLMToolkit)"
          },
          "inputs": {
              "prompt": "Write a detailed description of a futuristic city.",
              "context": [
                  "1054",
                  0
              ],
              "llm_model": "gpt-4o-mini",
              "LLMToolkitTextGeneratorStream_response": "Transform the original stylized illustration into a photorealistic, high-quality, top-production cosplay-style live-action portrayal, accurately capturing the actor's facial structure with defined cheekbones, a strong jawline, and expressive blue eyes. Change the hairstyle to short, tousled, spiky blonde hair with natural highlights, complemented by a rugged beard and mustache. Preserve the character's iconic costume, including tactical dark headband flowing dramatically, detailed body harness with multiple utility pouches, muscular physique with pushed proportions, fingerless gloves, and combat boots, while maintaining the exact pose holding a pistol downward."
          },
          "class_type": "LLMToolkitTextGeneratorStream"
      },
      "1057": {
          "_meta": {
              "title": "Load Image"
          },
          "inputs": {
              "image": "SCENE_COUPLE_00001_ (1).png"
          },
          "class_type": "LoadImage"
      },
      "1058": {
          "_meta": {
              "title": "Load Image"
          },
          "inputs": {
              "image": "SCENE_COUPLE_00001_ (1).png"
          },
          "class_type": "LoadImage"
      },
      "1059": {
          "_meta": {
              "title": "External Seed (ComfyUI Deploy)"
          },
          "inputs": {
              "input_id": "input_seed",
              "max_value": 4294967295,
              "min_value": 1,
              "description": "For default value:\n\"-1\" (i.e. not in range): Randomize within the min and max value range. \nin range: Fixed, always the same value\n",
              "display_name": "",
              "default_value": -1
          },
          "class_type": "ComfyUIDeployExternalSeed"
      },
      "1065": {
          "_meta": {
              "title": "Create Video"
          },
          "inputs": {
              "fps": [
                  "1068",
                  0
              ],
              "images": [
                  "793",
                  0
              ]
          },
          "class_type": "CreateVideo"
      },
      "1066": {
          "_meta": {
              "title": "Save Video"
          },
          "inputs": {
              "codec": "auto",
              "video": [
                  "1065",
                  0
              ],
              "format": "auto",
              "video-preview": "",
              "filename_prefix": "video/Kling_fal_"
          },
          "class_type": "SaveVideo"
      },
      "1068": {
          "_meta": {
              "title": "Video Info 🎥🅥🅗🅢"
          },
          "inputs": {
              "video_info": [
                  "793",
                  3
              ]
          },
          "class_type": "VHS_VideoInfo"
      },
      "1072": {
          "_meta": {
              "title": "External Enum"
          },
          "inputs": {
              "options": "[\"16:9\",\"9:16\",\"1:1\"]",
              "input_id": "aspect_ratio",
              "description": "",
              "display_name": "",
              "default_value": "9:16"
          },
          "class_type": "ComfyUIDeployExternalEnum"
      }
  },
  "environment": {
      "comfyui_version": "094306b626e9cf505690c5d8b445032b3b8a36fa",
      "gpu": "L40S",
      "docker_command_steps": {
          "steps": [
              {
                  "id": "d8665947-0",
                  "data": "FROM nvidia/cuda:12.8.1-cudnn-devel-ubuntu24.04\nENV TORCH_CUDA_ARCH_LIST=8.9",
                  "type": "commands"
              },
              {
                  "id": "b68a6f5d-d-ubuntu24",
                  "data": "RUN apt-get update && \\\n    apt-get install -yq --no-install-recommends \\\n    build-essential \\\n    git \\\n    git-lfs \\\n    curl \\\n    ninja-build \\\n    ffmpeg \\\n    poppler-utils \\\n    aria2 \\\n    python3-dev \\\n    python3-pip \\\n    software-properties-common \\\n    && apt-get clean \\\n    && rm -rf /var/lib/apt/lists/*\n\nRUN pip3 install --upgrade pip setuptools wheel",
                  "type": "commands"
              },
              {
                  "id": "0e80dd22-9",
                  "data": "ENV CUDA_HOME=/usr/local/cuda\nENV PATH=${CUDA_HOME}/bin:${PATH}\nENV LD_LIBRARY_PATH=${CUDA_HOME}/lib64:${LD_LIBRARY_PATH}\nENV CUDA_LAUNCH_BLOCKING=1\nENV TORCH_USE_CUDA_DSA=1\n\nRUN if [ -d \"/usr/local/cuda-12.8\" ]; then \\\n      echo \"Linking libraries from /usr/local/cuda-12.8\" && \\\n      ln -sf /usr/local/cuda-12.8/targets/x86_64-linux/lib/libcudart.so /usr/lib/libcudart.so && \\\n      ln -sf /usr/local/cuda-12.8/targets/x86_64-linux/lib/libcublas.so /usr/lib/libcublas.so && \\\n      ln -sf /usr/local/cuda-12.8/targets/x86_64-linux/lib/libcublasLt.so /usr/lib/libcublasLt.so && \\\n      ln -sf /usr/local/cuda-12.8/targets/x86_64-linux/lib/libcufft.so /usr/lib/libcufft.so && \\\n      ln -sf /usr/local/cuda-12.8/targets/x86_64-linux/lib/libnvrtc.so /usr/lib/libnvrtc.so; \\\n    elif [ -d \"/usr/local/cuda\" ]; then \\\n      echo \"Linking libraries from /usr/local/cuda\" && \\\n      ln -sf /usr/local/cuda/targets/x86_64-linux/lib/libcudart.so /usr/lib/libcudart.so && \\\n      ln -sf /usr/local/cuda/targets/x86_64-linux/lib/libcublas.so /usr/lib/libcublas.so && \\\n      ln -sf /usr/local/cuda/targets/x86_64-linux/lib/libcublasLt.so /usr/lib/libcublasLt.so && \\\n      ln -sf /usr/local/cuda/targets/x86_64-linux/lib/libcufft.so /usr/lib/libcufft.so && \\\n      ln -sf /usr/local/cuda/targets/x86_64-linux/lib/libnvrtc.so /usr/lib/libnvrtc.so; \\\n    else \\\n      echo \"Warning: Could not find CUDA directory for symlinking.\" ; \\\n    fi",
                  "type": "commands"
              },
              {
                  "id": "a53fb461-1",
                  "data": "RUN pip install --pre -U xformers torch torchvision torchaudio --index-url https://download.pytorch.org/whl/nightly/cu128",
                  "type": "commands"
              },
              {
                  "id": "triton-install",
                  "data": "\n#install\nRUN pip install triton\nRUN pip install sageattention\nRUN pip install https://huggingface.co/impactframes/linux_whl/resolve/main/flash_attn-2.7.4%2Bcu128torch2.7-cp312-cp312-linux_x86_64.whl",
                  "type": "commands"
              },
              {
                  "id": "bnb-env-setup",
                  "data": "ENV BNB_CUDA_VERSION=128\nENV USE_COMPILE_API=1\nENV CUDA_VISIBLE_DEVICES=0",
                  "type": "commands"
              },
              {
                  "id": "verify-core",
                  "data": "RUN python3 -c \"import torch; print('PyTorch version:', torch.__version__); print('CUDA available:', torch.cuda.is_available()); print('CUDA version:', torch.version.cuda)\"",
                  "type": "commands"
              },
              {
                  "id": "verify-bnb",
                  "data": "RUN python3 -c \"import bitsandbytes as bnb; print('BitsAndBytes version:', bnb.__version__)\" || echo \"BitsAndBytes import check complete\"",
                  "type": "commands"
              },
              {
                  "id": "533a2849-7",
                  "data": {
                      "url": "https://github.com/asagi4/ComfyUI-Adaptive-Guidance",
                      "hash": "181641ca04ac524992f40e8717f5da01eb82ea79",
                      "meta": {
                          "message": "v0.4.0",
                          "committer": {
                              "date": "2025-05-03T18:12:06.000Z",
                              "name": "asagi4",
                              "email": "130366179+asagi4@users.noreply.github.com"
                          },
                          "commit_url": "https://github.com/asagi4/ComfyUI-Adaptive-Guidance/commit/181641ca04ac524992f40e8717f5da01eb82ea79",
                          "latest_hash": "181641ca04ac524992f40e8717f5da01eb82ea79",
                          "stargazers_count": 54
                      },
                      "name": "Adaptive Guidance for ComfyUI",
                      "files": [
                          "https://github.com/asagi4/ComfyUI-Adaptive-Guidance"
                      ],
                      "install_type": "git-clone"
                  },
                  "type": "custom-node"
              },
              {
                  "id": "53edc153-0",
                  "data": {
                      "url": "https://github.com/Derfuu/Derfuu_ComfyUI_ModdedNodes",
                      "hash": "d0905bed31249f2bd0814c67585cf4fe3c77c015",
                      "meta": {
                          "message": "update version to 1.0.1",
                          "committer": {
                              "date": "2024-06-22T02:09:21.000Z",
                              "name": "Derfuu",
                              "email": "qwesterseven@yandex.ru"
                          },
                          "commit_url": "https://github.com/Derfuu/Derfuu_ComfyUI_ModdedNodes/commit/d0905bed31249f2bd0814c67585cf4fe3c77c015",
                          "latest_hash": "d0905bed31249f2bd0814c67585cf4fe3c77c015",
                          "stargazers_count": 406
                      },
                      "name": "Derfuu_ComfyUI_ModdedNodes",
                      "files": [],
                      "install_type": "git-clone"
                  },
                  "type": "custom-node"
              },
              {
                  "id": "e4db9694-1",
                  "data": {
                      "url": "https://github.com/city96/ComfyUI-GGUF",
                      "hash": "a2b75978fd50c0227a58316619b79d525b88e570",
                      "meta": {
                          "message": "Create pyproject.toml",
                          "committer": {
                              "date": "2025-05-08T23:08:35.000Z",
                              "name": "City",
                              "email": "125218114+city96@users.noreply.github.com"
                          },
                          "commit_url": "https://github.com/city96/ComfyUI-GGUF/commit/a2b75978fd50c0227a58316619b79d525b88e570",
                          "latest_hash": "a2b75978fd50c0227a58316619b79d525b88e570",
                          "stargazers_count": 1967
                      },
                      "name": "ComfyUI-GGUF",
                      "files": [
                          "https://github.com/city96/ComfyUI-GGUF"
                      ],
                      "install_type": "git-clone"
                  },
                  "type": "custom-node"
              },
              {
                  "id": "cfbe791a-9",
                  "data": {
                      "url": "https://github.com/pollockjj/ComfyUI-MultiGPU",
                      "hash": "a05823ff0a5296332ae478b18ab93b46cd996a44",
                      "meta": {
                          "message": "feat: add CLIPVisionLoaderMultiGPU support and update version to 1.7.3",
                          "committer": {
                              "date": "2025-04-17T23:43:01.000Z",
                              "name": "John Pollock",
                              "email": "pollockjj@gmail.com"
                          },
                          "commit_url": "https://github.com/pollockjj/ComfyUI-MultiGPU/commit/a05823ff0a5296332ae478b18ab93b46cd996a44",
                          "latest_hash": "a05823ff0a5296332ae478b18ab93b46cd996a44",
                          "stargazers_count": 265
                      },
                      "name": "ComfyUI-MultiGPU",
                      "files": [
                          "https://github.com/pollockjj/ComfyUI-MultiGPU"
                      ],
                      "install_type": "git-clone"
                  },
                  "type": "custom-node"
              },
              {
                  "id": "f930aea2-6",
                  "data": {
                      "url": "https://github.com/ltdrdata/ComfyUI-Impact-Pack",
                      "hash": "f8e16df2be0ed2ce914ddd242ef9eadfa386bc2f",
                      "meta": {
                          "message": "bump version",
                          "committer": {
                              "date": "2025-05-18T23:33:30.000Z",
                              "name": "Dr.Lt.Data",
                              "email": "dr.lt.data@gmail.com"
                          },
                          "commit_url": "https://github.com/ltdrdata/ComfyUI-Impact-Pack/commit/f8e16df2be0ed2ce914ddd242ef9eadfa386bc2f",
                          "latest_hash": "f8e16df2be0ed2ce914ddd242ef9eadfa386bc2f",
                          "stargazers_count": 2408
                      },
                      "name": "ComfyUI Impact Pack",
                      "files": [],
                      "install_type": "git-clone"
                  },
                  "type": "custom-node"
              },
              {
                  "id": "07920695-3",
                  "data": {
                      "url": "https://github.com/zackabrams/ComfyUI-MagicWan.git",
                      "hash": "c2939fd7d7af71a2c4130b2a511cf2c668f4cf3a",
                      "meta": {
                          "message": "Update README.md",
                          "committer": {
                              "date": "2025-02-28T16:08:19.000Z",
                              "name": "GitHub",
                              "email": "noreply@github.com"
                          },
                          "commit_url": "https://github.com/zackabrams/ComfyUI-MagicWan/commit/c2939fd7d7af71a2c4130b2a511cf2c668f4cf3a",
                          "latest_hash": "c2939fd7d7af71a2c4130b2a511cf2c668f4cf3a",
                          "stargazers_count": 53
                      },
                      "name": "ComfyUI-MagicWan.git",
                      "files": [
                          "https://github.com/zackabrams/ComfyUI-MagicWan.git"
                      ],
                      "install_type": "git-clone"
                  },
                  "type": "custom-node"
              },
              {
                  "id": "e5988147-9",
                  "data": {
                      "url": "https://github.com/tinhalo/ComfyUI-Video-Matting-RMBG2.git",
                      "hash": "5faaae226aa3098a2b07cbc645c363cdd4ca3c3e",
                      "meta": {
                          "message": "Saved other changes",
                          "committer": {
                              "date": "2025-03-05T02:55:35.000Z",
                              "name": "Steven Altsman",
                              "email": "manchuwook@tinhalo.com"
                          },
                          "commit_url": "https://github.com/tinhalo/ComfyUI-Video-Matting-RMBG2/commit/5faaae226aa3098a2b07cbc645c363cdd4ca3c3e",
                          "latest_hash": "5faaae226aa3098a2b07cbc645c363cdd4ca3c3e",
                          "stargazers_count": 20
                      },
                      "name": "ComfyUI-Video-Matting-RMBG2.git",
                      "files": [
                          "https://github.com/tinhalo/ComfyUI-Video-Matting-RMBG2.git"
                      ],
                      "install_type": "git-clone"
                  },
                  "type": "custom-node"
              },
              {
                  "id": "4eadff3a-4",
                  "data": {
                      "url": "https://github.com/logtd/ComfyUI-HunyuanLoom.git",
                      "hash": "f5816c43788f006de0f3838e5e88c6cb66c5d054",
                      "meta": {
                          "message": "Merge pull request #22 from kijai/main\n\nsupport I2V",
                          "committer": {
                              "date": "2025-02-21T21:01:57.000Z",
                              "name": "GitHub",
                              "email": "noreply@github.com"
                          },
                          "commit_url": "https://github.com/logtd/ComfyUI-HunyuanLoom/commit/f5816c43788f006de0f3838e5e88c6cb66c5d054",
                          "latest_hash": "f5816c43788f006de0f3838e5e88c6cb66c5d054",
                          "stargazers_count": 464
                      },
                      "name": "ComfyUI-HunyuanLoom.git",
                      "files": [
                          "https://github.com/logtd/ComfyUI-HunyuanLoom.git"
                      ],
                      "install_type": "git-clone"
                  },
                  "type": "custom-node"
              },
              {
                  "id": "3ce8fa91-3",
                  "data": {
                      "url": "https://github.com/jamesWalker55/comfyui-various",
                      "hash": "5bd85aaf7616878471469c4ec7e11bbd0cef3bf2",
                      "meta": {
                          "message": "New experimental sound module",
                          "committer": {
                              "date": "2025-02-27T11:01:47.000Z",
                              "name": "James Walker",
                              "email": "james.chunho@gmail.com"
                          },
                          "commit_url": "https://github.com/jamesWalker55/comfyui-various/commit/5bd85aaf7616878471469c4ec7e11bbd0cef3bf2",
                          "latest_hash": "5bd85aaf7616878471469c4ec7e11bbd0cef3bf2",
                          "stargazers_count": 98
                      },
                      "name": "Various ComfyUI Nodes by Type",
                      "files": [],
                      "install_type": "git-clone"
                  },
                  "type": "custom-node"
              },
              {
                  "id": "87d04892-4",
                  "data": {
                      "url": "https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite",
                      "hash": "a7ce59e381934733bfae03b1be029756d6ce936d",
                      "meta": {
                          "message": "Fix Use Everywhere compatibility",
                          "committer": {
                              "date": "2025-04-26T20:27:20.000Z",
                              "name": "AustinMroz",
                              "email": "austinmroz@utexas.edu"
                          },
                          "commit_url": "https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite/commit/a7ce59e381934733bfae03b1be029756d6ce936d",
                          "latest_hash": "a7ce59e381934733bfae03b1be029756d6ce936d",
                          "stargazers_count": 1000
                      },
                      "name": "ComfyUI-VideoHelperSuite",
                      "files": [],
                      "install_type": "git-clone"
                  },
                  "type": "custom-node"
              },
              {
                  "id": "d1780483-6",
                  "data": {
                      "url": "https://github.com/kijai/ComfyUI-KJNodes",
                      "hash": "44565e9bffc89de454d06b4abe08137d1247652a",
                      "meta": {
                          "message": " Add choice of device for imageresize",
                          "committer": {
                              "date": "2025-05-20T13:50:55.000Z",
                              "name": "kijai",
                              "email": "40791699+kijai@users.noreply.github.com"
                          },
                          "commit_url": "https://github.com/kijai/ComfyUI-KJNodes/commit/44565e9bffc89de454d06b4abe08137d1247652a",
                          "latest_hash": "44565e9bffc89de454d06b4abe08137d1247652a",
                          "stargazers_count": 1362
                      },
                      "name": "KJNodes for ComfyUI",
                      "files": [],
                      "install_type": "git-clone"
                  },
                  "type": "custom-node"
              },
              {
                  "id": "85df8805-8",
                  "data": {
                      "url": "https://github.com/rgthree/rgthree-comfy",
                      "hash": "5288408220180af41ce50b0d29135e1ef5f83fdb",
                      "meta": {
                          "message": "Save the Display Any response to the pnginfo so it pre-exists when reloading the workflow.",
                          "committer": {
                              "date": "2025-05-19T03:59:31.000Z",
                              "name": "rgthree",
                              "email": "regis.gaughan@gmail.com"
                          },
                          "commit_url": "https://github.com/rgthree/rgthree-comfy/commit/5288408220180af41ce50b0d29135e1ef5f83fdb",
                          "latest_hash": "5288408220180af41ce50b0d29135e1ef5f83fdb",
                          "stargazers_count": 1880
                      },
                      "name": "rgthree's ComfyUI Nodes",
                      "files": [],
                      "install_type": "git-clone"
                  },
                  "type": "custom-node"
              },
              {
                  "id": "b0ca903d-8",
                  "data": {
                      "url": "https://github.com/Fannovel16/comfyui_controlnet_aux",
                      "hash": "83463c2e4b04e729268e57f638b4212e0da4badc",
                      "meta": {
                          "message": "Merge some PR, bump version",
                          "committer": {
                              "date": "2025-03-11T20:05:02.000Z",
                              "name": "GitHub",
                              "email": "noreply@github.com"
                          },
                          "commit_url": "https://github.com/Fannovel16/comfyui_controlnet_aux/commit/83463c2e4b04e729268e57f638b4212e0da4badc",
                          "latest_hash": "83463c2e4b04e729268e57f638b4212e0da4badc",
                          "stargazers_count": 2988
                      },
                      "name": "ComfyUI's ControlNet Auxiliary Preprocessors",
                      "files": [],
                      "install_type": "git-clone"
                  },
                  "type": "custom-node"
              },
              {
                  "id": "20340f1b-3",
                  "data": {
                      "url": "https://github.com/Suzie1/ComfyUI_Comfyroll_CustomNodes",
                      "hash": "d78b780ae43fcf8c6b7c6505e6ffb4584281ceca",
                      "meta": {
                          "message": "version 1.76",
                          "committer": {
                              "date": "2024-01-24T22:44:09.000Z",
                              "name": "Suzie1",
                              "email": "7.lyssa@gmail.com"
                          },
                          "commit_url": "https://github.com/Suzie1/ComfyUI_Comfyroll_CustomNodes/commit/d78b780ae43fcf8c6b7c6505e6ffb4584281ceca",
                          "latest_hash": "d78b780ae43fcf8c6b7c6505e6ffb4584281ceca",
                          "stargazers_count": 884
                      },
                      "name": "Comfyroll Studio",
                      "files": [],
                      "install_type": "git-clone"
                  },
                  "type": "custom-node"
              },
              {
                  "id": "e64348a2-d",
                  "data": {
                      "url": "https://github.com/Fannovel16/ComfyUI-Frame-Interpolation",
                      "hash": "a969c01dbccd9e5510641be04eb51fe93f6bfc3d",
                      "meta": {
                          "message": "Update pyproject.toml",
                          "committer": {
                              "date": "2025-04-30T11:32:27.000Z",
                              "name": "GitHub",
                              "email": "noreply@github.com"
                          },
                          "commit_url": "https://github.com/Fannovel16/ComfyUI-Frame-Interpolation/commit/a969c01dbccd9e5510641be04eb51fe93f6bfc3d",
                          "latest_hash": "a969c01dbccd9e5510641be04eb51fe93f6bfc3d",
                          "stargazers_count": 699
                      },
                      "name": "ComfyUI Frame Interpolation",
                      "files": [],
                      "install_type": "git-clone"
                  },
                  "type": "custom-node"
              },
              {
                  "id": "8125cb76-b",
                  "data": {
                      "url": "https://github.com/if-ai/ComfyUI-IF_VideoPrompts",
                      "hash": "7d5d9ac7eef24d92ad6e1be0d17134823dd079b2",
                      "meta": {
                          "message": "Rename CD_WAN_VACE-1.jpg to CD_WAN_VACE.jpg",
                          "committer": {
                              "date": "2025-04-02T17:19:27.000Z",
                              "name": "GitHub",
                              "email": "noreply@github.com"
                          },
                          "commit_url": "https://github.com/if-ai/ComfyUI-IF_VideoPrompts/commit/7d5d9ac7eef24d92ad6e1be0d17134823dd079b2",
                          "latest_hash": "7d5d9ac7eef24d92ad6e1be0d17134823dd079b2",
                          "stargazers_count": 44
                      },
                      "name": "IF_VideoPrompts",
                      "files": [],
                      "install_type": "git-clone"
                  },
                  "type": "custom-node"
              },
              {
                  "id": "eefe3adf-e",
                  "data": {
                      "url": "https://github.com/kijai/ComfyUI-DepthAnythingV2",
                      "hash": "9d7cb8c1e53b01744a75b599d3e91c93464a2d33",
                      "meta": {
                          "message": "Merge pull request #23 from sparkleMing/fix/da_model_referenced_before_assignment\n\nfix Local variable 'da_model' might be referenced before assignment",
                          "committer": {
                              "date": "2025-03-06T12:01:52.000Z",
                              "name": "GitHub",
                              "email": "noreply@github.com"
                          },
                          "commit_url": "https://github.com/kijai/ComfyUI-DepthAnythingV2/commit/9d7cb8c1e53b01744a75b599d3e91c93464a2d33",
                          "latest_hash": "9d7cb8c1e53b01744a75b599d3e91c93464a2d33",
                          "stargazers_count": 305
                      },
                      "name": "ComfyUI-DepthAnythingV2",
                      "files": [
                          "https://github.com/kijai/ComfyUI-DepthAnythingV2"
                      ],
                      "install_type": "git-clone"
                  },
                  "type": "custom-node"
              },
              {
                  "id": "7e9b622f-9",
                  "data": {
                      "url": "https://github.com/kijai/ComfyUI-WanVideoWrapper.git",
                      "hash": "a290f75b5eba130f544f7e1ad377fb12e7afea38",
                      "meta": {
                          "message": "Update model.py",
                          "committer": {
                              "date": "2025-06-05T20:41:17.000Z",
                              "name": "kijai",
                              "email": "40791699+kijai@users.noreply.github.com"
                          },
                          "commit_url": "https://github.com/kijai/ComfyUI-WanVideoWrapper/commit/a290f75b5eba130f544f7e1ad377fb12e7afea38",
                          "latest_hash": "a290f75b5eba130f544f7e1ad377fb12e7afea38",
                          "stargazers_count": 2761
                      },
                      "name": "ComfyUI-WanVideoWrapper.git",
                      "files": [
                          "https://github.com/kijai/ComfyUI-WanVideoWrapper.git"
                      ],
                      "install_type": "git-clone"
                  },
                  "type": "custom-node"
              },
              {
                  "id": "0a184a14-f",
                  "data": {
                      "url": "https://github.com/if-ai/ComfyUI-IF_Gemini.git",
                      "hash": "fe0813b1102c99b3b704a0695249a4bc2e1cb47e",
                      "meta": {
                          "message": "Update pyproject.toml",
                          "committer": {
                              "date": "2025-04-14T06:27:01.000Z",
                              "name": "GitHub",
                              "email": "noreply@github.com"
                          },
                          "commit_url": "https://github.com/if-ai/ComfyUI-IF_Gemini/commit/fe0813b1102c99b3b704a0695249a4bc2e1cb47e",
                          "latest_hash": "fe0813b1102c99b3b704a0695249a4bc2e1cb47e",
                          "stargazers_count": 26
                      },
                      "name": "ComfyUI-IF_Gemini.git",
                      "files": [
                          "https://github.com/if-ai/ComfyUI-IF_Gemini.git"
                      ],
                      "install_type": "git-clone"
                  },
                  "type": "custom-node"
              },
              {
                  "id": "3dd0933a-1",
                  "data": {
                      "url": "https://github.com/1038lab/ComfyUI-RMBG",
                      "hash": "daf0b01deb1c529dfb543093bba2ed586aad7886",
                      "meta": {
                          "message": "Update README.md",
                          "committer": {
                              "date": "2025-05-15T21:42:10.000Z",
                              "name": "GitHub",
                              "email": "noreply@github.com"
                          },
                          "commit_url": "https://github.com/1038lab/ComfyUI-RMBG/commit/daf0b01deb1c529dfb543093bba2ed586aad7886",
                          "latest_hash": "daf0b01deb1c529dfb543093bba2ed586aad7886",
                          "stargazers_count": 967
                      },
                      "name": "ComfyUI-RMBG",
                      "files": [],
                      "install_type": "git-clone"
                  },
                  "type": "custom-node"
              },
              {
                  "id": "bc7ff55a-b",
                  "data": {
                      "url": "https://github.com/M1kep/ComfyLiterals",
                      "hash": "bdddb08ca82d90d75d97b1d437a652e0284a32ac",
                      "meta": {
                          "message": "fix: Add custom name for \"String\" literal to avoid conflicts",
                          "committer": {
                              "date": "2023-11-20T01:08:18.000Z",
                              "name": "Michael Poutre",
                              "email": "m1kep.my.mail@gmail.com"
                          },
                          "commit_url": "https://github.com/M1kep/ComfyLiterals/commit/bdddb08ca82d90d75d97b1d437a652e0284a32ac",
                          "latest_hash": "bdddb08ca82d90d75d97b1d437a652e0284a32ac",
                          "stargazers_count": 46
                      },
                      "name": "ComfyLiterals",
                      "files": [],
                      "install_type": "git-clone"
                  },
                  "type": "custom-node"
              },
              {
                  "id": "f0222efc-e",
                  "data": {
                      "url": "https://github.com/pythongosssss/ComfyUI-Custom-Scripts",
                      "hash": "aac13aa7ce35b07d43633c3bbe654a38c00d74f5",
                      "meta": {
                          "message": "Update pyproject.toml",
                          "committer": {
                              "date": "2025-04-30T12:00:09.000Z",
                              "name": "GitHub",
                              "email": "noreply@github.com"
                          },
                          "commit_url": "https://github.com/pythongosssss/ComfyUI-Custom-Scripts/commit/aac13aa7ce35b07d43633c3bbe654a38c00d74f5",
                          "latest_hash": "aac13aa7ce35b07d43633c3bbe654a38c00d74f5",
                          "stargazers_count": 2421
                      },
                      "name": "ComfyUI-Custom-Scripts",
                      "files": [],
                      "install_type": "git-clone"
                  },
                  "type": "custom-node"
              },
              {
                  "id": "657a0ec1-f",
                  "data": {
                      "url": "https://github.com/facok/ComfyUI-HunyuanVideoMultiLora",
                      "hash": "9e18b9793f2937093fdde464af9ef0e07423d747",
                      "meta": {
                          "message": "Merge pull request #18 from ComfyNodePRs/update-publish-yaml\n\nUpdate Github Action for Publishing to Comfy Registry",
                          "committer": {
                              "date": "2025-05-13T18:34:59.000Z",
                              "name": "GitHub",
                              "email": "noreply@github.com"
                          },
                          "commit_url": "https://github.com/facok/ComfyUI-HunyuanVideoMultiLora/commit/9e18b9793f2937093fdde464af9ef0e07423d747",
                          "latest_hash": "9e18b9793f2937093fdde464af9ef0e07423d747",
                          "stargazers_count": 112
                      },
                      "name": "ComfyUI-HunyuanVideoMultiLora",
                      "files": [],
                      "install_type": "git-clone"
                  },
                  "type": "custom-node"
              },
              {
                  "id": "bf80e067-a",
                  "data": {
                      "url": "https://github.com/chflame163/ComfyUI_LayerStyle",
                      "hash": "a46b1e6d26d45be9784c49f7065ba44700ef2b63",
                      "meta": {
                          "message": "update readme images",
                          "committer": {
                              "date": "2025-05-17T12:58:01.000Z",
                              "name": "chflame163",
                              "email": "chflame@163.com"
                          },
                          "commit_url": "https://github.com/chflame163/ComfyUI_LayerStyle/commit/a46b1e6d26d45be9784c49f7065ba44700ef2b63",
                          "latest_hash": "a46b1e6d26d45be9784c49f7065ba44700ef2b63",
                          "stargazers_count": 2258
                      },
                      "name": "ComfyUI Layer Style",
                      "files": [],
                      "install_type": "git-clone"
                  },
                  "type": "custom-node"
              },
              {
                  "id": "4ab30b1c-4",
                  "data": {
                      "url": "https://github.com/cubiq/ComfyUI_essentials",
                      "hash": "9d9f4bedfc9f0321c19faf71855e228c93bd0dc9",
                      "meta": {
                          "message": "maintenance mode",
                          "committer": {
                              "date": "2025-04-14T07:33:21.000Z",
                              "name": "cubiq",
                              "email": "matteo@elf.io"
                          },
                          "commit_url": "https://github.com/cubiq/ComfyUI_essentials/commit/9d9f4bedfc9f0321c19faf71855e228c93bd0dc9",
                          "latest_hash": "9d9f4bedfc9f0321c19faf71855e228c93bd0dc9",
                          "stargazers_count": 836
                      },
                      "name": "ComfyUI Essentials",
                      "files": [],
                      "install_type": "git-clone"
                  },
                  "type": "custom-node"
              },
              {
                  "id": "4f0ca4aa-3",
                  "data": {
                      "url": "https://github.com/kijai/ComfyUI-GIMM-VFI",
                      "hash": "aa2aa75229f740a853e844f38f97f21bff9a2f65",
                      "meta": {
                          "message": "Update nodes.py",
                          "committer": {
                              "date": "2025-05-10T18:09:39.000Z",
                              "name": "kijai",
                              "email": "40791699+kijai@users.noreply.github.com"
                          },
                          "commit_url": "https://github.com/kijai/ComfyUI-GIMM-VFI/commit/aa2aa75229f740a853e844f38f97f21bff9a2f65",
                          "latest_hash": "aa2aa75229f740a853e844f38f97f21bff9a2f65",
                          "stargazers_count": 307
                      },
                      "name": "ComfyUI-GIMM-VFI",
                      "files": [],
                      "install_type": "git-clone"
                  },
                  "type": "custom-node"
              },
              {
                  "id": "8bfd5b9e-6",
                  "data": {
                      "url": "https://github.com/sipherxyz/comfyui-art-venture",
                      "hash": "fc00f4a094be1ba41d6c7bfcc157fb075d289573",
                      "meta": {
                          "message": "fix(web): error when redefine value property",
                          "committer": {
                              "date": "2025-04-15T08:23:05.000Z",
                              "name": "Tung Nguyen",
                              "email": "tung.nguyen@atherlabs.com"
                          },
                          "commit_url": "https://github.com/sipherxyz/comfyui-art-venture/commit/fc00f4a094be1ba41d6c7bfcc157fb075d289573",
                          "latest_hash": "fc00f4a094be1ba41d6c7bfcc157fb075d289573",
                          "stargazers_count": 253
                      },
                      "name": "comfyui-art-venture",
                      "files": [],
                      "install_type": "git-clone"
                  },
                  "type": "custom-node"
              },
              {
                  "id": "ffe77db4-f",
                  "data": {
                      "url": "https://github.com/comfy-deploy/comfyui-llm-toolkit",
                      "hash": "2a2c99c46431b75ea4feef79ca2fe817c39c9cc3",
                      "meta": {
                          "message": "Delete comfy-nodes/.DS_Store",
                          "committer": {
                              "date": "2025-05-31T10:41:34.000Z",
                              "name": "GitHub",
                              "email": "noreply@github.com"
                          },
                          "commit_url": "https://github.com/comfy-deploy/comfyui-llm-toolkit/commit/2a2c99c46431b75ea4feef79ca2fe817c39c9cc3",
                          "latest_hash": "2a2c99c46431b75ea4feef79ca2fe817c39c9cc3",
                          "stargazers_count": 17
                      },
                      "name": "ComfyUI LLM Toolkit",
                      "files": [],
                      "install_type": "git-clone"
                  },
                  "type": "custom-node"
              },
              {
                  "id": "02f02326-3",
                  "data": "WORKDIR /comfyui/custom_nodes\n\n# 1) Clone & install the ReActor node\nRUN git clone --recursive https://github.com/if-ai/ComfyUI-ReActor.git && \\\n    cd ComfyUI-ReActor && \\\n    if [ -f install.py ]; then \\\n      python install.py || echo 'install script failed'; \\\n    fi\n\n",
                  "type": "commands"
              },
              {
                  "id": "b8dba08e-c",
                  "data": "RUN pip3 install --no-cache-dir \\\n    albumentations \\\n    https://huggingface.co/AlienMachineAI/insightface-0.7.3-cp312-cp312-linux_x86_64.whl/resolve/main/insightface-0.7.3-cp312-cp312-linux_x86_64.whl \\\n    onnx \\\n    opencv-python \\\n    numpy \\\n    segment_anything \\\n    ultralytics",
                  "type": "commands"
              },
              {
                  "id": "e04ab4e0-7",
                  "data": {
                      "url": "https://github.com/Lightricks/ComfyUI-LTXVideo",
                      "hash": "6e9e6de05624b0aab09b81a2f4a5f473fa97988a",
                      "meta": {
                          "message": "Merge pull request #221 from Lightricks/pr-2025-05-14\n\nUpdate ComfyUI-LTXVideo - 2025-05-14",
                          "committer": {
                              "date": "2025-05-14T17:11:59.000Z",
                              "name": "GitHub",
                              "email": "noreply@github.com"
                          },
                          "commit_url": "https://github.com/Lightricks/ComfyUI-LTXVideo/commit/6e9e6de05624b0aab09b81a2f4a5f473fa97988a",
                          "latest_hash": "6e9e6de05624b0aab09b81a2f4a5f473fa97988a",
                          "stargazers_count": 1993
                      },
                      "name": "ComfyUI-LTXVideo",
                      "files": [],
                      "install_type": "git-clone"
                  },
                  "type": "custom-node"
              },
              {
                  "id": "f7212c32-7",
                  "data": {
                      "url": "https://github.com/ToTheBeginning/ComfyUI-DreamO.git",
                      "hash": "c72fefe2f58f545736eaf63394c21a7c4caaa7c1",
                      "meta": {
                          "message": "update requirements",
                          "committer": {
                              "date": "2025-05-30T12:47:34.000Z",
                              "name": "邬彦泽",
                              "email": "wuyanze.cs@bytedance.com"
                          },
                          "latest_hash": "c72fefe2f58f545736eaf63394c21a7c4caaa7c1"
                      },
                      "name": "ComfyUI-DreamO.git",
                      "files": [
                          "https://github.com/ToTheBeginning/ComfyUI-DreamO.git"
                      ],
                      "install_type": "git-clone"
                  },
                  "type": "custom-node"
              },
              {
                  "id": "23458970-d",
                  "data": {
                      "url": "https://github.com/toyxyz/ComfyUI_pose_inter.git",
                      "hash": "cf91263331a11e7489af510be1cddbe0707fa0c4",
                      "meta": {
                          "message": "Update README.md",
                          "committer": {
                              "date": "2025-05-30T15:21:46.000Z",
                              "name": "GitHub",
                              "email": "noreply@github.com"
                          },
                          "latest_hash": "cf91263331a11e7489af510be1cddbe0707fa0c4"
                      },
                      "name": "ComfyUI_pose_inter.git",
                      "files": [
                          "https://github.com/toyxyz/ComfyUI_pose_inter.git"
                      ],
                      "install_type": "git-clone"
                  },
                  "type": "custom-node"
              },
              {
                  "id": "bd11242a-1",
                  "data": {
                      "url": "https://github.com/LAOGOU-666/Comfyui_LG_Tools.git",
                      "hash": "8cf32f0eed017dffc2f7cc1e1e27a1765bf77f6d",
                      "meta": {
                          "message": "fix bug",
                          "committer": {
                              "date": "2025-06-01T08:29:55.000Z",
                              "name": "LAOGOU-666",
                              "email": "441059767@qq.com"
                          },
                          "latest_hash": "8cf32f0eed017dffc2f7cc1e1e27a1765bf77f6d"
                      },
                      "name": "Comfyui_LG_Tools.git",
                      "files": [
                          "https://github.com/LAOGOU-666/Comfyui_LG_Tools.git"
                      ],
                      "install_type": "git-clone"
                  },
                  "type": "custom-node"
              },
              {
                  "id": "06915687-8",
                  "data": {
                      "url": "https://github.com/gokayfem/ComfyUI-fal-API",
                      "hash": "1e561ac944d5a2fd2df870d38e3752f41da62c25",
                      "meta": {
                          "message": "Update pyproject.toml",
                          "committer": {
                              "date": "2025-06-02T17:39:18.000Z",
                              "name": "GitHub",
                              "email": "noreply@github.com"
                          },
                          "commit_url": "https://github.com/gokayfem/ComfyUI-fal-API/commit/1e561ac944d5a2fd2df870d38e3752f41da62c25",
                          "latest_hash": "1e561ac944d5a2fd2df870d38e3752f41da62c25",
                          "stargazers_count": 132
                      },
                      "name": "ComfyUI-fal-API",
                      "files": [],
                      "install_type": "git-clone"
                  },
                  "type": "custom-node"
              },
              {
                  "id": "799e29d3-a",
                  "data": {
                      "url": "https://github.com/BigStationW/ComfyUi-WanVaceToVideoAdvanced.git",
                      "hash": "360ef748149a125bff3d91dce39abf5e4844015a",
                      "meta": {
                          "message": "Update README.md",
                          "committer": {
                              "date": "2025-06-02T07:05:23.000Z",
                              "name": "GitHub",
                              "email": "noreply@github.com"
                          },
                          "commit_url": "https://github.com/BigStationW/ComfyUi-WanVaceToVideoAdvanced/commit/360ef748149a125bff3d91dce39abf5e4844015a",
                          "latest_hash": "360ef748149a125bff3d91dce39abf5e4844015a",
                          "stargazers_count": 24
                      },
                      "name": "ComfyUi-WanVaceToVideoAdvanced.git",
                      "files": [
                          "https://github.com/BigStationW/ComfyUi-WanVaceToVideoAdvanced.git"
                      ],
                      "install_type": "git-clone"
                  },
                  "type": "custom-node"
              },
              {
                  "id": "c2af7517-2",
                  "data": {
                      "url": "https://github.com/ClownsharkBatwing/RES4LYF.git",
                      "hash": "d527a0a8fd10622129bf0e7575a2e015e42a8c2e",
                      "meta": {
                          "message": "Add files via upload",
                          "committer": {
                              "date": "2025-06-04T02:44:33.000Z",
                              "name": "GitHub",
                              "email": "noreply@github.com"
                          },
                          "latest_hash": "d527a0a8fd10622129bf0e7575a2e015e42a8c2e"
                      },
                      "name": "RES4LYF.git",
                      "files": [
                          "https://github.com/ClownsharkBatwing/RES4LYF.git"
                      ],
                      "install_type": "git-clone"
                  },
                  "type": "custom-node"
              },
              {
                  "id": "comfyui-deploy",
                  "data": {
                      "url": "https://github.com/BennyKok/comfyui-deploy",
                      "hash": "f7e7eb19d099bf3c2a725711f067b7449d7f51db",
                      "name": "ComfyUI Deploy",
                      "files": [
                          "https://github.com/BennyKok/comfyui-deploy"
                      ],
                      "install_type": "git-clone"
                  },
                  "type": "custom-node"
              }
          ]
      },
      "max_containers": 2,
      "install_custom_node_with_gpu": false,
      "run_timeout": 300,
      "scaledown_window": 60,
      "extra_docker_commands": [],
      "base_docker_image": "nvidia/cuda:12.6.3-cudnn-devel-ubuntu22.04",
      "python_version": "3.12",
      "extra_args": null,
      "prestart_command": null,
      "min_containers": 0,
      "machine_hash": "147261453c4654b928d676ee961fa583bd94e50863374615e5b80d2b66e17804",
      "disable_metadata": true
  },
};

export const defaultWorkflowTemplates: defaultWorkflowTemplateType[] = [
  {
    workflowId: "sd1.5",
    workflowName: "Stable Diffusion v1.5",
    workflowDescription: "Text to image with sd 1.5 base model. ",
    workflowJson: JSON.stringify(sd1_5),
    workflowApi: JSON.stringify(sd1_5_api),
    workflowImageUrl:
      "https://comfy-deploy-output.s3.amazonaws.com/outputs/runs/ae92370b-315a-4578-af29-ed83b00828d1/ComfyUI_00001_.png",
  },
  {
    workflowId: "flux",
    workflowName: "Flux Dev [fp8]",
    workflowDescription:
      "Text to image with Flux model, most popular and stunning model.",
    workflowJson: JSON.stringify(workflow_json_flux),
    workflowImageUrl:
      "https://comfy-deploy-output.s3.amazonaws.com/outputs/runs/3ee76358-51c6-4c61-ba4d-49de5d1b8b82/ComfyUI_00002_.webp",
    hasEnvironment: true,
  },
  {
    workflowId: "hunyuan3d",
    workflowName: "Hunyuan 3D",
    workflowDescription: "Image to 3D generation with Hunyuan3D model.",
    workflowJson: JSON.stringify(workflow_json_hunyuan3d),
    workflowImageUrl:
      "https://comfy-deploy-output-dev.s3.us-east-2.amazonaws.com/assets/file_sCSjHLFXvgq6WtE7.glb",
    hasEnvironment: true,
  },
  {
    workflowId: "bagel",
    workflowName: "BAGEL",
    workflowDescription: "BAGEL workflow for text to image and image editing.",
    workflowJson: JSON.stringify(bagel_workflow),
    workflowImageUrl:
      "https://comfy-deploy-output.s3.us-east-2.amazonaws.com/outputs/runs/c2a15057-e13f-4297-bf9f-7d8b3b71ede0/ComfyUI_00009_.jpg",
    hasEnvironment: true,
  },
  {
    workflowId: "any-2-live-action-api-only",
    workflowName: "Any 2 Live Action API Only",
    workflowDescription: "ComfyUI Deploy workflow for creating live action versions of your favourite characters casting any actor you like photos and videos. This workflow is API only you need to provide your own API key under the machine secrets FAL_API and OPENAI_API_KEY ",
    workflowJson: JSON.stringify(any_2_live_action_api_only),
    workflowImageUrl:
      "https://comfy-deploy-output.s3.us-east-2.amazonaws.com/outputs/runs/bd0aba6e-d486-4c89-9536-9054193851bc/CAST_ACTRESS_IN_ROLE_00003_.png",
    hasEnvironment: true,
  },
];
