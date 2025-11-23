"use client";

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { AlertProvider } from '@/app/contexts/AlertContext';
import { NotificationProvider } from '@/app/contexts/NotificationContext';

type Props = {
  children: ReactNode;
};

import { AuthContextProvider } from "./providers";

export default function ClientProviders({ children, session }: Props & { session?: any }) {
  return (
    <SessionProvider session={session} refetchOnWindowFocus={false}>
      <AuthContextProvider>
        <AlertProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </AlertProvider>
      </AuthContextProvider>
    </SessionProvider>
  );
}
