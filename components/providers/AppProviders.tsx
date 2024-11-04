"use client";

import { ThemeProvider } from 'next-themes';
import React from 'react'

type Props = {
  children: React.ReactNode
}

export const AppProviders = ({ children }: Props) => {
  return (
    <ThemeProvider defaultTheme='system' enableSystem attribute='class'>
      {children}
    </ThemeProvider>
  )
}