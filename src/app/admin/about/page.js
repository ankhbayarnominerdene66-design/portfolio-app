'use client';
// src/app/admin/about/page.js

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDocument } from '@/hooks/useFirestore';
import { setSingleDoc } from '@/lib/firestore';
import Input, { Textarea } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ImageUpload from '@/components/ui/ImageUpload';
import { PageLoader } from '@/components/ui/Loading';

const emptyExperience = { title: '', company: '', period: '', description: '' };
const emptyEducation = { degree: '', school: '', period: '' };

export default function AdminAboutPage() {
  const { data, loading, refetch } = useDocument('about');
  const [form, setForm] = useState({
    fullName: '',
    description: '',
    image: '',
    university: '',
    year: '',
    major: '',
    location: '',
    email: '',
    experience: [],
    education: [],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setForm({
        fullName: data.fullName || '',
        description: data.description || '',
        image: data.image || '',
        university: data.university || '',
        year: data.year || '',
        major: data.major || '',
        location: data.location || '',
        email: data.email || '',
        experience: data.experience || [],
        education: data.education || [],
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, idx, key, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === idx ? { ...item, [key]: value } : item)),
    }));
  };

  const addItem = (field, empty) => {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], { ...empty }] }));
  };

  const removeItem = (field, idx) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) {
      toast.error('Бүтэн нэр оруулна уу');
      return;
    }

    setSaving(true);
    try {
      await setSingleDoc('about', form);
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
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">Танилцуулга</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Хувийн мэдээлэл, боловсрол, ажлын туршлага
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 space-y-5">
          <h2 className="font-display text-lg font-semibold">Үндсэн мэдээлэл</h2>

          <ImageUpload
            label="Зураг"
            value={form.image}
            onChange={(url) => setForm((prev) => ({ ...prev, image: url }))}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Бүтэн нэр"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
            />
            <Input label="И-мэйл" name="email" value={form.email} onChange={handleChange} />
            <Input
              label="Их сургууль"
              name="university"
              value={form.university}
              onChange={handleChange}
            />
            <Input label="Курс" name="year" value={form.year} onChange={handleChange} />
            <Input label="Мэргэжил" name="major" value={form.major} onChange={handleChange} />
            <Input label="Хаяг" name="location" value={form.location} onChange={handleChange} />
          </div>

          <Textarea
            label="Танилцуулга"
            name="description"
            rows={6}
            value={form.description}
            onChange={handleChange}
            placeholder="Өөрийн тухай..."
          />
        </div>

        {/* Experience */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-semibold">Туршлага</h2>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => addItem('experience', emptyExperience)}
            >
              <Plus className="w-4 h-4" />
              Нэмэх
            </Button>
          </div>

          <div className="space-y-4">
            {form.experience.map((exp, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 space-y-3"
              >
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeItem('experience', idx)}
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    placeholder="Албан тушаал"
                    value={exp.title}
                    onChange={(e) =>
                      handleArrayChange('experience', idx, 'title', e.target.value)
                    }
                  />
                  <Input
                    placeholder="Байгууллага"
                    value={exp.company}
                    onChange={(e) =>
                      handleArrayChange('experience', idx, 'company', e.target.value)
                    }
                  />
                  <Input
                    placeholder="Хугацаа (2023 - 2024)"
                    value={exp.period}
                    onChange={(e) =>
                      handleArrayChange('experience', idx, 'period', e.target.value)
                    }
                    className="sm:col-span-2"
                  />
                  <Textarea
                    placeholder="Тайлбар"
                    rows={2}
                    value={exp.description}
                    onChange={(e) =>
                      handleArrayChange('experience', idx, 'description', e.target.value)
                    }
                    className="sm:col-span-2"
                  />
                </div>
              </div>
            ))}
            {form.experience.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                Туршлага байхгүй байна. "Нэмэх" товчийг дарж эхлүүлнэ үү.
              </p>
            )}
          </div>
        </div>

        {/* Education */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-semibold">Боловсрол</h2>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => addItem('education', emptyEducation)}
            >
              <Plus className="w-4 h-4" />
              Нэмэх
            </Button>
          </div>

          <div className="space-y-4">
            {form.education.map((edu, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 space-y-3"
              >
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeItem('education', idx)}
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    placeholder="Зэрэг / Чиглэл"
                    value={edu.degree}
                    onChange={(e) =>
                      handleArrayChange('education', idx, 'degree', e.target.value)
                    }
                  />
                  <Input
                    placeholder="Сургууль"
                    value={edu.school}
                    onChange={(e) =>
                      handleArrayChange('education', idx, 'school', e.target.value)
                    }
                  />
                  <Input
                    placeholder="Хугацаа (2022 - 2026)"
                    value={edu.period}
                    onChange={(e) =>
                      handleArrayChange('education', idx, 'period', e.target.value)
                    }
                    className="sm:col-span-2"
                  />
                </div>
              </div>
            ))}
            {form.education.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                Боловсролын мэдээлэл байхгүй байна
              </p>
            )}
          </div>
        </div>

        <div className="sticky bottom-4 z-10">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-lg">
            <Button type="submit" loading={saving} className="w-full sm:w-auto">
              <Save className="w-4 h-4" />
              Бүгдийг хадгалах
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
