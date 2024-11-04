"use client";

import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface Props {
    children: ReactNode;
    content: ReactNode;
    side?: "top" | "bottom" | "left" | "right";
}

function TooltipWrapper({ children, content, side }: Props) {
    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent side={side}>{content}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export default TooltipWrapper;
