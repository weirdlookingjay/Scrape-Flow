"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetWorkflowExecutions(workflowOd: string) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  return prisma.workflowExecution.findMany({
    where: {
      workflowId: workflowOd,
      userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}
