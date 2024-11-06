"use client";

import { ParamProps } from '@/types/appNode';
import React from 'react'

export default function BrowserInstanceParam({ param }: ParamProps) {
    return (
        <div className="text-xs">{param.name}</div>
    )
}
