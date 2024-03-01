import { Ai } from "@cloudflare/ai";

import { Router, RouterType } from "itty-router";
import { z } from "zod";

// @ts-ignore
import html from "./index.html";
import { Env } from "@/types/env";

export const basePath = "/chat";

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
      prompt: z.string().min(1),
    });

    type RequestData = z.infer<typeof requestDataSchema>;

    const requestData = await request.json();

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

    const response = await ai.run("@cf/meta/llama-2-7b-chat-int8", {
      prompt: parsedRequestData.data.prompt,
    });

    return new Response(JSON.stringify({
      result: response,
    }), {
      headers: {
        "content-type": "application/json",
      },
    });
  });

  return router;
}
