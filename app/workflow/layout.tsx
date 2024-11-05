import Logo from '@/components/Logo'
import { ModeToggle } from '@/components/ThemeModeToggle'
import { Separator } from '@/components/ui/separator'
import React from 'react'

type Props = {
    children: React.ReactNode
}

const layout = ({ children }: Props) => {
    return (
        <div className="flex flex-col w-full h-screen">
            {children}
            <Separator />
            <footer className="flex items-center justify-between p-2">
                <Logo iconSize={16} font-size="text-xl" />
                <ModeToggle />
            </footer>
        </div>
    )
}

export default layout