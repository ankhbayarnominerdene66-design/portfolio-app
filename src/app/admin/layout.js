'use client';
// src/app/admin/layout.js

import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ProtectedRoute from '@/components/admin/ProtectedRoute';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  // Login хуудас нь protected байх ёсгүй
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <AdminSidebar />
        <main className="lg:ml-64 min-h-screen">
          <div className="p-6 lg:p-10 pt-20 lg:pt-10">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
