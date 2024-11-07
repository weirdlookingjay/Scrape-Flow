"use client";

import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DatesToDruationString } from "@/lib/helper/dates";
import { GetPhasesTotalCost } from "@/lib/helper/phases";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
    CalendarIcon,
    CircleDashedIcon,
    ClockIcon,
    CoinsIcon,
    Loader2Icon,
    LucideIcon,
    WorkflowIcon,
} from "lucide-react";
import { ReactNode } from "react";

type ExecutionDate = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhases>>;

export default function ExecutionViewer({
    initialData,
}: {
    initialData: ExecutionDate;
}) {
    const query = useQuery({
        queryKey: ["execution", initialData?.id],
        initialData,
        queryFn: () => GetWorkflowExecutionWithPhases(initialData!.id),
        refetchInterval: (q) =>
            q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false,
    });

    const duration = DatesToDruationString(
        query.data?.completedAt,
        query.data?.startedAt
    );

    const creditsConsumed = GetPhasesTotalCost(query.data?.phases || []);

    return (
        <div className="flex w-full h-full">
            <aside className="w-[440px] min-w-[440px] max-w-[440px] border-r-2 bprder-separate flex flex-grow flex-col overflow-hidden">
                <div className="py-4 px-2">
                    {/* Status label */}
                    <ExecutionLabel
                        icon={CircleDashedIcon}
                        label="Status"
                        value={query.data?.status}
                    />

                    {/* Started at label */}
                    <ExecutionLabel
                        icon={CalendarIcon}
                        label="Started at"
                        value={
                            <span className="lowercase">
                                {query.data?.startedAt
                                    ? formatDistanceToNow(new Date(query.data?.startedAt), {
                                        addSuffix: true,
                                    })
                                    : "-"}
                            </span>
                        }
                    />
                    {/* Duration label */}
                    <ExecutionLabel icon={ClockIcon} label="Duration" value={duration ? (
                        duration
                    ) : (
                        <Loader2Icon size={20} className="animate-spin" />
                    )} />
                    {/* Credits label */}
                    <ExecutionLabel
                        icon={CoinsIcon}
                        label="Credits Consumed"
                        value={creditsConsumed}
                    />
                </div>
                <Separator />
                <div className="flex justify-center items-center py-2 px-4">
                    <div className="text-muted-foreground flex items-center gap-2">
                        <WorkflowIcon size={20} className="stroke-muted-foreground/80" />
                        <span className="font-semibold">Phases</span>
                    </div>
                </div>
                <Separator />
                <div className="overflow-auto h-full px-2 py-4">
                    {query.data?.phases.map((phase, index) => (
                        <Button
                            key={phase.id}
                            variant={"ghost"}
                            className="w-full justify-between"
                        >
                            <div className="flex items-center gap-2">
                                <Badge variant={"outline"}>{index + 1}</Badge>
                                <p className="font-semibold">{phase.name}</p>
                            </div>
                        </Button>
                    ))}
                </div>
            </aside>
        </div>
    );
}

function ExecutionLabel({
    icon,
    label,
    value,
}: {
    icon: LucideIcon;
    label: ReactNode;
    value: ReactNode;
}) {
    const Icon = icon;
    return (
        <div className="flex justify-between items-cente py-2 px-4 tetx-sm">
            <div className="text-muted-foreground flex items-center gap-2">
                <Icon size={20} className="stroke-muted-foreground/80" />
                <span>{label}</span>
            </div>
            <div className="font-semibold capitalize flex gap-2 items-center">
                {value}
            </div>
        </div>
    );
}
