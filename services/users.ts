import prisma from "@/lib/prisma";

const getUserByEmail = async (email: string) =>
  prisma.user.findUnique({
    where: {
      email,
    },
  });

const usersService = {
  getUserByEmail,
};

export default usersService;
