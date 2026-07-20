'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { useSocket } from '@/hooks/useSocket';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, ready, hydrate } = useAuthStore();
  const socketUserId = ready && user ? user._id : undefined;
  const [navigationOpen, setNavigationOpen] = useState(false);

  useSocket(socketUserId);
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!navigationOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setNavigationOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [navigationOpen]);

  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace('/login');
    if (!user || !['admin', 'manager'].includes(user.role)) router.replace('/dashboard');
  }, [user, ready, router]);

  if (!ready || !user || !['admin', 'manager'].includes(user.role))
    return <div className="flex min-h-screen items-center justify-center">Loading…</div>;

  return (
    <div className="flex min-h-screen min-w-0 overflow-x-hidden bg-slate-50">
      <Sidebar role="admin" className="hidden lg:block" />
      {navigationOpen && (
        <div id="mobile-navigation" className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
            onClick={() => setNavigationOpen(false)}
          />
          <Sidebar
            role="admin"
            className="relative z-10 h-full"
            onNavigate={() => setNavigationOpen(false)}
          />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          menuOpen={navigationOpen}
          onMenuClick={() => setNavigationOpen((open) => !open)}
        />
        <main className="min-w-0 flex-1 space-y-6 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
