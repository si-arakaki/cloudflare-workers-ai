import { Router, RouterType } from "itty-router";

import { Env } from "@/types/env";

import {
  basePath as homeBasePath,
  newRouter as newHomeRouter,
} from "./home";

import {
  basePath as apiChatPath,
  newRouter as newChatRouter,
} from "./chat";

import {
  basePath as inpaintChatPath,
  newRouter as newInpaintRouter,
} from "./inpaint";

export function newRouter(env: Env): RouterType {
  const router = Router();

  router.all(`${homeBasePath}/*`, newHomeRouter().handle);
  router.all(`${apiChatPath}/*`, newChatRouter(env).handle);
  router.all(`${inpaintChatPath}/*`, newInpaintRouter(env).handle);

  return router;
}
