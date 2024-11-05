"use client";

import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskType } from "@/types/task";
import { Workflow } from "@prisma/client";
import {
    Background,
    BackgroundVariant,
    Controls,
    ReactFlow,
    useEdgesState,
    useNodesState,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import NodeComponent from "./nodes/NodeComponent";

interface Props {
    workflow: Workflow;
}

const nodeTypes = {
    FlowScrapeNode: NodeComponent,
};

const snapGrid: [number, number] = [50, 50]
const fitViewOptions = { padding: 1 }

function FlowEditor({ workflow }: Props) {
    const [nodes, setNodes, onNodesChange] = useNodesState([
        CreateFlowNode(TaskType.LAUNCH_BROWSER),
    ]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    return (
        <main className="h-full w-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onEdgesChange={onEdgesChange}
                onNodesChange={onNodesChange}
                nodeTypes={nodeTypes}
                snapToGrid
                snapGrid={snapGrid}
                fitViewOptions={fitViewOptions}
                fitView
            >
                <Controls position="top-left" fitViewOptions={fitViewOptions} />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
        </main>
    );
}

export default FlowEditor;
