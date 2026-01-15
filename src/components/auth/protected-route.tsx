"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/contexts/user-context';
import { Loader2 } from 'lucide-react';

const PUBLIC_ROUTES = ['/login', '/signup'];

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useUser();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user && !PUBLIC_ROUTES.includes(pathname)) {
            router.push('/login');
        }
    }, [user, loading, router, pathname]);

    // Show loading while checking auth
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    // Show nothing while redirecting
    if (!user && !PUBLIC_ROUTES.includes(pathname)) {
        return null;
    }

    return <>{children}</>;
}
