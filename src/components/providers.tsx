'use client'

import {NextUIProvider} from '@nextui-org/system';
import {useRouter} from 'next/navigation'
import { SessionProvider } from 'next-auth/react';
import {Inter as Font} from 'next/font/google';

const font = Font({subsets: ['latin'], weight: '300'});

export function Providers({children}: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push} className={font.className}>
      <SessionProvider>
        {children}
      </SessionProvider>
    </NextUIProvider>
  )
}