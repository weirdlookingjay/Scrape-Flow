"use client";

import { Workflow } from '@prisma/client';
import { ReactFlowProvider } from "@xyflow/react"
import FlowEditor from './FlowEditor';
import Topbar from './topbar/Topbar';
import TaskMenu from './TaskMenu';
import { FlowValidationContextProvider } from '@/components/context/FlowValidationContext';

interface Props {
    workflow: Workflow;
}

function Editor({ workflow }: Props) {
    return (
        <FlowValidationContextProvider>
            <ReactFlowProvider>
                <div className="flex flex-col h-full w-full overflow-hidden">
                    <Topbar title="Workflow editor" subTitle="Workflow name" workflowId={workflow.id} />
                    <section className="flex h-full overflow-auto">
                        <TaskMenu />
                        <FlowEditor workflow={workflow} />
                    </section>
                </div>
            </ReactFlowProvider>
        </FlowValidationContextProvider>
    )
}

export default Editor