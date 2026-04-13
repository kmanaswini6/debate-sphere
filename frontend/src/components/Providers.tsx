
'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { DebateProvider } from '@/context/DebateContext';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';

export default function Providers({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <DebateProvider>
                <Navbar />
                <main className="min-h-screen">{children}</main>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: 'rgba(0, 0, 0, 0.85)',
                            color: '#fff',
                            border: '1px solid rgba(201, 162, 39, 0.4)', // Antique Gold
                            backdropFilter: 'blur(10px)',
                        },
                        success: {
                            iconTheme: {
                                primary: '#7A1E1E', // Deep Burgundy
                                secondary: '#fff',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#800020', // Burgundy
                                secondary: '#fff',
                            },
                        },
                    }}
                />
            </DebateProvider>
        </AuthProvider>
    );
}