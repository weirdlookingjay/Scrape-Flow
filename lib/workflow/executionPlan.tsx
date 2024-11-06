import { AppNode, AppNodeMissingInputs } from "@/types/appNode";
import {
    WorkflowExecutionPlan,
    WorkflowExecutionPlanPhase,
} from "@/types/workflow";
import { Edge, getIncomers } from "@xyflow/react";
import { TaskRegistry } from "./task/registry";

export enum FlowToExecutionPlanValidationError {
    "NO_ENTRY_POINT",
    "INVALID_INPUTS",
}

type FlowToExecutionPlanType = {
    executionPlan?: WorkflowExecutionPlan;
    error?: {
        type: FlowToExecutionPlanValidationError;
        invalidElements?: AppNodeMissingInputs[];
    }
};

export function FlowToExecutionPlan(
    nodes: AppNode[],
    edges: Edge[]
): FlowToExecutionPlanType {
    const entryPoint = nodes.find(
        (node) => TaskRegistry[node.data.type].isEntryPoint
    );
    if (!entryPoint) {
        return {
            error: {
                type: FlowToExecutionPlanValidationError.NO_ENTRY_POINT
            }
        }
    }

    const inputWithErrors: AppNodeMissingInputs[] = [];
    const planned = new Set<string>();

    const invalidInputs = getInvalidInputs(entryPoint, edges, planned);
    if (invalidInputs.length > 0) {
        inputWithErrors.push({
            nodeId: entryPoint.id,
            inputs: invalidInputs,
        })
    }

    const executionPlan: WorkflowExecutionPlan = [
        {
            phase: 1,
            nodes: [entryPoint],
        },
    ];

    planned.add(entryPoint.id);

    for (
        let phase = 2;
        phase <= nodes.length && planned.size < nodes.length;
        phase++
    ) {
        const nextPhase: WorkflowExecutionPlanPhase = { phase, nodes: [] };
        for (const currentNode of nodes) {
            if (planned.has(currentNode.id)) {
                // No already put in the execution plan
                continue;
            }

            const invalidInputs = getInvalidInputs(currentNode, edges, planned);
            if (invalidInputs.length > 0) {
                const incomers = getIncomers(currentNode, nodes, edges);
                if (incomers.every((incomer) => planned.has(incomer.id))) {
                    // If all incoming incomers/edges are planned and there are still invalid inputs
                    // this means that this particular node has an invalid input
                    // which means the workflow is invalid
                    console.error("invalid inputs", currentNode.id, invalidInputs);
                    if (invalidInputs.length > 0) {
                        inputWithErrors.push({
                            nodeId: currentNode.id,
                            inputs: invalidInputs,
                        })
                    }
                } else {
                    // let's skip this node fpr mow
                    continue;
                }
            }

            nextPhase.nodes.push(currentNode);
        }

        for (const node of nextPhase.nodes) {
            planned.add(node.id);
        }

        executionPlan.push(nextPhase);
    }

    if (inputWithErrors.length > 0) {
        return {
            error: {
                type: FlowToExecutionPlanValidationError.INVALID_INPUTS,
                invalidElements: inputWithErrors
            }
        }
    }

    return { executionPlan };
}

function getInvalidInputs(node: AppNode, edges: Edge[], planned: Set<string>) {
    const invalidInputs = [];
    const inputs = TaskRegistry[node.data.type].inputs;
    for (const input of inputs) {
        const inputValue = node.data.inputs[input.name];
        const inputValueProvided = inputValue?.length > 0;
        if (inputValueProvided) {
            // this input is fine, so we can move on
            continue;
        }

        // If a value is not provided  by the user then we need to checl
        // wif there is an outpit linked to the current input
        const incomingEdges = edges.filter((edge) => edge.target === node.id);
        const inputLinkedToOutput = incomingEdges.find(
            (edge) => edge.targetHandle === input.name
        );
        const requiredInputProvidedByVisitedOutput =
            input.required &&
            inputLinkedToOutput &&
            planned.has(inputLinkedToOutput.source);

        if (requiredInputProvidedByVisitedOutput) {
            // this input is required and we have a valid value for it
            // provided by a task that is already planned
            continue;
        } else if (!input.required) {
            // If the inpu is not required but there is an output linked to it
            // then we need to be surethat the output is also planned
            if (!inputLinkedToOutput) continue;
            if (inputLinkedToOutput && planned.has(inputLinkedToOutput.source)) {
                // The output is provding a value to the input
                continue;
            }
        }

        invalidInputs.push(input.name);
    }

    return invalidInputs;
}
