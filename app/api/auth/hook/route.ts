import prisma from "@/lib/prisma";

export const POST = async (req: Request) => {
  const { email, secret } = await req.json();

  if (secret !== process.env.AUTH0_HOOK_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!email) return new Response("Missing email", { status: 400 });

  await prisma.user.create({
    data: {
      email,
    },
  });
};
