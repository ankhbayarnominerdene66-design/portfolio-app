'use client';
// src/app/admin/home/page.js

import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDocument } from '@/hooks/useFirestore';
import { setSingleDoc } from '@/lib/firestore';
import Input, { Textarea } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ImageUpload from '@/components/ui/ImageUpload';
import { PageLoader } from '@/components/ui/Loading';

export default function AdminHomePage() {
  const { data, loading, refetch } = useDocument('home');
  const [form, setForm] = useState({
    name: '',
    tagline: '',
    bio: '',
    profileImage: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name || '',
        tagline: data.tagline || '',
        bio: data.bio || '',
        profileImage: data.profileImage || '',
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Нэр оруулна уу');
      return;
    }

    setSaving(true);
    try {
      await setSingleDoc('home', form);
      toast.success('Амжилттай хадгаллаа');
      refetch();
    } catch (error) {
      toast.error('Хадгалахад алдаа гарлаа');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">Нүүр хуудас</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Нүүр хуудсанд харуулах танилцуулга мэдээллийг засна
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 space-y-5"
      >
        <ImageUpload
          label="Профайл зураг"
          value={form.profileImage}
          onChange={(url) => setForm((prev) => ({ ...prev, profileImage: url }))}
        />

        <Input
          label="Нэр"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="А.Номин-Эрдэнэ"
          required
        />

        <Input
          label="Богино тайлбар (Tagline)"
          name="tagline"
          value={form.tagline}
          onChange={handleChange}
          placeholder="Програм хангамжийн оюутан"
        />

        <Textarea
          label="Намтар (Bio)"
          name="bio"
          rows={5}
          value={form.bio}
          onChange={handleChange}
          placeholder="Өөрийн тухай товч танилцуулга..."
        />

        <div className="pt-4">
          <Button type="submit" loading={saving}>
            <Save className="w-4 h-4" />
            Хадгалах
          </Button>
        </div>
      </form>
    </div>
  );
}
