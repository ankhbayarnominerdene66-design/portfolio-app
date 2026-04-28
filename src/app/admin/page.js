'use client';
// src/app/admin/page.js

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { PageLoader } from '@/components/ui/Loading';

export default function AdminIndex() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (user) router.replace('/admin/dashboard');
    else router.replace('/admin/login');
  }, [user, loading, router]);

  return <PageLoader />;
}
