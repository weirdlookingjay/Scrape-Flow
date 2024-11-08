import { AppNode } from "@/types/appNode";
import { ExecutionPhase } from "@prisma/client";
import { ExecutorRegistry } from "./executor/registry";

export async function executePhase(
  phase: ExecutionPhase,
  node: AppNode
): Promise<boolean> {
  const runFn = ExecutorRegistry[node.data.type];
  if (!runFn) {
    return false;
  }

  await runFn();
}
