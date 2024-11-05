
import { Loader2Icon } from 'lucide-react'
import React from 'react'

const loading = () => {
    return (
        <div className="h-screen w-full items-center justify-center">
            <Loader2Icon size={30} className="animate-spin stroke-primary" />
        </div>
    )
}

export default loading