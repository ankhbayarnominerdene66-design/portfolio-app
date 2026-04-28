'use client';
// src/app/admin/login/page.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { validateEmail } from '@/lib/validation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/Loading';

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading: authLoading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Already logged in үед dashboard руу шилжүүлнэ
  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/admin/dashboard');
    }
  }, [user, authLoading, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.email) newErrors.email = 'И-мэйл оруулна уу';
    else if (!validateEmail(form.email)) newErrors.email = 'И-мэйл буруу байна';
    if (!form.password) newErrors.password = 'Нууц үг оруулна уу';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    const result = await login(form.email, form.password);
    setSubmitting(false);

    if (result.success) {
      toast.success('Амжилттай нэвтэрлээ');
      router.replace('/admin/dashboard');
    } else {
      toast.error(result.error);
    }
  };

  if (authLoading) return <PageLoader />;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Буцах
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-400 text-white mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-display text-2xl font-bold mb-2">Admin нэвтрэх</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Удирдлагын самбарт нэвтэрнэ үү
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                label="И-мэйл"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="[email protected]"
                autoComplete="email"
              />
            </div>

            <div>
              <Input
                label="Нууц үг"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" loading={submitting} className="w-full mt-6">
              Нэвтрэх
            </Button>
          </form>

          <p className="text-xs text-center text-gray-500 mt-6">
            Зөвхөн админ хэрэглэгч нэвтэрнэ
          </p>
        </div>
      </motion.div>
    </div>
  );
}
