import { Router, RouterType } from "itty-router";

// @ts-ignore
import homeHtml from "./index.html";

export const basePath = "/";

export function newRouter(): RouterType {
  const router = Router({
    base: basePath,
  });

  router.get("/", async () => {
    return new Response(homeHtml, {
      headers: {
        "content-type": "text/html",
      },
    });
  });

  return router;
}
