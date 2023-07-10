import { handleAuth } from "@auth0/nextjs-auth0";

export const GET = handleAuth({
  onError: (err: unknown) => {
    console.error(err);
  },
});
