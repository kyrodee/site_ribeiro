'use client';

import { Toaster } from 'react-hot-toast';

export default function ToasterProvider() {
  return (
    <Toaster 
      position="bottom-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#333',
          color: '#fff',
          borderRadius: '8px',
          fontWeight: '500',
        },
        success: {
          style: {
            background: '#003B73',
            border: '1px solid #FFC000',
          },
          iconTheme: {
            primary: '#FFC000',
            secondary: '#003B73',
          },
        },
      }}
    />
  );
}
