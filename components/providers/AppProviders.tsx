"use client";

import { ThemeProvider } from 'next-themes';
import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import NextTopLoader from "nextjs-toploader"
type Props = {
  children: React.ReactNode
}

export const AppProviders = ({ children }: Props) => {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <NextTopLoader color="#10b981" showSpinner={false} />
      <ThemeProvider defaultTheme='system' enableSystem attribute='class'>
        {children}
      </ThemeProvider>
      {/* <ReactQueryDevtools /> */}
    </QueryClientProvider>
  )
}