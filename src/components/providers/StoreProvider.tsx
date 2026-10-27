'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { ToastProvider } from '@/components/ui/Toast';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ToastProvider>{children}</ToastProvider>
    </Provider>
  );
}
