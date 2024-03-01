import { error, json } from "itty-router";

import { Env } from "@/types/env";

import {
	newRouter,
} from "./router";

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext) {
		return newRouter(env)
			.handle(request, env, ctx)
			.then(json)
			.catch(error);
	},
};
