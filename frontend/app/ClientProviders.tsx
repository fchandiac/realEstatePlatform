"use client";

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { AlertProvider } from '@/app/contexts/AlertContext';

type Props = {
  children: ReactNode;
};

import { AuthContextProvider } from "./providers";

export default function ClientProviders({ children, session }: Props & { session?: any }) {
  return (
    <SessionProvider session={session} refetchOnWindowFocus={false}>
      <AuthContextProvider>
        <AlertProvider>{children}</AlertProvider>
      </AuthContextProvider>
    </SessionProvider>
  );
}
