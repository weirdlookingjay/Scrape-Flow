"use client";
import { TaskParam, TaskParamType } from '@/types/task';
import React from 'react'
import StringParam from './param/StringParam';

interface Props {
    param: TaskParam
}

function NodeParamField({ param }: Props) {
    switch (param.type) {
        case TaskParamType.STRING:
            return <StringParam param={param} />
        default:
            return <div className="w-full">
                <p className="text-xs text-muted-foreground">Not implemented</p>
            </div>
    }
}

export default NodeParamField