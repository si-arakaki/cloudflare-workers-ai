nginx is required because:

Without reverse proxy, the oauth process by `wrangler login` does not work well in docker container.

details:

The command `wrangler login` starts server inside a container,
but it listens not `0.0.0.0` but `localhost`.

see: [workers-sdk/packages/wrangler/src/user/user.ts · cloudflare/workers-sdk](https://github.com/cloudflare/workers-sdk/blob/5b11492b7f3c88e3816a6fb19b5631dd4318745c/packages/wrangler/src/user/user.ts#L1017)
