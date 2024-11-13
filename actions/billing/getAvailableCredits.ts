"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GetAvailableCredits() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const balance = await prisma.userBalance.findUnique({
    where: {
      userId,
    },
  });
  if (!balance) return 10000;
  return balance.credits;
}
