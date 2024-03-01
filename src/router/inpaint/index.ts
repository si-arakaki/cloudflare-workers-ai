import { Ai } from "@cloudflare/ai";

import { Router, RouterType } from "itty-router";
import { z } from "zod";

// @ts-ignore
import html from "./index.html";
import { Env } from "@/types/env";

export const basePath = "/inpaint";

export function newRouter(env: Env): RouterType {
  const router = Router({
    base: basePath,
  });

  router.get("/", async () => {
    return new Response(html, {
      headers: {
        "content-type": "text/html",
      },
    });
  });

  router.post("/", async (request: Request) => {
    const requestDataSchema = z.object({
      image: z.custom<File>(),
      mask: z.custom<File>(),
      prompt: z.string().min(1),
    });

    const formData = await request.formData();

    const requestData = Array.from(formData.keys()).reduce((result, key) => ({
      ...result,
      [key]: formData.get(key),
    }), {});

    const parsedRequestData = requestDataSchema.safeParse(requestData);

    if (!parsedRequestData.success) {
      return new Response(JSON.stringify({
        issues: parsedRequestData.error.issues,
      }), {
        status: 400,
        headers: {
          "tontent-type": "application/json",
        },
      });
    }

    const ai = new Ai(env.AI);

    console.log({
      image: parsedRequestData.data.image,
      mask: parsedRequestData.data.mask,
    });

    const imageBuffer = new Uint8Array(await parsedRequestData.data.image.arrayBuffer());
    const maskBuffer = new Uint8Array(await parsedRequestData.data.mask.arrayBuffer());

    const response = await ai.run("@cf/runwayml/stable-diffusion-v1-5-inpainting", {
      image: [...imageBuffer],
      mask: [...maskBuffer],
      prompt: parsedRequestData.data.prompt,
      strength: 0.8,
      num_steps: 10,
    });

    console.log({ response });

    return new Response(response, {
      headers: {
        "content-type": "image/png",
      },
    });
  });

  return router;
}
